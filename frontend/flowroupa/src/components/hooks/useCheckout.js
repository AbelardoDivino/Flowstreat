import useCartStore from '../store/cartStore';
export default function useCheckout() {
  const { items, total } = useCartStore();
  const subtotal = total();
  const shipping = subtotal > 200 ? 0 : 15;
  const finalTotal = subtotal + shipping;
  return { items, subtotal, shipping, finalTotal };
}
