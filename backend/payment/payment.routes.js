const express = require('express');
const router = express.Router();
const controller = require('./payment.controller');
const webhook = require('./webhook.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const { paymentLimiter } = require('../middlewares/rateLimiter');

router.post('/pix', paymentLimiter, authMiddleware, controller.pix);
router.post('/card', paymentLimiter, authMiddleware, controller.card);
router.post('/boleto', paymentLimiter, authMiddleware, controller.boleto);
router.post('/webhook', webhook);
router.post('/webhooks/mercadopago', webhook);

module.exports = router;
