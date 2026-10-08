import { Link, useNavigate } from 'react-router-dom';
import CartIcon from '../cart/CartIcon';
import useAuthStore from '../components/store/authStore';

export default function Header({ onCartClick }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <>
    <div className="bg-tinta text-base overflow-hidden py-2" aria-label="Frete grátis acima de R$ 200. Troca em até 7 dias.">
      <div className="marquee-track gap-8 text-xs font-body font-semibold">
        {[0, 1].map((n) => (
          <span key={n} aria-hidden={n === 1} className="flex gap-8 whitespace-nowrap">
            <span>Frete grátis acima de R$ 200</span><span className="text-selo">•</span>
            <span>Troca em até 7 dias</span><span className="text-selo">•</span>
            <span>Drop FIRE disponível</span><span className="text-selo">•</span>
            <span>Entrega em São João Evangelista e região</span><span className="text-selo">•</span>
          </span>
        ))}
      </div>
    </div>
    <header className="sticky top-0 z-40 bg-base border-b border-linha">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl tracking-tight text-tinta">FLOWSTREAT</Link>
        <nav className="hidden md:flex gap-6 text-sm font-body">
          <Link to="/catalogo" className="hover:text-fluxo">Coleção</Link>
          <Link to="/catalogo?category=tenis" className="hover:text-fluxo">Tênis</Link>
          <Link to="/catalogo?category=acessorios" className="hover:text-fluxo">Acessórios</Link>
        </nav>
        <div className="flex items-center gap-3">
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/pedidos" className="text-sm font-semibold hidden md:block">Pedidos</Link>
              <Link to="/admin/produtos" className="text-sm font-semibold hidden md:block">Produtos</Link>
            </>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/minha-conta" className="text-sm hidden md:block">{user?.name?.split(' ')[0]}</Link>
              <button onClick={() => { logout(); navigate('/'); }} className="text-sm text-poeira">Sair</button>
            </>
          ) : (
            <Link to="/login" className="text-sm border border-tinta px-3 py-1 rounded-[3px]">Entrar</Link>
          )}
          <CartIcon onClick={onCartClick} />
        </div>
      </div>
    </header>
    </>
  );
}
