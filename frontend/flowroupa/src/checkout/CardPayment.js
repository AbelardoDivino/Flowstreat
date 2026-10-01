import { useState } from 'react';
import { payCard } from '../components/services/paymentService';

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
    <div style={{ border: '1px solid #ddd', padding: 12 }}>
      <h4>Cartão de Crédito</h4>
      <p style={{ fontSize: 12, color: '#666' }}>Em produção use o SDK do Mercado Pago para gerar o token. Aqui token é inserido manualmente para teste.</p>
      <form onSubmit={handlePay} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input placeholder="Token do cartão (gerado pelo SDK)" value={form.token} onChange={(e) => setForm({ ...form, token: e.target.value })} required />
        <input placeholder="Payment Method ID (visa, master...)" value={form.paymentMethodId} onChange={(e) => setForm({ ...form, paymentMethodId: e.target.value })} />
        <input placeholder="Installments" type="number" value={form.installments} onChange={(e) => setForm({ ...form, installments: e.target.value })} />
        <input placeholder="Issuer ID (opcional)" value={form.issuerId} onChange={(e) => setForm({ ...form, issuerId: e.target.value })} />
        <button type="submit">Pagar com cartão</button>
      </form>
      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
