const express = require('express');
const router = express.Router();
const controller = require('./admin.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMidlleware');

router.use(authMiddleware, adminMiddleware);

router.get('/orders', controller.listOrders);
router.patch('/orders/:id/status', controller.updateStatus);
router.get('/stats', controller.stats);
router.patch('/users/:id/role', controller.setRole);

module.exports = router;
