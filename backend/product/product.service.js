const prisma = require('../lib/prisma');
const repository = require('./product.repository');

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function list(filters) {
  return repository.findMany(filters);
}

async function getBySlug(slug) {
  const product = await repository.findBySlug(slug);
  if (!product) { const e = new Error('Produto não encontrado'); e.status = 404; throw e; }
  return product;
}

async function createProduct(data, files) {
  const { name, description, price, categorySlug, variants } = data;
  const slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) { const e = new Error('Slug já existe'); e.status = 400; throw e; }

  let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
  if (!category) {
    category = await prisma.category.create({ data: { name: categorySlug, slug: categorySlug } });
  }

  const { uploadImage } = require('../lib/cloudinary');
  let images = [];
  if (files && files.length) {
    for (const f of files) {
      const url = await uploadImage(f.buffer);
      images.push(url);
    }
  } else if (data.images) {
    images = Array.isArray(data.images) ? data.images : [data.images];
  } else {
    images = ['https://via.placeholder.com/600'];
  }

  const product = await repository.create({
    name, slug, description, price: Number(price), images, categoryId: category.id,
  });

  // variants: JSON string ou array
  let vars = variants;
  if (typeof vars === 'string') try { vars = JSON.parse(vars); } catch {}
  if (Array.isArray(vars) && vars.length) {
    for (const v of vars) {
      await prisma.productVariant.create({
        data: { size: v.size, color: v.color, stock: Number(v.stock) || 0, sku: `${slug}-${v.size}-${v.color}`.toLowerCase(), productId: product.id },
      });
    }
  }

  return repository.findById(product.id);
}

async function updateProduct(id, data) {
  return repository.update(id, data);
}

async function deleteProduct(id) {
  return repository.remove(id);
}

module.exports = { list, getBySlug, createProduct, updateProduct, deleteProduct, slugify };
