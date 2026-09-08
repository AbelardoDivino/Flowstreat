import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductBySlug } from '../components/services/productService';
import ProductGallery from '../product/ProductGallery';
import ProductVariantSelector from '../product/ProductVariantSelector';
import ProductReviews from '../product/ProductReviews';
import useCartStore from '../components/store/cartStore';

export default function ProdutoDetalhe() {
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

  if (loading) return <p style={{ padding: 20 }}>Carregando...</p>;
  if (!product) return <p style={{ padding: 20 }}>Produto não encontrado</p>;
  const variant = product?.variants?.find((v) => v.size === selected.size && v.color === selected.color);
  const canAdd = variant && variant.stock > 0;
  function handleAdd() {
    const variant = product.variants.find((v) => v.size === selected.size && v.color === selected.color);
    addItem({ productId: product.id, variantId: variant.id, name: product.name, image: product.images[0], price: product.price, size: selected.size, color: selected.color, quantity: 1 });
  }

  return (
    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      <ProductGallery images={product.images} />
      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p style={{ fontSize: 20, fontWeight: 'bold' }}>R$ {product.price?.toFixed(2)}</p>
        <ProductVariantSelector variants={product.variants} selected={selected} onSelect={setSelected} />
        <ProductReviews />
        <button onClick={handleAdd} disabled={!canAdd} style={{ marginTop: 16, padding: '12px 24px', background: canAdd ? '#000' : '#ccc', color: '#fff', border: 'none', cursor: canAdd ? 'pointer' : 'not-allowed' }}>
          {canAdd ? 'Adicionar ao carrinho' : 'Indisponível'}
        </button>
      </div>
    </div>
  );
}
