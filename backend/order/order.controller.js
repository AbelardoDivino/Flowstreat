const service = require('./order.service');

async function create(req, res, next) {
  try { const order = await service.createOrder(req.user.id, req.body); res.status(201).json(order); } catch (e) { next(e); }
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
