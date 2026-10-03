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
    const { name, description, price, brand, category, stock } = req.body;
    
    // Extract image URLs from multer's req.files array
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({
      name, description, price, brand, category, stock, images
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, brand, category, stock, imageOrder } = req.body;
    const updateData = { name, description, price, brand, category, stock };
    
    if (imageOrder) {
      const orderArray = JSON.parse(imageOrder);
      let finalImages = [];
      let fileIndex = 0;
      const newImages = req.files ? req.files.map(file => file.path) : [];
      
      for (const item of orderArray) {
        if (item === 'new') {
          if (fileIndex < newImages.length) {
            finalImages.push(newImages[fileIndex]);
            fileIndex++;
          }
        } else {
          finalImages.push(item);
        }
      }
      updateData.images = finalImages;

      // Find old product to compare and delete removed images from Cloudinary
      const oldProduct = await Product.findById(req.params.id);
      if (oldProduct && oldProduct.images) {
        const deletedImages = oldProduct.images.filter(img => !finalImages.includes(img));
        
        if (deletedImages.length > 0) {
          const { cloudinary } = require('../utils/cloudinary');
          for (const url of deletedImages) {
            try {
              const parts = url.split('/');
              const uploadIndex = parts.indexOf('upload');
              if (uploadIndex !== -1) {
                const pathParts = parts.slice(uploadIndex + 2); // skip upload and version
                const fullPath = pathParts.join('/');
                const publicId = fullPath.substring(0, fullPath.lastIndexOf('.')) || fullPath;
                await cloudinary.uploader.destroy(publicId);
              }
            } catch (err) {
              console.error('Failed to delete image from cloudinary:', err);
            }
          }
        }
      }
    } else {
      // Fallback if no imageOrder is provided
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path);
        updateData.$push = { images: { $each: newImages } }; // Append new images
      }
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

// Create or update a review
exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.mongoUser._id.toString());

    if (alreadyReviewed) {
      // Update existing review (MP3 Requirement: Users can update their own review/rating)
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      alreadyReviewed.name = name;
    } else {
      // Create new review
      const review = {
        name,
        rating: Number(rating),
        comment,
        user: req.mongoUser._id
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
    }

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    
    await product.save();
    res.status(201).json({ message: alreadyReviewed ? 'Review updated' : 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review (Admin)
exports.deleteReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviewId = req.params.reviewId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });

    // Ensure it's the admin deleting (this will be protected by verifyAdmin in routes anyway)
    product.reviews.splice(reviewIndex, 1);
    
    product.numReviews = product.reviews.length;
    if (product.numReviews > 0) {
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
