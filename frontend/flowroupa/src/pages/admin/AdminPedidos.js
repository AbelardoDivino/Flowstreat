import { useEffect, useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
const NEXT = { pedido_criado: 'pagamento_confirmado', pagamento_confirmado: 'em_preparacao', em_preparacao: 'enviado', enviado: 'entregue' };

export default function AdminPedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState({});
  const [open, setOpen] = useState(null);

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
      <h1 className="font-display text-2xl mb-1">Pedidos</h1>
      <p className="text-sm text-poeira mb-4">{orders.length} pedidos • clica pra ver quem comprou e onde entregar</p>
      {orders.length === 0 && <p className="text-poeira">Nenhum pedido.</p>}
      {orders.map((o) => {
        const current = o.statusHistory?.[o.statusHistory.length - 1]?.status;
        const isOpen = open === o.id;
        const addr = o.address || {};
        return (
          <div key={o.id} className="border border-linha rounded-[3px] bg-white mb-3">
            <button onClick={() => setOpen(isOpen ? null : o.id)} aria-expanded={isOpen} className="w-full text-left p-4 flex justify-between items-center gap-3 min-h-[44px]">
              <span>
                <strong>#{o.id.slice(-6)}</strong> — {o.customer?.name || 'Cliente'} — R$ {o.total?.toFixed(2)}
                <span className="block text-xs text-poeira font-normal">{o.paymentMethod} • {o.paymentStatus} • {current}</span>
              </span>
              <span className="text-sm text-fluxo font-semibold whitespace-nowrap">{isOpen ? 'Fechar' : 'Detalhes'}</span>
            </button>
            {isOpen && (
              <div className="border-t border-linha p-4 space-y-4 text-sm">
                <div>
                  <p className="font-semibold">Quem comprou</p>
                  <p>{o.customer?.name} — {o.customer?.email}</p>
                </div>
                <div>
                  <p className="font-semibold">Entregar em</p>
                  <p>{addr.street}, {addr.number}{addr.complement ? ` — ${addr.complement}` : ''}</p>
                  <p>{addr.neighborhood ? `${addr.neighborhood} — ` : ''}{addr.city}/{addr.state} — CEP {addr.zipCode}</p>
                </div>
                <div>
                  <p className="font-semibold">Itens</p>
                  {o.items?.map((it) => (
                    <p key={it.variantId}>{it.name} ({it.size}/{it.color}) x{it.quantity} — R$ {(it.unitPrice * it.quantity).toFixed(2)}</p>
                  ))}
                  <p className="font-semibold mt-1">Total: R$ {o.total?.toFixed(2)}</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <label htmlFor={`track-${o.id}`} className="text-sm text-poeira">Rastreio</label>
                  <input id={`track-${o.id}`} placeholder="Código dos Correios" value={tracking[o.id] || o.trackingCode || ''} onChange={(e) => setTracking({ ...tracking, [o.id]: e.target.value })} className="border border-linha rounded-[3px] px-2 py-2 text-sm bg-white text-tinta" />
                  {NEXT[current] ? <button onClick={() => advance(o)} className="bg-tinta text-base px-4 py-2 rounded-[3px] text-sm font-semibold">Avançar para {NEXT[current]}</button> : <span className="text-sm text-poeira">Finalizado</span>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
