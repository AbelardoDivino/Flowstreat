import { Link } from 'react-router-dom';
import useCartStore from '../components/store/cartStore';

const colorMap = { Preto: '#111', Branco: '#F7F6F2', Azul: '#2A3EF5', Vermelho: '#D33', Cinza: '#888' };

export default function ProductCard({ product, onQuickAdd }) {
  const addItem = useCartStore((s) => s.addItem);
  const colors = [...new Set(product.variants?.map((v) => v.color) || [])];
  const firstAvailable = product.variants?.find((v) => v.stock > 0);
  const installment = (product.price / 3).toFixed(2);

  function handleQuickAdd() {
    if (!firstAvailable) return;
    addItem({
      productId: product.id,
      variantId: firstAvailable.id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      size: firstAvailable.size,
      color: firstAvailable.color,
      quantity: 1,
    });
    onQuickAdd?.();
  }

  return (
    <div className="block bg-base group">
      <Link to={`/produto/${product.slug}`} className="block" aria-label={product.name}>
        <div className="aspect-[4/5] overflow-hidden bg-white border border-linha group-hover:border-tinta">
          <img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
        </div>
      </Link>
      <div className="border-t border-linha pt-3 pb-1">
        <Link to={`/produto/${product.slug}`} className="font-display text-lg leading-none hover:text-fluxo">{product.name}</Link>
        <p className="font-body text-sm mt-2">
          <span className="tag-preco">R$ {product.price?.toFixed(2)}</span>
        </p>
        <p className="text-xs text-poeira mt-1">3x de R$ {installment} sem juros</p>
        <div className="flex gap-1.5 mt-2" aria-hidden="true">
          {colors.map((c) => (
            <span key={c} title={c} className="w-3 h-3 rounded-full border border-linha" style={{ background: colorMap[c] || '#C9C6BC' }} />
          ))}
        </div>
        <button
          onClick={handleQuickAdd}
          disabled={!firstAvailable}
          className="btn btn-block border border-tinta mt-3 md:opacity-0 md:group-hover:opacity-100 disabled:opacity-40"
        >
          {firstAvailable ? 'Adicionar' : 'Esgotado'}
        </button>
      </div>
    </div>
  );
}
