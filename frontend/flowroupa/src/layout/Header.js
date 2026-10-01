import { Link, useNavigate } from 'react-router-dom';
import CartIcon from '../cart/CartIcon';
import useAuthStore from '../components/store/authStore';

export default function Header({ onCartClick }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-base border-b border-linha">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="font-display text-2xl tracking-tight text-tinta">FLOWSTREAT</Link>
        <nav className="hidden md:flex gap-6 text-sm font-body">
          <Link to="/catalogo" className="hover:text-fluxo">Coleção</Link>
          <Link to="/catalogo?category=tenis" className="hover:text-fluxo">Tênis</Link>
          <Link to="/catalogo?category=acessorios" className="hover:text-fluxo">Acessórios</Link>
        </nav>
        <div className="flex items-center gap-3">
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
  );
}
