const nodemailer = require('nodemailer');
const env = require('../config/env');

let transporter = null;

function isConfigured() {
  return env.SMTP_USER && env.SMTP_USER !== 'pendente@gmail.com' && env.SMTP_PASS && env.SMTP_PASS !== 'pendente_senha_app';
}

function getTransporter() {
  if (!isConfigured()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    });
  }
  return transporter;
}

async function sendEmail(to, subject, html) {
  const t = getTransporter();
  if (!t) {
    console.log(`[mailer] SMTP não configurado — e-mail para ${to} ignorado: ${subject}`);
    return false;
  }
  await t.sendMail({ from: `FlowStreat <${env.SMTP_USER}>`, to, subject, html });
  return true;
}

function sendOrderCreatedEmail(to, order) {
  return sendEmail(to, `Pedido ${order.id.slice(-6)} recebido — FlowStreat`,
    `<h2>Pedido recebido!</h2><p>Total: R$ ${order.total.toFixed(2)}</p><p>Método: ${order.paymentMethod}</p><p>Acompanhe em Meus Pedidos.</p>`);
}

const TRACK_URL = 'https://rastreamento.correios.com.br/app/index.php';

function trackingBlock(order) {
  if (!order.trackingCode) return '<p>Ainda sem código de rastreio — avisaremos por e-mail quando o pedido for enviado.</p>';
  return `<p><strong>Código de rastreio: ${order.trackingCode}</strong></p><p><a href="${TRACK_URL}">Rastrear nos Correios</a></p>`;
}

function historyList(order) {
  return `<ul>${(order.statusHistory || []).map((h) => `<li>${h.status} — ${new Date(h.date).toLocaleString('pt-BR')}${h.note ? ` (${h.note})` : ''}</li>`).join('')}</ul>`;
}

function sendOrderStatusEmail(to, order) {
  const current = order.statusHistory?.[order.statusHistory.length - 1]?.status;
  return sendEmail(to, `Pedido #${order.id.slice(-6)}: ${current} — FlowStreat`,
    `<h2>Seu pedido foi atualizado: ${current}</h2>${trackingBlock(order)}${historyList(order)}<p><a href="${env.FRONTEND_URL}/meus-pedidos">Acompanhar meus pedidos</a></p>`);
}

function sendPaymentConfirmedEmail(to, order) {
  return sendEmail(to, `Pagamento confirmado! Pedido #${order.id.slice(-6)} — FlowStreat`,
    `<h2>Pagamento confirmado!</h2><p>Já estamos preparando seu pedido de R$ ${order.total.toFixed(2)}.</p>${historyList(order)}<p><a href="${env.FRONTEND_URL}/meus-pedidos">Acompanhar meus pedidos</a></p>`);
}

function orderDetailsHtml(order, customer) {
  const addr = order.address || {};
  const items = (order.items || []).map((it) =>
    `<li>${it.name} — tamanho ${it.size}, cor ${it.color} — x${it.quantity} — R$ ${(it.unitPrice * it.quantity).toFixed(2)}</li>`
  ).join('');
  return `<h2>Nova venda! Pedido #${order.id.slice(-6)}</h2>
<p><strong>Cliente:</strong> ${customer?.name || ''} (${customer?.email || ''})</p>
<p><strong>Entregar em:</strong> ${addr.street || ''}, ${addr.number || ''}${addr.complement ? ' — ' + addr.complement : ''} — ${addr.neighborhood ? addr.neighborhood + ' — ' : ''}${addr.city || ''}/${addr.state || ''} — CEP ${addr.zipCode || ''}</p>
<ul>${items}</ul>
<p><strong>Total: R$ ${order.total.toFixed(2)}</strong> — ${order.paymentMethod}</p>`;
}

function sendNewSaleEmail(to, order, customer) {
  return sendEmail(to, `Nova venda! Pedido #${order.id.slice(-6)} — R$ ${order.total.toFixed(2)}`,
    orderDetailsHtml(order, customer));
}

module.exports = { sendEmail, sendOrderCreatedEmail, sendOrderStatusEmail, sendPaymentConfirmedEmail, sendNewSaleEmail, orderDetailsHtml, isConfigured };
