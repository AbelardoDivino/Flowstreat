const { Payment } = require('mercadopago');
const client = require('./mercadopago.client');
const env = require('../config/env');
const prisma = require('../lib/prisma');

function mpHeaders(idempotencyKey) {
  return {
    Authorization: `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Idempotency-Key': idempotencyKey,
  };
}

async function mpFetch(path, { method = 'GET', body, idempotencyKey } = {}) {
  const res = await fetch(`https://api.mercadopago.com${path}`, {
    method,
    headers: mpHeaders(idempotencyKey || `${method}-${Date.now()}`),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Mercado Pago ${res.status}`);
    err.status = res.status >= 500 ? 500 : res.status;
    err.mpData = data;
    throw err;
  }
  return data;
}

// Pix via Payments API (SDK) com idempotencyKey — payer mínimo (email + nome).
// Chave de idempotência derivada do pedido: clique duplo não duplica cobrança.
async function createPixPayment(order, payerEmail) {
  if (!client) throw Object.assign(new Error('Mercado Pago não configurado'), { status: 500 });
  const payment = new Payment(client);
  const firstName = (payerEmail || 'cliente@email.com').split('@')[0].split(/[._-]+/).join(' ') || 'Cliente';
  const result = await payment.create({
    body: {
      transaction_amount: Number(order.total),
      description: `FlowStreat Pedido ${order.id}`,
      payment_method_id: 'pix',
      payer: { email: payerEmail || 'cliente@email.com', first_name: firstName },
      external_reference: order.id,
    },
    requestOptions: { idempotencyKey: `pix-${order.id}` },
  });
  await prisma.order.update({ where: { id: order.id }, data: { mercadopagoId: String(result.id) } });
  const txData = result.point_of_interaction?.transaction_data || {};
  return {
    id: result.id,
    status: result.status,
    qr_code: txData.qr_code_base64,
    qr_code_text: txData.qr_code,
    ticket_url: result.transaction_details?.external_resource_url,
  };
}

async function getMpOrder(mpOrderId) {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) return null;
  try {
    return await mpFetch(`/v1/orders/${mpOrderId}`);
  } catch {
    return null;
  }
}

async function createCardPayment(order, { token, installments, paymentMethodId, issuerId, payerEmail }) {
  if (!client) throw Object.assign(new Error('Mercado Pago não configurado'), { status: 500 });
  const payment = new Payment(client);
  const body = {
    transaction_amount: Number(order.total),
    token,
    installments: Number(installments) || 1,
    payment_method_id: paymentMethodId,
    issuer_id: issuerId ? Number(issuerId) : undefined,
    payer: { email: payerEmail || 'test@example.com' },
    external_reference: order.id,
    description: `FlowStreat Pedido ${order.id}`,
  };
  const result = await payment.create({ body });
  await prisma.order.update({ where: { id: order.id }, data: { mercadopagoId: String(result.id) } });
  return { id: result.id, status: result.status, detail: result.status_detail };
}

async function createBoletoPayment(order, payerEmail) {
  if (!client) throw Object.assign(new Error('Mercado Pago não configurado'), { status: 500 });
  const payment = new Payment(client);
  // No Brasil o id é bolbradesco
  const body = {
    transaction_amount: Number(order.total),
    description: `FlowStreat Pedido ${order.id}`,
    payment_method_id: 'bolbradesco',
    payer: {
      email: payerEmail || 'test@example.com',
      first_name: 'FlowStreat',
      last_name: 'Cliente',
      identification: { type: 'CPF', number: '12345678909' },
      address: { zip_code: '06233200', street_name: 'Av. das Nações Unidas', street_number: '3003', neighborhood: 'Bonfim', city: 'Osasco', federal_unit: 'SP' },
    },
    external_reference: order.id,
  };
  const result = await payment.create({ body });
  await prisma.order.update({ where: { id: order.id }, data: { mercadopagoId: String(result.id) } });
  return {
    id: result.id,
    status: result.status,
    barcode: result.barcode?.content,
    ticket_url: result.transaction_details?.external_resource_url,
  };
}

async function getPaymentStatus(paymentId) {
  if (!client) return null;
  const payment = new Payment(client);
  const result = await payment.get({ id: paymentId });
  return result;
}

module.exports = { createPixPayment, createCardPayment, createBoletoPayment, getPaymentStatus, getMpOrder };
