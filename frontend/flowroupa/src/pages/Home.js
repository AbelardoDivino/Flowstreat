import { useEffect, useState } from 'react';
import { getProducts } from '../components/services/productService';
import ProductGrid from '../product/ProductGrid';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8 }).then((d) => setProducts(d.products)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Carregando...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>FlowStreat - Destaques</h1>
      <ProductGrid products={products} />
    </div>
  );
}
