const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, controller.me);
router.get('/me/addresses', authMiddleware, controller.getAddresses);
router.post('/me/addresses', authMiddleware, controller.createAddress);
router.put('/me/addresses/:id', authMiddleware, controller.updateAddress);

module.exports = router;
