const steps = ['pedido_criado', 'pagamento_confirmado', 'em_preparacao', 'enviado', 'entregue'];
const labels = { pedido_criado: 'Recebido', pagamento_confirmado: 'Pago', em_preparacao: 'Em preparação', enviado: 'Enviado', entregue: 'Entregue', cancelado: 'Cancelado' };

export default function OrderStatusBadge({ statusHistory, trackingCode }) {
  const current = statusHistory?.[statusHistory.length - 1]?.status;
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {steps.map((s) => {
          const done = statusHistory?.some((h) => h.status === s);
          const isCurrent = current === s;
          return <span key={s} style={{ padding: '6px 10px', border: isCurrent ? '2px solid #000' : '1px solid #ddd', background: done ? '#e0ffe0' : '#fff' }}>{labels[s] || s}</span>;
        })}
      </div>
      {current === 'cancelado' && <p style={{ color: 'red' }}>Pedido cancelado</p>}
      {trackingCode && <p>Código de rastreio: <a href="https://rastreamento.correios.com.br/app/index.php" target="_blank" rel="noreferrer">{trackingCode}</a></p>}
      <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
        {statusHistory?.map((h, i) => <p key={i}>{labels[h.status] || h.status} - {new Date(h.date).toLocaleString()} {h.note ? `(${h.note})` : ''}</p>)}
      </div>
    </div>
  );
}
