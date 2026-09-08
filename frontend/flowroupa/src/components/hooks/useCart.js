import useCartStore from '../store/cartStore';
export default function useCart() {
  const store = useCartStore();
  return store;
}
