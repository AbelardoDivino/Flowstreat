export default function CartItem({ item, onUpdate, onRemove }) {
  return (
    <div className="flex gap-3 py-3 border-b border-linha">
      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover border border-linha" />
      <div className="flex-1">
        <p className="font-display text-sm leading-none">{item.name}</p>
        <p className="text-xs text-poeira">{item.size} • {item.color} — R$ {item.price.toFixed(2)}</p>
        <div className="flex gap-2 mt-2">
          <button onClick={() => onUpdate(item.quantity - 1)} className="w-7 h-7 border border-linha rounded-[3px]">-</button>
          <span className="w-7 h-7 grid place-items-center text-sm">{item.quantity}</span>
          <button onClick={() => onUpdate(item.quantity + 1)} className="w-7 h-7 border border-linha rounded-[3px]">+</button>
        </div>
      </div>
      <button onClick={onRemove} className="text-poeira text-sm">Remover</button>
    </div>
  );
}
