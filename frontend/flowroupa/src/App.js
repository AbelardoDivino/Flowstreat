import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Catalogo from './pages/Catalogo';
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import Carrinho from './pages/Carrinho';
import Checkout from './pages/Checkout';
import MinhaConta from './pages/MinhaConta';
import MeusPedidos from './pages/MeusPedidos';
import RotaPrivada from './components/RotaPrivada';
import useAuth from './components/hooks/useAuth';
import CartIcon from './cart/CartIcon';
import CartDrawer from './cart/CartDrawer';
import { useState } from 'react';

function App() {
  const { restore } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { restore(); }, []);

  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ddd', alignItems: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/carrinho">Carrinho</Link>
        <Link to="/login">Login</Link>
        <Link to="/cadastro">Cadastro</Link>
        <Link to="/minha-conta">Minha Conta</Link>
        <Link to="/meus-pedidos">Meus Pedidos</Link>
        <CartIcon onClick={() => setCartOpen(true)} />
      </nav>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/produto/:slug" element={<ProdutoDetalhe />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/checkout" element={<RotaPrivada><Checkout /></RotaPrivada>} />
        <Route path="/minha-conta" element={<RotaPrivada><MinhaConta /></RotaPrivada>} />
        <Route path="/meus-pedidos" element={<RotaPrivada><MeusPedidos /></RotaPrivada>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
