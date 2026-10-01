import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../components/services/productService';
import ProductGrid from '../product/ProductGrid';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 6 }).then((d) => setProducts(d.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-base">
      <section className="bg-tinta text-base">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <h1 className="font-display text-4xl md:text-6xl leading-none max-w-2xl">
            Roupa de rua<br />do jeito que<br />a gente vive.
          </h1>
          <p className="font-body mt-4 max-w-md text-base" style={{ color: '#C9C6BC' }}>Algodão pesado, corte solto, acabamento reforçado. Feita pra usar todo dia.</p>
          <Link to="/catalogo" className="inline-block mt-6 bg-fluxo text-white font-body font-semibold px-6 py-3 rounded-[3px]">Ver coleção</Link>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Novidades</h2>
          <Link to="/catalogo" className="text-sm text-fluxo font-semibold">Ver tudo</Link>
        </div>
        {loading ? <p className="text-poeira">Carregando...</p> : <ProductGrid products={products} />}
      </section>
      <section className="border-t border-linha max-w-6xl mx-auto px-4 py-6 flex flex-wrap gap-6 text-sm text-poeira">
        <span>Frete grátis acima de R$ 200</span><span>•</span><span>Entrega em São João Evangelista e região</span><span>•</span><span>Troca em até 7 dias</span>
      </section>
    </div>
  );
}
