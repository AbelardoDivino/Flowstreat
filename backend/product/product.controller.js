const service = require('./product.service');

async function list(req, res, next) {
  try {
    const result = await service.list(req.query);
    res.json(result);
  } catch (e) { next(e); }
}

async function getBySlug(req, res, next) {
  try {
    const product = await service.getBySlug(req.params.slug);
    res.json(product);
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const product = await service.createProduct(req.body, req.files);
    res.status(201).json(product);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const product = await service.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    await service.deleteProduct(req.params.id);
    res.json({ message: 'Removido' });
  } catch (e) { next(e); }
}

module.exports = { list, getBySlug, create, update, remove };
