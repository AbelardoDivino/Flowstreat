import useCartStore from '../components/store/cartStore';

export default function CartSummary() {
  const total = useCartStore((s) => s.total());
  return (
    <div style={{ borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 12 }}>
      <p style={{ fontWeight: 'bold' }}>Subtotal: R$ {total.toFixed(2)}</p>
    </div>
  );
}
