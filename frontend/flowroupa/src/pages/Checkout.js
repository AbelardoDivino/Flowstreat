import { useState } from 'react';
import useCartStore from '../components/store/cartStore';
import AddressSelector from '../checkout/AddressSelector';
import AddressForm from '../checkout/AddressForm';
import OrderReview from '../checkout/OrderReview';
import PaymentMethodSelector from '../checkout/PaymentMethodSelector';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Checkout() {
  const { items, clear } = useCartStore();
  const [addressId, setAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleConfirm() {
    if (!addressId) return setMsg('Selecione um endereço');
    if (!items.length) return setMsg('Carrinho vazio');
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          addressId,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(`Pedido criado! ID: ${data.id} - Aguardando pagamento (${paymentMethod})`);
      clear();
    } catch (e) { setMsg(e.message); }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Checkout</h1>
      <AddressSelector selected={addressId} onSelect={setAddressId} />
      <button onClick={() => setShowForm(!showForm)} style={{ margin: '8px 0' }}>{showForm ? 'Fechar' : 'Novo endereço'}</button>
      {showForm && <AddressForm onCreated={(a) => { setAddressId(a.id); setShowForm(false); }} />}
      <OrderReview addressId={addressId} />
      <h4>Pagamento</h4>
      <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
      <button onClick={handleConfirm} style={{ width: '100%', padding: 12, background: '#000', color: '#fff', marginTop: 12 }}>Confirmar pedido</button>
      {msg && <p style={{ marginTop: 12, fontWeight: 'bold' }}>{msg}</p>}
    </div>
  );
}
