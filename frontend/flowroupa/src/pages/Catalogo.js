import { useEffect, useState } from 'react';
import { getProducts } from '../components/services/productService';
import ProductGrid from '../product/ProductGrid';
import ProductFilters from '../product/ProductFilters';

export default function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load(filters = {}) {
    setLoading(true);
    try {
      const data = await getProducts(filters);
      setProducts(data.products);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Catálogo</h1>
      <ProductFilters onChange={load} />
      {loading ? <p>Carregando...</p> : <ProductGrid products={products} />}
    </div>
  );
}
