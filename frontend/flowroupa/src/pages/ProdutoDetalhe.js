import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductBySlug } from '../components/services/productService';
import ProductGallery from '../product/ProductGallery';
import ProductVariantSelector from '../product/ProductVariantSelector';
import ProductReviews from '../product/ProductReviews';
import useCartStore from '../components/store/cartStore';

export default function ProdutoDetalhe({ onAdd }) {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selected, setSelected] = useState({ size: '', color: '' });
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    getProductBySlug(slug).then((p) => {
      setProduct(p);
      if (p.variants?.[0]) setSelected({ size: p.variants[0].size, color: p.variants[0].color });
    }).catch(() => {}).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-6">Carregando...</p>;
  if (!product) return <p className="p-6">Produto não encontrado</p>;
  const crumbs = (
    <nav aria-label="Navegação" className="max-w-6xl mx-auto px-4 pt-6 text-sm text-poeira">
      <Link to="/">Início</Link> / <Link to="/catalogo">Coleção</Link> / <span>{product.name}</span>
    </nav>
  );

  const variant = product.variants.find((v) => v.size === selected.size && v.color === selected.color);
  const canAdd = variant && variant.stock > 0;

  function handleAdd() {
    addItem({ productId: product.id, variantId: variant.id, name: product.name, image: product.images[0], price: product.price, size: selected.size, color: selected.color, quantity: 1 });
    onAdd?.();
  }

  return (
    <>
    {crumbs}
    <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8">
      <ProductGallery images={product.images} />
      <div>
        <h1 className="font-display text-3xl">{product.name}</h1>
        <p className="mt-3"><span className="tag-preco text-lg px-2 py-1">R$ {product.price?.toFixed(2)}</span></p>
        <p className="font-normal text-poeira text-sm mt-1">3x de R$ {(product.price / 3).toFixed(2)} sem juros</p>
        <div className="mt-6">
          <ProductVariantSelector variants={product.variants} selected={selected} onSelect={setSelected} />
        </div>
        <ProductReviews />
        <p className="text-sm text-poeira mt-4 leading-relaxed max-w-prose">{product.description} — Algodão pesado, corte solto, acabamento reforçado nas costuras. Feita pra usar todo dia, do jeito que a rua pede.</p>
        <button onClick={handleAdd} disabled={!canAdd} className={`btn btn-block mt-6 ${canAdd ? 'btn-primary' : ''}`}>
          {canAdd ? 'Adicionar à sacola' : 'Indisponível'}
        </button>
        <p className="text-xs text-poeira mt-3 text-center">Frete grátis acima de R$ 200 • Troca em 7 dias</p>
      </div>
    </div>
    {/* barra fixa de compra no mobile */}
    <div className="h-20 md:hidden" aria-hidden="true" />
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-base border-t border-linha px-4 py-3 flex items-center gap-3">
      <div className="flex-1">
        <p className="font-display text-lg leading-none truncate">{product.name}</p>
        <p className="text-sm font-semibold">R$ {product.price?.toFixed(2)}</p>
      </div>
      <button onClick={handleAdd} disabled={!canAdd} className={`px-6 py-3 rounded-[3px] font-semibold text-sm ${canAdd ? 'bg-fluxo text-white' : 'bg-linha text-poeira'}`}>
        {canAdd ? 'Adicionar' : 'Esgotado'}
      </button>
    </div>
    </>
  );
}
