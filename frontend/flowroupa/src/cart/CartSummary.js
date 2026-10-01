import useCartStore from '../components/store/cartStore';
export default function CartSummary() {
  const total = useCartStore((s) => s.total());
  const shipping = total > 200 ? 0 : 15;
  return (
    <div className="border-t border-linha pt-4 mt-4 space-y-1">
      <p className="flex justify-between text-sm"><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></p>
      <p className="flex justify-between text-sm"><span>Frete</span><span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span></p>
      <p className="flex justify-between font-semibold"><span>Total</span><span>R$ {(total + shipping).toFixed(2)}</span></p>
    </div>
  );
}
