import useCartStore from '../components/store/cartStore';
export default function CartIcon({ onClick }) {
  const count = useCartStore((s) => s.count());
  return (
    <button onClick={onClick} className="relative border border-tinta px-3 py-1 rounded-[3px] text-sm font-semibold">
      Sacola {count > 0 ? `(${count})` : ''}
      {count > 0 && <span className="absolute -top-2 -right-2 bg-selo text-tinta text-xs w-5 h-5 grid place-items-center rounded-full font-bold">{count}</span>}
    </button>
  );
}
