import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products?.length) return <p>Nenhum produto encontrado</p>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
