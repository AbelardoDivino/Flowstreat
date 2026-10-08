import useCartStore from '../components/store/cartStore';

const FREE_SHIPPING = 200;
const SHIPPING_COST = 15;

export default function CartSummary() {
  const total = useCartStore((s) => s.total());
  const shipping = total > FREE_SHIPPING ? 0 : SHIPPING_COST;
  const missing = FREE_SHIPPING - total;
  const progress = Math.min(100, (total / FREE_SHIPPING) * 100);

  return (
    <div className="border-t border-linha pt-4 mt-4 space-y-1">
      {shipping === 0 ? (
        <p className="text-sm font-semibold"><span className="bg-selo text-tinta px-1.5 py-0.5 rounded-[2px]">Frete grátis</span></p>
      ) : (
        <div>
          <p className="text-sm">Faltam <strong>R$ {missing.toFixed(2)}</strong> pro frete grátis</p>
          <div className="h-1.5 bg-linha rounded-[2px] mt-2" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin="0" aria-valuemax="100" aria-label="Progresso para frete grátis">
            <div className="h-full bg-fluxo rounded-[2px]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      <p className="flex justify-between text-sm"><span>Subtotal</span><span>R$ {total.toFixed(2)}</span></p>
      <p className="flex justify-between text-sm"><span>Frete</span><span>{shipping === 0 ? 'Grátis' : `R$ ${shipping.toFixed(2)}`}</span></p>
      <p className="flex justify-between font-semibold"><span>Total</span><span>R$ {(total + shipping).toFixed(2)}</span></p>
    </div>
  );
}
