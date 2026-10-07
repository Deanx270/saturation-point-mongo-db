const Order = require('../models/Order');
const Product = require('../models/Product');

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
        return res.status(404).json({ message: \`Product not found: \${item.productId}\` });
      }
      
      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: \`Insufficient stock for \${product.name}\` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images && product.images.length > 0 ? product.images[0] : ''
      });

      totalAmount += (product.price * item.quantity);
      
      // Decrease stock
      product.stock -= item.quantity;
      await product.save();
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
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
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
