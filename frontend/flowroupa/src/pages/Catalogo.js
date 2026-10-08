import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts } from '../components/services/productService';
import ProductGrid from '../product/ProductGrid';
import ProductFilters from '../product/ProductFilters';

const titles = { camisetas: 'Camisetas', calcas: 'Calças', vestidos: 'Vestidos', jaquetas: 'Jaquetas', tenis: 'Tênis', acessorios: 'Acessórios' };

export default function Catalogo() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await getProducts(filters);
      setProducts(data.products || []);
    } catch (e) {
      setError(e.message);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(category ? { category } : {}); }, [category, load]);

  if (error) return <div className="max-w-6xl mx-auto px-4 py-6"><p className="text-red-700">{error}</p><Link to="/" className="text-fluxo">Voltar</Link></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <nav aria-label="Navegação" className="text-sm text-poeira mb-2">
        <Link to="/" className="hover:text-fluxo">Início</Link> / <span>{titles[category] || 'Coleção'}</span>
      </nav>
      <h1 className="font-display text-2xl mb-4">{titles[category] || 'Coleção'}</h1>
      <form
        onSubmit={(e) => { e.preventDefault(); load({ ...(category ? { category } : {}), ...(search ? { search } : {}) }); }}
        className="flex gap-2 mb-4"
        role="search"
      >
        <label htmlFor="catalog-search" className="sr-only">Buscar peça</label>
        <input
          id="catalog-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar peça (ex: nike, bomber, slide)"
          className="input flex-1"
        />
        <button type="submit" className="btn btn-dark">Buscar</button>
      </form>
      <ProductFilters key={category} initialCategory={category} onChange={(f) => load(category ? { ...f, category } : f)} />
      <p className="text-sm text-poeira mb-4">{products.length} peças</p>
      {loading ? <p className="text-poeira">Carregando...</p> : products.length === 0 ? <div className="py-12 text-center"><p className="text-poeira">Nenhum produto no momento.</p><p className="text-xs text-poeira mt-2">Se acabou de subir o cluster, aguarde 1 min e recarregue.</p></div> : <ProductGrid products={products} />}
    </div>
  );
}
