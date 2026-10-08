const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendOrderStatusEmail } = require('../utils/emailService');

exports.createOrder = async (req, res) => {
  try {
    const { items, paymentMethod } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Fetch prices from DB to avoid client-side manipulation
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      
      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : ''
      });

      totalAmount += (product.price * item.quantity);
      
      // Decrease stock atomically to prevent race conditions and bypass unrelated schema validations
      await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
    }

    // Add shipping fee (150)
    totalAmount += 150;

    const order = new Order({
      user: req.mongoUser._id,
      orderItems,
      totalAmount,
      paymentMethod,
      status: 'pending'
    });

    const createdOrder = await order.save();
    
    // Send order confirmation email asynchronously
    Order.findById(createdOrder._id).populate('user', 'email displayName')
      .then(populatedOrder => {
        if (populatedOrder) {
          sendOrderStatusEmail(populatedOrder, true).catch(console.error);
        }
      })
      .catch(console.error);
      
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'displayName email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('user', 'email displayName');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'delivered') return res.status(400).json({ message: 'Cannot change a delivered order' });
    if (order.status === 'cancelled') return res.status(400).json({ message: 'Cannot change a cancelled order' });
    if (status === 'pending' && order.status !== 'pending') return res.status(400).json({ message: 'Cannot revert status back to pending' });
    if (status === 'cancelled' && order.status === 'shipped') return res.status(400).json({ message: 'Cannot cancel an order that has already shipped' });
    if (status === 'delivered' && order.status === 'pending') return res.status(400).json({ message: 'Cannot mark as delivered before shipping' });

    order.status = status;
    await order.save();

    // If order is cancelled, refund the stock
    if (status === 'cancelled') {
      for (const item of order.orderItems) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        }
      }
    }
    
    // Send email with PDF receipt in the background to prevent UI delay
    sendOrderStatusEmail(order).catch(console.error);
    
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Placeholder for user's own orders (for profile page)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.mongoUser._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
