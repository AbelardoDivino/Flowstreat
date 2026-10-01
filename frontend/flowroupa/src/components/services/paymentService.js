const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

async function req(path, opts = {}) {
  const res = await fetch(`${API}${path}`, { credentials: 'include', headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }, ...opts });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro no pagamento');
  return data;
}

export function payPix(orderId) { return req('/payments/pix', { method: 'POST', body: JSON.stringify({ orderId }) }); }
export function payCard(orderId, cardData) { return req('/payments/card', { method: 'POST', body: JSON.stringify({ orderId, ...cardData }) }); }
export function payBoleto(orderId) { return req('/payments/boleto', { method: 'POST', body: JSON.stringify({ orderId }) }); }
