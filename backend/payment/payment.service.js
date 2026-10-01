const { Payment } = require('mercadopago');
const client = require('./mercadopago.client');
const prisma = require('../lib/prisma');

async function createPixPayment(order, payerEmail) {
  if (!client) throw Object.assign(new Error('Mercado Pago não configurado'), { status: 500 });
  const payment = new Payment(client);
  const body = {
    transaction_amount: Number(order.total),
    description: `FlowStreat Pedido ${order.id}`,
    payment_method_id: 'pix',
    payer: { email: payerEmail || 'test@example.com' },
    external_reference: order.id,
  };
  const result = await payment.create({ body });
  await prisma.order.update({ where: { id: order.id }, data: { mercadopagoId: String(result.id) } });
  const poi = result.point_of_interaction || {};
  return {
    id: result.id,
    status: result.status,
    qr_code: poi.transaction_data?.qr_code_base64,
    qr_code_text: poi.transaction_data?.qr_code,
    ticket_url: result.transaction_details?.external_resource_url,
  };
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
      identification: { type: 'CPF', number: '19119111000' },
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

module.exports = { createPixPayment, createCardPayment, createBoletoPayment, getPaymentStatus };
