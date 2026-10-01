import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import RotaAdmin from './components/RotaAdmin';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminPedidos from './pages/admin/AdminPedidos';
import useAuth from './components/hooks/useAuth';
import Header from './layout/Header';
import CartDrawer from './cart/CartDrawer';

function App() {
  const { restore } = useAuth();
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { restore(); }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base font-body text-tinta">
        <Header onCartClick={() => setCartOpen(true)} />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/produto/:slug" element={<ProdutoDetalhe onAdd={() => setCartOpen(true)} />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<RotaPrivada><Checkout /></RotaPrivada>} />
          <Route path="/minha-conta" element={<RotaPrivada><MinhaConta /></RotaPrivada>} />
          <Route path="/meus-pedidos" element={<RotaPrivada><MeusPedidos /></RotaPrivada>} />
          <Route path="/admin/produtos" element={<RotaAdmin><AdminProdutos /></RotaAdmin>} />
          <Route path="/admin/pedidos" element={<RotaAdmin><AdminPedidos /></RotaAdmin>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
