import { useState } from 'react';
import useCartStore from '../components/store/cartStore';
import AddressSelector from '../checkout/AddressSelector';
import AddressForm from '../checkout/AddressForm';
import OrderReview from '../checkout/OrderReview';
import PaymentMethodSelector from '../checkout/PaymentMethodSelector';
import PixPayment from '../checkout/PixPayment';
import CardPayment from '../checkout/CardPayment';
import BoletoPayment from '../checkout/BoletoPayment';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Checkout() {
  const { items, clear } = useCartStore();
  const [addressId, setAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [orderId, setOrderId] = useState(null);
  const [msg, setMsg] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleConfirm() {
    if (!addressId) return setMsg('Selecione um endereço');
    if (!items.length) return setMsg('Sua sacola está vazia');
    try {
      const res = await fetch(`${API}/orders`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })), addressId, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrderId(data.id);
      setMsg(`Pedido ${data.id.slice(-6)} criado`);
      clear();
    } catch (e) { setMsg(e.message); }
  }

  const step = !orderId ? (addressId ? 2 : 1) : 3;
  const steps = ['Endereço', 'Revisão', 'Pagamento'];

  if (!orderId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="font-display text-2xl">Finalizar compra</h1>
        <ol className="flex gap-2 mt-3 mb-6" aria-label="Etapas da compra">
          {steps.map((s, i) => (
            <li key={s} className={`flex-1 text-center text-xs py-2 border rounded-[3px] ${i + 1 <= step ? 'bg-tinta text-base border-tinta font-semibold' : 'border-linha text-poeira'}`}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>
        <AddressSelector selected={addressId} onSelect={setAddressId} />
        <button onClick={() => setShowForm(!showForm)} className="text-sm text-fluxo mt-2">{showForm ? 'Fechar' : '+ Novo endereço'}</button>
        {showForm && <div className="mt-3"><AddressForm onCreated={(a) => { setAddressId(a.id); setShowForm(false); }} /></div>}
        <div className="mt-6"><OrderReview addressId={addressId} /></div>
        <div className="mt-6">
          <p className="text-sm text-poeira mb-2">Pagamento</p>
          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
        </div>
        <button onClick={handleConfirm} className="btn btn-primary btn-block mt-6">Confirmar pedido</button>
        {msg && <p className="mt-3 text-sm font-semibold">{msg}</p>}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h2 className="font-display text-xl">Pagamento — {paymentMethod}</h2>
      <p className="text-sm text-poeira mb-4">Pedido {orderId.slice(-6)}</p>
      {paymentMethod === 'pix' && <PixPayment orderId={orderId} />}
      {paymentMethod === 'card' && <CardPayment orderId={orderId} />}
      {paymentMethod === 'boleto' && <BoletoPayment orderId={orderId} />}
      <p className="text-sm text-poeira mt-6">Você pode acompanhar em <a href="/meus-pedidos" className="text-fluxo">Meus pedidos</a></p>
    </div>
  );
}
