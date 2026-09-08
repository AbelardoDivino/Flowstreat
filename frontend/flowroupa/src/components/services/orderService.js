const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
export async function getMyOrders() {
  const res = await fetch(`${API}/orders/me`, { credentials: 'include' });
  if (!res.ok) throw new Error('Erro ao buscar pedidos');
  return res.json();
}
export async function getOrderById(id) {
  const res = await fetch(`${API}/orders/${id}`, { credentials: 'include' });
  if (!res.ok) throw new Error('Pedido não encontrado');
  return res.json();
}
