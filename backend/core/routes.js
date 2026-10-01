const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', require('../auth/auth.routes'));
router.use('/products', require('../product/product.routes'));
router.use('/users', require('../user/user.routes'));
router.use('/orders', require('../order/order.routes'));
router.use('/payments', require('../payment/payment.routes'));
router.use('/webhooks', require('../payment/payment.routes'));
router.use('/admin', require('../admin/admin.routes'));

module.exports = router;
