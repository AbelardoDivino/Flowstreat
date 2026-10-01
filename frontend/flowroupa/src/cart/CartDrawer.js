import { useNavigate } from 'react-router-dom';
import useCartStore from '../components/store/cartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 w-full max-w-sm h-full bg-base border-l border-linha p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-xl">Sua sacola</h3>
          <button onClick={onClose} className="text-poeira">Fechar</button>
        </div>
        {items.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-poeira">Sua sacola está vazia.</p>
            <p className="text-sm text-poeira mt-1">Dá uma olhada na coleção.</p>
            <button onClick={() => { onClose(); navigate('/catalogo'); }} className="mt-4 bg-fluxo text-white px-6 py-2 rounded-[3px] font-semibold">Ver coleção</button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} onUpdate={(q) => updateQuantity(item.productId, item.size, item.color, q)} onRemove={() => removeItem(item.productId, item.size, item.color)} />
            ))}
            <CartSummary />
            <button onClick={() => { onClose(); navigate('/checkout'); }} className="w-full mt-4 bg-tinta text-base py-3 rounded-[3px] font-semibold">Finalizar compra</button>
            <button onClick={onClose} className="w-full mt-2 border border-linha py-2 rounded-[3px] text-sm">Continuar comprando</button>
          </>
        )}
      </div>
    </div>
  );
}
