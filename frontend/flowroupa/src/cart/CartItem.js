export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #eee', padding: '8px 0', alignItems: 'center' }}>
      <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover' }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>{item.name}</p>
        <p style={{ margin: 0, fontSize: 12, color: '#666' }}>{item.size} / {item.color} - R$ {item.price.toFixed(2)}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button onClick={() => onUpdate(item.quantity - 1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdate(item.quantity + 1)}>+</button>
        </div>
      </div>
      <button onClick={onRemove} style={{ color: 'red' }}>X</button>
    </div>
  );
}
