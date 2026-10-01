const prisma = require('../lib/prisma');
const paymentService = require('./payment.service');

async function webhook(req, res) {
  try {
    const { data, type } = req.body;
    // Mercado Pago envia data.id
    const paymentId = data?.id || req.query['data.id'];
    if (!paymentId) return res.status(200).send('ok');

    const payment = await paymentService.getPaymentStatus(paymentId);
    if (!payment) return res.status(200).send('ok');

    const orderId = payment.external_reference;
    if (!orderId) return res.status(200).send('ok');

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(200).send('ok');

    if (payment.status === 'approved' && order.paymentStatus !== 'paid') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: 'paid',
          mercadopagoId: String(payment.id),
          statusHistory: [...order.statusHistory, { status: 'pagamento_confirmado', date: new Date(), note: `Webhook MP ${payment.status}` }],
        },
      });
    }
    res.status(200).send('ok');
  } catch (e) {
    console.error('webhook error', e.message);
    res.status(200).send('ok');
  }
}

module.exports = webhook;
