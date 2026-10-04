const express = require('express');
const router = express.Router();
const { getAllOrders, updateOrderStatus, getMyOrders } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/myorders', verifyToken, getMyOrders);
router.get('/', verifyToken, verifyAdmin, getAllOrders);
router.put('/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

module.exports = router;
