import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-tinta text-base mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">FLOWSTREAT</p>
          <p className="text-sm mt-2" style={{ color: '#C9C6BC' }}>Roupa de rua do jeito que a gente vive. São João Evangelista, MG.</p>
        </div>
        <nav aria-label="Mapa do site" className="flex flex-col gap-2 text-sm">
          <Link to="/catalogo" className="hover:text-selo">Coleção</Link>
          <Link to="/catalogo?category=tenis" className="hover:text-selo">Tênis</Link>
          <Link to="/catalogo?category=acessorios" className="hover:text-selo">Acessórios</Link>
          <Link to="/meus-pedidos" className="hover:text-selo">Meus pedidos</Link>
          <Link to="/minha-conta" className="hover:text-selo">Minha conta</Link>
        </nav>
        <div className="text-sm" style={{ color: '#C9C6BC' }}>
          <p className="font-semibold text-base">Pagamento</p>
          <p className="mt-1">Pix • Cartão em até 3x • Boleto</p>
          <p className="mt-3 font-semibold text-base">Troca</p>
          <p className="mt-1">Em até 7 dias, peça sem uso.</p>
        </div>
      </div>
      <p aria-hidden="true" className="font-display font-outline text-center text-[18vw] md:text-[9rem] leading-none select-none pointer-events-none -mb-4">STREAT</p>
      <div className="border-t border-poeira">
        <p className="max-w-6xl mx-auto px-4 py-4 text-xs" style={{ color: '#C9C6BC' }}>© FlowStreat — São João Evangelista, MG</p>
      </div>
    </footer>
  );
}
