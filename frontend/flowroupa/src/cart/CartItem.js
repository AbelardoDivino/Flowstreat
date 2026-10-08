export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex gap-3 py-3 border-b border-linha">
      <img src={item.image} alt={item.name} loading="lazy" className="w-16 h-16 object-cover border border-linha" />
      <div className="flex-1">
        <p className="font-display text-sm leading-none">{item.name}</p>
        <p className="text-xs text-poeira">{item.size} • {item.color} — R$ {item.price.toFixed(2)}</p>
        <div className="flex gap-2 mt-2 items-center">
          <button onClick={() => onUpdate(item.quantity - 1)} aria-label={`Diminuir quantidade de ${item.name}`} className="w-10 h-10 border border-linha rounded-[3px] text-base">-</button>
          <span className="w-8 text-center text-sm" aria-live="polite">{item.quantity}</span>
          <button onClick={() => onUpdate(item.quantity + 1)} aria-label={`Aumentar quantidade de ${item.name}`} className="w-10 h-10 border border-linha rounded-[3px] text-base">+</button>
        </div>
      </div>
      <button onClick={onRemove} aria-label={`Remover ${item.name} da sacola`} className="text-poeira text-sm min-h-[44px]">Remover</button>
    </div>
  );
}
