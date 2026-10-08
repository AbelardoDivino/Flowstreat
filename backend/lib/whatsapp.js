// Aviso de venda no WhatsApp do dono via Meta Cloud API.
// Env: WHATSAPP_TOKEN, WHATSAPP_PHONE_ID, OWNER_WHATSAPP (só dígitos, com DDI+DDD).
// Sem token configurado, só loga e não quebra o pedido.
// Produção: a Meta exige template aprovado para mensagem iniciada pela empresa;
// se a API recusar texto livre, crie um template de "nova venda" e ajuste o payload abaixo.
const env = require('../config/env');

function isConfigured() {
  return Boolean(env.WHATSAPP_TOKEN && env.WHATSAPP_PHONE_ID && env.OWNER_WHATSAPP);
}

function saleMessage(order, customer) {
  const addr = order.address || {};
  const lines = (order.items || []).map((it) => `• ${it.name} (${it.size}/${it.color}) x${it.quantity}`).join('\n');
  return `Nova venda FlowStreat! Pedido #${order.id.slice(-6)} — R$ ${order.total.toFixed(2)} (${order.paymentMethod})\nCliente: ${customer?.name || ''} ${customer?.email || ''}\n${lines}\nEntregar: ${addr.street || ''}, ${addr.number || ''} — ${addr.city || ''}/${addr.state || ''} CEP ${addr.zipCode || ''}`;
}

async function notifyOwnerSale(order, customer) {
  const text = saleMessage(order, customer);
  if (!isConfigured()) {
    console.log(`[whatsapp] não configurado — seria enviado ao dono:\n${text}`);
    return false;
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${env.WHATSAPP_PHONE_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: env.OWNER_WHATSAPP, type: 'text', text: { body: text } }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[whatsapp] erro:', JSON.stringify(data).slice(0, 300));
    return false;
  }
  return true;
}

module.exports = { notifyOwnerSale, saleMessage, isConfigured };
