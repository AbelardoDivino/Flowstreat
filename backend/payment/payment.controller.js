const prisma = require('../lib/prisma');
const paymentService = require('./payment.service');

async function getOrderForPayment(orderId, user) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) { const e = new Error('Pedido não encontrado'); e.status = 404; throw e; }
  if (order.userId !== user.id && user.role !== 'admin') { const e = new Error('Acesso negado'); e.status = 403; throw e; }
  return order;
}

async function pix(req, res, next) {
  try {
    const order = await getOrderForPayment(req.body.orderId, req.user);
    const result = await paymentService.createPixPayment(order, req.user.email);
    res.json(result);
  } catch (e) { next(e); }
}

async function card(req, res, next) {
  try {
    const { orderId, token, installments, paymentMethodId, issuerId } = req.body;
    const order = await getOrderForPayment(orderId, req.user);
    const result = await paymentService.createCardPayment(order, { token, installments, paymentMethodId, issuerId, payerEmail: req.user.email });
    // atualizar status se aprovado
    if (result.status === 'approved') {
      await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: 'paid', statusHistory: [...order.statusHistory, { status: 'pagamento_confirmado', date: new Date(), note: 'Cartão aprovado' }] } });
    }
    res.json(result);
  } catch (e) { next(e); }
}

async function boleto(req, res, next) {
  try {
    const order = await getOrderForPayment(req.body.orderId, req.user);
    const result = await paymentService.createBoletoPayment(order, req.user.email);
    res.json(result);
  } catch (e) { next(e); }
}

async function status(req, res, next) {
  try {
    const mpId = req.params.mpId;
    const result = await paymentService.getPaymentStatus(mpId);
    if (!result) return res.status(404).json({ error: 'Pagamento não encontrado' });
    res.json({ id: result.id, status: result.status });
  } catch (e) { next(e); }
}

module.exports = { pix, card, boleto, status };
