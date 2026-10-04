const express = require('express');
const router = express.Router();
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', getBrands);
router.post('/', verifyToken, verifyAdmin, createBrand);
router.put('/:id', verifyToken, verifyAdmin, updateBrand);
router.delete('/:id', verifyToken, verifyAdmin, deleteBrand);

module.exports = router;
