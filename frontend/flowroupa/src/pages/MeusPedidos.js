import OrderHistoryList from '../account/OrderHistoryList';

export default function MeusPedidos() {
  return (
    <div style={{ padding: 20, maxWidth: 700 }}>
      <h1>Meus Pedidos</h1>
      <OrderHistoryList />
    </div>
  );
}
