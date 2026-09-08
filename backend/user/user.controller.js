const service = require('./user.service');

async function getAddresses(req, res, next) {
  try { const list = await service.getAddresses(req.user.id); res.json(list); } catch (e) { next(e); }
}
async function createAddress(req, res, next) {
  try { const addr = await service.createAddress(req.user.id, req.body); res.status(201).json(addr); } catch (e) { next(e); }
}
async function updateAddress(req, res, next) {
  try { const addr = await service.updateAddress(req.user.id, req.params.id, req.body); res.json(addr); } catch (e) { next(e); }
}
async function me(req, res) { res.json({ user: req.user }); }

module.exports = { getAddresses, createAddress, updateAddress, me };
