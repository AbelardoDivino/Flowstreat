const prisma = require('../lib/prisma');

async function createOrder(userId, { items, addressId, paymentMethod }) {
  if (!items?.length) { const e = new Error('Carrinho vazio'); e.status = 400; throw e; }
  if (!['pix', 'card', 'boleto'].includes(paymentMethod)) { const e = new Error('Método inválido'); e.status = 400; throw e; }

  const address = await prisma.address.findFirst({ where: { id: addressId, userId } });
  if (!address) { const e = new Error('Endereço não encontrado'); e.status = 404; throw e; }

  // recalcular total com preços reais
  let total = 0;
  const orderItems = [];
  for (const it of items) {
    const variant = await prisma.productVariant.findUnique({ where: { id: it.variantId }, include: { product: true } });
    if (!variant) { const e = new Error(`Variante ${it.variantId} não encontrada`); e.status = 400; throw e; }
    if (variant.stock < it.quantity) { const e = new Error(`Estoque insuficiente para ${variant.product.name}`); e.status = 400; throw e; }
    const unitPrice = variant.product.price;
    total += unitPrice * it.quantity;
    orderItems.push({
      productId: variant.productId,
      variantId: variant.id,
      name: variant.product.name,
      size: variant.size,
      color: variant.color,
      quantity: it.quantity,
      unitPrice,
    });
  }

  // frete simples: grátis >200 senão 15
  const shipping = total > 200 ? 0 : 15;
  total += shipping;

  const order = await prisma.order.create({
    data: {
      userId,
      items: orderItems,
      address: address,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      statusHistory: [{ status: 'pedido_criado', date: new Date(), note: '' }],
    },
  });
  return order;
}

async function getMyOrders(userId) {
  return prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
}

async function getById(id, user) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) { const e = new Error('Pedido não encontrado'); e.status = 404; throw e; }
  if (order.userId !== user.id && user.role !== 'admin') { const e = new Error('Acesso negado'); e.status = 403; throw e; }
  return order;
}

async function updateStatus(id, { status, note, trackingCode }) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) { const e = new Error('Pedido não encontrado'); e.status = 404; throw e; }
  const history = [...order.statusHistory, { status, date: new Date(), note: note || '' }];
  return prisma.order.update({
    where: { id },
    data: { statusHistory: history, trackingCode: trackingCode || order.trackingCode, paymentStatus: status === 'pagamento_confirmado' ? 'paid' : order.paymentStatus },
  });
}

module.exports = { createOrder, getMyOrders, getById, updateStatus };
