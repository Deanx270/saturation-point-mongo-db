const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  bulkDeleteProducts,
  createProductReview,
  deleteReview,
  getProductById,
  getCategories
} = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

router.post('/:id/reviews', verifyToken, createProductReview);
router.delete('/:id/reviews/:reviewId', verifyToken, verifyAdmin, deleteReview);

router.post('/', verifyToken, verifyAdmin, upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
router.post('/bulk-delete', verifyToken, verifyAdmin, bulkDeleteProducts);

module.exports = router;
