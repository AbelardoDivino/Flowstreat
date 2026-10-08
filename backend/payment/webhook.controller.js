const crypto = require('crypto');
const prisma = require('../lib/prisma');
const env = require('../config/env');
const paymentService = require('./payment.service');

// Valida x-signature do Mercado Pago (doc oficial). Sem secret configurado, pula.
function validSignature(req) {
  if (!env.MERCADOPAGO_WEBHOOK_SECRET) return true;
  try {
    const signature = req.headers['x-signature'] || '';
    const requestId = req.headers['x-request-id'] || '';
    const dataId = (req.query['data.id'] || '').toLowerCase();
    const parts = Object.fromEntries(signature.split(',').map((p) => p.split('=')));
    if (!parts.ts || !parts.v1 || !dataId || !requestId) return false;
    const manifest = `id:${dataId};request-id:${requestId};ts:${parts.ts};`;
    const hmac = crypto.createHmac('sha256', env.MERCADOPAGO_WEBHOOK_SECRET).update(manifest).digest('hex');
    return hmac === parts.v1;
  } catch {
    return false;
  }
}

async function markPaid(orderId, note, mpId) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || order.paymentStatus === 'paid') return order; // idempotente
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: 'paid',
      mercadopagoId: mpId ? String(mpId) : order.mercadopagoId,
      statusHistory: [...order.statusHistory, { status: 'pagamento_confirmado', date: new Date(), note }],
    },
  });
  try {
    const { sendPaymentConfirmedEmail } = require('../lib/mailer');
    const user = await prisma.user.findUnique({ where: { id: order.userId } });
    if (user?.email) sendPaymentConfirmedEmail(user.email, updated).catch(() => {});
  } catch {}
  return updated;
}

async function webhook(req, res) {
  try {
    if (!validSignature(req)) {
      console.error('[webhook] assinatura inválida');
      return res.status(401).send('invalid signature');
    }
    const dataId = req.body?.data?.id || req.query['data.id'];
    if (!dataId) return res.status(200).send('ok');

    // 1) Tenta como notificação de ORDER (Orders API v2)
    const mpOrder = await paymentService.getMpOrder(String(dataId));
    if (mpOrder && mpOrder.external_reference) {
      const payments = mpOrder.transactions?.payments || [];
      const paid = payments.some((p) => ['approved', 'accredited'].includes(p.status));
      if (paid) await markPaid(mpOrder.external_reference, 'Webhook MP order', mpOrder.id);
      return res.status(200).send('ok');
    }

    // 2) Fallback: notificação de PAYMENT (Payments API — cartão/boleto)
    const payment = await paymentService.getPaymentStatus(dataId);
    if (!payment) return res.status(200).send('ok');
    if (payment.external_reference && payment.status === 'approved') {
      await markPaid(payment.external_reference, `Webhook MP ${payment.status}`, payment.id);
    }
    res.status(200).send('ok');
  } catch (e) {
    console.error('webhook error', e.message);
    res.status(200).send('ok');
  }
}

module.exports = webhook;
