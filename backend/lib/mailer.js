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

function sendOrderStatusEmail(to, order) {
  const current = order.statusHistory?.[order.statusHistory.length - 1]?.status;
  return sendEmail(to, `Pedido ${order.id.slice(-6)} atualizado: ${current} — FlowStreat`,
    `<h2>Status atualizado: ${current}</h2>${order.trackingCode ? `<p>Rastreio: ${order.trackingCode}</p>` : ''}`);
}

module.exports = { sendEmail, sendOrderCreatedEmail, sendOrderStatusEmail, isConfigured };
