const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category (e.g., Fountain Pens, Inks)']
  },
  stock: {
    type: Number,
    default: 1
  },
  images: [{
    type: String // Array of Cloudinary image URLs
  }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
