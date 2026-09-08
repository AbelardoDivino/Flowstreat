export default function PaymentMethodSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
      {['pix', 'card', 'boleto'].map((m) => (
        <button key={m} onClick={() => onChange(m)} style={{ padding: '10px 16px', border: value === m ? '2px solid #000' : '1px solid #ddd', background: '#fff' }}>
          {m === 'pix' ? 'Pix' : m === 'card' ? 'Cartão' : 'Boleto'}
        </button>
      ))}
    </div>
  );
}
