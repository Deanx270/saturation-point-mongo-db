const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product (handles multiple images)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    
    // Extract image URLs from multer's req.files array
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({
      name, description, price, category, stock, images
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const updateData = { name, description, price, category, stock };
    
    // If new images are uploaded, add them to the array
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      updateData.$push = { images: { $each: newImages } }; // Append new images
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a single product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk Delete (MP1 Requirement: using checkboxes in frontend to send array of IDs)
exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body; // Expects an array of product IDs
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: 'No product IDs provided' });
    }
    
    await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${ids.length} products deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
