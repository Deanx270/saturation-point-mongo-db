const Product = require('../models/Product');
const { Filter } = require('bad-words');

exports.getProducts = async (req, res) => {
  try {
    const { keyword, category, minPrice, maxPrice, minRating, page, limit } = req.query;
    
    let query = {};
    
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ];
    }
    
    if (category) {
      const categories = category.split(',').map(c => c.trim());
      if (categories.length > 0) {
        query.category = { $in: categories };
      }
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    const pageNum = Number(page) || 1;
    const pageSize = Number(limit) || 12;
    const skip = (pageNum - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      products,
      page: pageNum,
      pages: Math.ceil(total / pageSize),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'displayName email photoURL');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, brand, category, stock } = req.body;
    
    const images = req.files ? req.files.map(file => file.path) : [];

    const product = await Product.create({
      name, description, price, brand, category, stock, images
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
                const pathParts = parts.slice(uploadIndex + 2);
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
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map(file => file.path);
        updateData.$push = { images: { $each: newImages } };
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: 'No product IDs provided' });
    }
    
    await Product.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: `${ids.length} products deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProductReview = async (req, res) => {
  try {
    const { rating, comment, name } = req.body;
    const productId = req.params.id;

    if (comment && comment.length > 500) {
      return res.status(400).json({ message: 'Review must be at most 500 characters' });
    }

    let sanitizedComment = comment;
    if (sanitizedComment) {
      const filter = new Filter();
      filter.addWords('putangina', 'gago', 'tarantado', 'bobo', 'tangina', 'ulol', 'pota', 'puta', 'hayop', 'lintik', 'leche', 'pakyu', 'yawa', 'pisti', 'giatay', 'bwisit', 'punyeta', 'tae', 'kantot');
      sanitizedComment = filter.clean(sanitizedComment);
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.mongoUser._id.toString());

    if (alreadyReviewed) {
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = sanitizedComment;
      alreadyReviewed.name = name;
    } else {
      const review = {
        name,
        rating: Number(rating),
        comment: sanitizedComment,
        user: req.mongoUser._id
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
    }

    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    
    await product.save({ validateModifiedOnly: true });
    res.status(201).json({ message: alreadyReviewed ? 'Review updated' : 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const reviewId = req.params.reviewId;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === reviewId);
    if (reviewIndex === -1) return res.status(404).json({ message: 'Review not found' });

    product.reviews.splice(reviewIndex, 1);
    
    product.numReviews = product.reviews.length;
    if (product.numReviews > 0) {
      product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save({ validateModifiedOnly: true });
    res.status(200).json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
