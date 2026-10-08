import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  if (!products?.length) return <p className="text-poeira">Sua sacola está vazia. Dá uma olhada na coleção.</p>;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
