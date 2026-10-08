import { Link } from 'react-router-dom';

const colorMap = { Preto: '#111', Branco: '#F7F6F2', Azul: '#2A3EF5', Vermelho: '#D33', Cinza: '#888' };

export default function ProductCard({ product }) {
  const colors = [...new Set(product.variants?.map((v) => v.color) || [])];
  return (
    <Link to={`/produto/${product.slug}`} className="block bg-base group">
      <div className="aspect-square overflow-hidden bg-white border border-linha">
        <img src={product.images?.[0] || 'https://via.placeholder.com/400'} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
      </div>
      <div className="border-t border-linha pt-3 pb-1">
        <h3 className="font-display text-lg leading-none">{product.name}</h3>
        <p className="font-body text-sm mt-2"><span className="bg-selo text-tinta font-bold px-1.5 py-0.5 rounded-[2px]">R$ {product.price?.toFixed(2)}</span> <span className="font-normal text-poeira">em até 3x sem juros</span></p>
        <div className="flex gap-1.5 mt-2" aria-hidden="true">
          {colors.map((c) => (
            <span key={c} title={c} className="w-3 h-3 rounded-full border border-linha" style={{ background: colorMap[c] || '#C9C6BC' }} />
          ))}
        </div>
      </div>
    </Link>
  );
}
