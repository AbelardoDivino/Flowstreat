const prisma = require('../lib/prisma');

async function findMany({ category, size, color, minPrice, maxPrice, page = 1, limit = 12, search, active = true }) {
  const where = {};
  if (active !== undefined) where.active = active;
  if (category) {
    where.category = { slug: category };
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  // filtro por variante exige busca separada e pós-filtro
  let products = await prisma.product.findMany({
    where,
    include: { variants: true, category: true },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: Number(limit),
  });

  if (size || color) {
    products = products.filter((p) =>
      p.variants.some((v) => (!size || v.size === size) && (!color || v.color === color) && v.stock > 0)
    );
  }

  const total = products.length;
  return { products, total, page: Number(page), limit: Number(limit) };
}

async function findBySlug(slug) {
  return prisma.product.findUnique({
    where: { slug },
    include: { variants: true, category: true },
  });
}

async function findById(id) {
  return prisma.product.findUnique({ where: { id }, include: { variants: true, category: true } });
}

async function create(data) {
  return prisma.product.create({ data, include: { variants: true, category: true } });
}

async function update(id, data) {
  return prisma.product.update({ where: { id }, data, include: { variants: true } });
}

async function remove(id) {
  await prisma.productVariant.deleteMany({ where: { productId: id } });
  return prisma.product.delete({ where: { id } });
}

module.exports = { findMany, findBySlug, findById, create, update, remove };
