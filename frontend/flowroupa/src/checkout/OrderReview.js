import useCartStore from '../components/store/cartStore';
export default function OrderReview({ addressId }) {
  const { items, total } = useCartStore();
  const subtotal = total();
  const shipping = subtotal > 200 ? 0 : 15;
  return (
    <div style={{ border: '1px solid #ddd', padding: 12 }}>
      <h4>Revisão do pedido</h4>
      {items.map((i) => <p key={`${i.productId}-${i.size}-${i.color}`}>{i.name} ({i.size}/{i.color}) x{i.quantity} - R$ {(i.price * i.quantity).toFixed(2)}</p>)}
      <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
      <p>Frete: {shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</p>
      <p style={{ fontWeight: 'bold' }}>Total: R$ {(subtotal + shipping).toFixed(2)}</p>
      {addressId && <p>Endereço selecionado: {addressId.slice(0, 8)}...</p>}
    </div>
  );
}
