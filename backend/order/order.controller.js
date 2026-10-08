const service = require('./order.service');

async function create(req, res, next) {
  try {
    const order = await service.createOrder(req.user.id, req.body);
    try {
      const env = require('../config/env');
      const { sendOrderCreatedEmail, sendNewSaleEmail } = require('../lib/mailer');
      const { notifyOwnerSale } = require('../lib/whatsapp');
      if (req.user.email) sendOrderCreatedEmail(req.user.email, order).catch(() => {});
      if (env.ADMIN_EMAIL) sendNewSaleEmail(env.ADMIN_EMAIL, order, req.user).catch(() => {});
      notifyOwnerSale(order, req.user).catch(() => {});
    } catch {}
    res.status(201).json(order);
  } catch (e) { next(e); }
}
async function myOrders(req, res, next) {
  try { const list = await service.getMyOrders(req.user.id); res.json(list); } catch (e) { next(e); }
}
async function getById(req, res, next) {
  try { const order = await service.getById(req.params.id, req.user); res.json(order); } catch (e) { next(e); }
}
async function updateStatus(req, res, next) {
  try { const order = await service.updateStatus(req.params.id, req.body); res.json(order); } catch (e) { next(e); }
}

module.exports = { create, myOrders, getById, updateStatus };
