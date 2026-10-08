import { useState } from 'react';
import { payCard } from '../components/services/paymentService';

const inputCls = 'border border-linha rounded-[3px] px-3 py-2 text-sm bg-white text-tinta w-full';
const labelCls = 'text-sm text-poeira';

export default function CardPayment({ orderId }) {
  const [form, setForm] = useState({ token: '', installments: 1, paymentMethodId: 'visa', issuerId: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  async function handlePay(e) {
    e.preventDefault();
    setError(''); setMsg('');
    try {
      const res = await payCard(orderId, form);
      if (res.status === 'approved') setMsg('Pagamento aprovado!');
      else if (res.status === 'rejected') setMsg('Pagamento recusado: ' + (res.detail || ''));
      else setMsg('Status: ' + res.status);
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="border border-linha rounded-[3px] p-4 bg-white">
      <h4 className="font-display text-lg">Cartão de crédito</h4>
      <p className="text-xs text-poeira mt-1">Em produção o token é gerado pelo SDK do Mercado Pago sem passar pelo nosso servidor. Aqui o token é inserido manualmente para teste.</p>
      <form onSubmit={handlePay} className="flex flex-col gap-3 mt-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="card-token" className={labelCls}>Token do cartão</label>
          <input id="card-token" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} required className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="card-method" className={labelCls}>Bandeira (visa, master...)</label>
          <input id="card-method" value={form.paymentMethodId} onChange={(e) => setForm({ ...form, paymentMethodId: e.target.value })} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="card-installments" className={labelCls}>Parcelas</label>
          <input id="card-installments" type="number" min="1" max="12" value={form.installments} onChange={(e) => setForm({ ...form, installments: e.target.value })} className={inputCls} />
        </div>
        <button type="submit" className="bg-fluxo text-white py-3 rounded-[3px] font-semibold">Pagar com cartão</button>
      </form>
      {msg && <p role="status" className="text-sm text-green-700 mt-2">{msg}</p>}
      {error && <p role="alert" className="text-sm text-red-700 mt-2">{error}</p>}
    </div>
  );
}
