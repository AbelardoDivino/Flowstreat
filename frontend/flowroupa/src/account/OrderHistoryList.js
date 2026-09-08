import { useEffect, useState } from 'react';
import { getMyOrders } from '../components/services/orderService';
import OrderStatusBadge from './OrderStatusBadge';

export default function OrderHistoryList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMyOrders().then(setOrders).catch(() => {}).finally(() => setLoading(false)); }, []);
  if (loading) return <p>Carregando pedidos...</p>;
  if (!orders.length) return <p>Nenhum pedido ainda</p>;
  return (
    <div>
      {orders.map((o) => (
        <div key={o.id} style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
          <p><strong>Pedido #{o.id.slice(-6)}</strong> - R$ {o.total.toFixed(2)} - {o.paymentMethod} - {o.paymentStatus}</p>
          <p style={{ fontSize: 12, color: '#666' }}>{new Date(o.createdAt).toLocaleString()}</p>
          {o.items.map((it) => <p key={it.variantId} style={{ fontSize: 12 }}>{it.name} ({it.size}/{it.color}) x{it.quantity}</p>)}
          <OrderStatusBadge statusHistory={o.statusHistory} trackingCode={o.trackingCode} />
        </div>
      ))}
    </div>
  );
}
