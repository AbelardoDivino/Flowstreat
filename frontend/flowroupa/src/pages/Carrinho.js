import useCartStore from '../components/store/cartStore';
import CartItem from '../cart/CartItem';
import CartSummary from '../cart/CartSummary';
import { Link } from 'react-router-dom';

export default function Carrinho() {
  const { items, removeItem, updateQuantity } = useCartStore();
  if (items.length === 0) return <div style={{ padding: 20 }}><h1>Carrinho</h1><p>Vazio</p><Link to="/catalogo">Ver catálogo</Link></div>;
  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Carrinho</h1>
      {items.map((item) => (
        <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} onUpdate={(q) => updateQuantity(item.productId, item.size, item.color, q)} onRemove={() => removeItem(item.productId, item.size, item.color)} />
      ))}
      <CartSummary />
      <Link to="/checkout" style={{ display: 'block', marginTop: 16, padding: 12, background: '#000', color: '#fff', textAlign: 'center', textDecoration: 'none' }}>Ir para checkout</Link>
    </div>
  );
}
