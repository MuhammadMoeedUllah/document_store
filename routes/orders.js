const express = require('express');
const router = express.Router();
const {orders} = require('../controllers')

router.post('/create', orders.createOrder);
router.get('/list', orders.getAllOrders);

module.exports = router;
