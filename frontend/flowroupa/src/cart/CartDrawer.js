import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../components/store/cartStore';
import CartItem from './CartItem';
import CartSummary from './CartSummary';

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', right: 0, top: 0, width: 360, height: '100%', background: '#fff', borderLeft: '1px solid #ddd', padding: 16, overflowY: 'auto', zIndex: 100 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Carrinho</h3>
        <button onClick={onClose}>Fechar</button>
      </div>
      {items.length === 0 ? <p>Carrinho vazio</p> : items.map((item) => (
        <CartItem key={`${item.productId}-${item.size}-${item.color}`} item={item} onUpdate={(q) => updateQuantity(item.productId, item.size, item.color, q)} onRemove={() => removeItem(item.productId, item.size, item.color)} />
      ))}
      <CartSummary />
      {items.length > 0 && <button onClick={() => { onClose(); navigate('/checkout'); }} style={{ width: '100%', marginTop: 12, padding: 12, background: '#000', color: '#fff', border: 'none' }}>Finalizar compra</button>}
    </div>
  );
}
