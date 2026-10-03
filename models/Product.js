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
  brand: {
    type: String,
    required: [true, 'Please provide a product brand']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category']
  },
  stock: {
    type: Number,
    default: 1
  },
  images: [{
    type: String // Array of Cloudinary image URLs
  }],
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true }
    }
  ],
  rating: {
    type: Number,
    required: true,
    default: 0
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
