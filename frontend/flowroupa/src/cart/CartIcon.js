import useCartStore from '../components/store/cartStore';

export default function CartIcon({ onClick }) {
  const count = useCartStore((s) => s.count());
  return (
    <button onClick={onClick} style={{ position: 'relative', padding: '6px 12px' }}>
      🛒 Carrinho
      {count > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: '#000', color: '#fff', borderRadius: 10, padding: '2px 6px', fontSize: 11 }}>{count}</span>}
    </button>
  );
}
