const prisma = require('../lib/prisma');
const orderService = require('../order/order.service');

async function listOrders(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });
    const filtered = status
      ? orders.filter((o) => o.statusHistory?.[o.statusHistory.length - 1]?.status === status)
      : orders;
    res.json({ orders: filtered, page: Number(page), limit: Number(limit) });
  } catch (e) { next(e); }
}

async function updateStatus(req, res, next) {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body);
    // e-mail de atualização (não bloqueia a resposta)
    try {
      const { sendOrderStatusEmail } = require('../lib/mailer');
      const user = await prisma.user.findUnique({ where: { id: order.userId } });
      if (user?.email) sendOrderStatusEmail(user.email, order).catch(() => {});
    } catch {}
    res.json(order);
  } catch (e) { next(e); }
}

async function stats(req, res, next) {
  try {
    const [users, products, orders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.findMany(),
    ]);
    const paid = orders.filter((o) => o.paymentStatus === 'paid');
    const revenue = paid.reduce((s, o) => s + (o.total || 0), 0);
    res.json({
      users,
      products,
      orders: orders.length,
      paidOrders: paid.length,
      pendingOrders: orders.length - paid.length,
      revenue,
    });
  } catch (e) { next(e); }
}

async function setRole(req, res, next) {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) return res.status(400).json({ error: 'Role inválida' });
    const user = await prisma.user.update({ where: { id: req.params.id }, data: { role } });
    const { passwordHash, ...safe } = user;
    res.json({ user: safe });
  } catch (e) { next(e); }
}

module.exports = { listOrders, updateStatus, stats, setRole };
