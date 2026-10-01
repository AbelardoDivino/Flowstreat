import { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const NEXT = { pedido_criado: 'pagamento_confirmado', pagamento_confirmado: 'em_preparacao', em_preparacao: 'enviado', enviado: 'entregue' };

export default function AdminPedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState({});

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/orders`, { credentials: 'include' });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function advance(order) {
    const current = order.statusHistory?.[order.statusHistory.length - 1]?.status;
    const next = NEXT[current];
    if (!next) return;
    await fetch(`${API}/admin/orders/${order.id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
      body: JSON.stringify({ status: next, trackingCode: tracking[order.id] || undefined }),
    });
    load();
  }

  if (loading) return <p className="p-6 text-poeira">Carregando pedidos...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl mb-4">Pedidos</h1>
      {orders.length === 0 && <p className="text-poeira">Nenhum pedido.</p>}
      {orders.map((o) => {
        const current = o.statusHistory?.[o.statusHistory.length - 1]?.status;
        return (
          <div key={o.id} className="border border-linha p-4 mb-3">
            <p className="font-semibold">#{o.id.slice(-6)} — R$ {o.total?.toFixed(2)} — {o.paymentMethod} — {o.paymentStatus}</p>
            <p className="text-sm text-poeira">Status: {current} {o.trackingCode && `• ${o.trackingCode}`}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <input placeholder="Código rastreio" value={tracking[o.id] || ''} onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })} className="border border-linha rounded-[3px] px-2 py-1 text-sm" />
              {NEXT[current] ? <button onClick={() => advance(o)} className="bg-tinta text-base px-4 py-1 rounded-[3px] text-sm">Avançar para {NEXT[current]}</button> : <span className="text-sm text-poeira">Finalizado</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
