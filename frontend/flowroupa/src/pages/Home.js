import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../components/services/productService';
import ProductGrid from '../product/ProductGrid';

const categories = [
  { name: 'Camisetas', to: '/catalogo?category=camisetas', img: '/pictures/profissional/IMG_8386.jpg' },
  { name: 'Tênis', to: '/catalogo?category=tenis', img: '/pictures/profissional/tenis-nike-dunk.jpg' },
  { name: 'Jaquetas', to: '/catalogo?category=jaquetas', img: '/pictures/profissional/jaqueta-preta.jpg' },
  { name: 'Acessórios', to: '/catalogo?category=acessorios', img: '/pictures/profissional/slide-gucci-preto.jpg' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: 8 }).then((d) => setProducts(d.products || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-base">
      {/* HERO — foto full-bleed com título sobreposto */}
      <section className="relative bg-tinta text-base overflow-hidden">
        <img src="/pictures/profissional/IMG_8387.jpg" alt="Camiseta Fire Basquete" loading="eager" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="min-h-[62vh] md:min-h-[72vh] flex flex-col justify-end pb-10 md:pb-14 max-w-2xl">
            <p className="tag-selo self-start">Drop FIRE disponível</p>
            <h1 className="font-display text-5xl md:text-7xl leading-none mt-4">
              Roupa de rua<br />do jeito que<br />a gente vive.
            </h1>
            <div className="flex gap-3 mt-6 flex-wrap">
              <Link to="/catalogo" className="bg-white text-tinta font-body font-semibold px-8 py-3 rounded-full">Comprar</Link>
              <Link to="/catalogo?category=tenis" className="border border-base text-base font-body font-semibold px-8 py-3 rounded-full">Ver tênis</Link>
            </div>
          </div>
        </div>
      </section>

      <div className="stripes h-3" aria-hidden="true" />

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end gap-4 mb-4">
          <h2 className="font-display text-3xl">Compra por categoria</h2>
          <div className="flex-1 border-t border-linha mb-2" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.name} to={c.to} className="block relative border border-linha group overflow-hidden hover:border-tinta">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={c.img} alt={c.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition" />
              </div>
              <p className="absolute bottom-3 left-3 bg-tinta text-base font-display text-xl px-3 py-1 rounded-[2px]">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-end gap-4 mb-6">
          <h2 className="font-display text-3xl">Novidades</h2>
          <div className="flex-1 border-t border-linha mb-2" aria-hidden="true" />
          <Link to="/catalogo" className="text-sm text-fluxo font-semibold">Ver tudo</Link>
        </div>
        {loading ? <p className="text-poeira">Carregando...</p> : <ProductGrid products={products} />}
      </section>

      {/* BANNERS PROMO */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-4">
        <div className="bg-selo text-tinta p-6 md:p-8 flex flex-wrap items-center gap-4 justify-between rounded-[3px]">
          <p className="font-display text-3xl leading-none">Frete grátis<br />acima de R$ 200</p>
          <Link to="/catalogo" className="bg-tinta text-base font-body font-semibold px-6 py-3 rounded-[3px]">Aproveitar</Link>
        </div>
        <div className="bg-tinta text-base p-6 md:p-8 flex flex-wrap items-center gap-4 justify-between rounded-[3px]">
          <p className="font-display text-3xl leading-none">Parcele em até 3x<br />sem juros</p>
          <Link to="/catalogo?category=tenis" className="bg-base text-tinta font-body font-semibold px-6 py-3 rounded-[3px]">Ver tênis</Link>
        </div>
      </section>

      {/* FAIXA CONFIANÇA */}
      <section className="border-t border-linha max-w-6xl mx-auto px-4 py-6 flex flex-wrap gap-6 text-sm text-poeira">
        <span>Entrega em São João Evangelista e região</span><span>•</span><span>Troca em até 7 dias</span><span>•</span><span>Pix, cartão e boleto</span>
      </section>
    </div>
  );
}
