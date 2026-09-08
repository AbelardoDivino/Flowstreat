const express = require('express');
const router = express.Router();
const controller = require('./order.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMidlleware');

router.post('/', authMiddleware, controller.create);
router.get('/me', authMiddleware, controller.myOrders);
router.get('/:id', authMiddleware, controller.getById);
router.patch('/:id/status', authMiddleware, adminMiddleware, controller.updateStatus);

module.exports = router;
