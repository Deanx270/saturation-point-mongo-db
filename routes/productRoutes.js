const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  bulkDeleteProducts 
} = require('../controllers/productController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

// Public route to view products
router.get('/', getProducts);

// Admin Protected Routes
router.post('/', verifyToken, verifyAdmin, upload.array('images', 5), createProduct);
router.put('/:id', verifyToken, verifyAdmin, upload.array('images', 5), updateProduct);
router.delete('/:id', verifyToken, verifyAdmin, deleteProduct);
router.post('/bulk-delete', verifyToken, verifyAdmin, bulkDeleteProducts);

module.exports = router;
