import useCartStore from '../components/store/cartStore';
import CartItem from '../cart/CartItem';
import CartSummary from '../cart/CartSummary';
import { Link, useNavigate } from 'react-router-dom';

export default function Carrinho() {
  const { items, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  if (!items.length) return <div className="max-w-2xl mx-auto px-4 py-12 text-center"><h1 className="font-display text-2xl">Sua sacola está vazia</h1><p className="text-poeira mt-2">Dá uma olhada na coleção.</p><Link to="/catalogo" className="inline-block mt-4 bg-fluxo text-white px-6 py-2 rounded-[3px]">Ver coleção</Link></div>;
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl mb-4">Sacola</h1>
      {items.map((item) => <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} onUpdate={(q) => updateQuantity(item.productId, item.size, item.color, q)} onRemove={() => removeItem(item.productId, item.size, item.color)} />)}
      <CartSummary />
      <button onClick={() => navigate('/checkout')} className="btn btn-dark btn-block mt-6">Finalizar compra</button>
      <Link to="/catalogo" className="block text-center mt-3 text-sm text-poeira">Continuar comprando</Link>
    </div>
  );
}
