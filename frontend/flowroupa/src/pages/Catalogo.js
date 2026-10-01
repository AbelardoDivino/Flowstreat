import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../components/services/productService';
import ProductGrid from '../product/ProductGrid';
import ProductFilters from '../product/ProductFilters';

export default function Catalogo() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function load(filters = {}) {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts(filters);
      setProducts(data.products || []);
      if (!data.products?.length && !error) {
        // sem erro mas vazio -> pode ser banco offline
      }
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  if (error) return <div className="max-w-6xl mx-auto px-4 py-6"><p className="text-red-600">{error}</p><Link to="/" className="text-fluxo">Voltar</Link></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl mb-4">Coleção</h1>
      <ProductFilters onChange={load} />
      <p className="text-sm text-poeira mb-4">{products.length} peças</p>
      {loading ? <p className="text-poeira">Carregando...</p> : products.length === 0 ? <div className="py-12 text-center"><p className="text-poeira">Nenhum produto no momento.</p><p className="text-xs text-poeira mt-2">Se acabou de subir o cluster, aguarde 1 min e recarregue.</p></div> : <ProductGrid products={products} />}
    </div>
  );
}
