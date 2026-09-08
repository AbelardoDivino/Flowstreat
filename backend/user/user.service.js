const prisma = require('../lib/prisma');

async function getAddresses(userId) {
  return prisma.address.findMany({ where: { userId } });
}

async function createAddress(userId, data) {
  return prisma.address.create({ data: { ...data, userId } });
}

async function updateAddress(userId, id, data) {
  const addr = await prisma.address.findFirst({ where: { id, userId } });
  if (!addr) { const e = new Error('Endereço não encontrado'); e.status = 404; throw e; }
  return prisma.address.update({ where: { id }, data });
}

module.exports = { getAddresses, createAddress, updateAddress };
