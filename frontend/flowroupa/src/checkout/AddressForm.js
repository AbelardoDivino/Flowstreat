import { useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const inputCls = 'input';
const labelCls = 'label';

function Field({ id, label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={labelCls}>{label}</label>
      <input id={id} {...props} className={inputCls} />
    </div>
  );
}

export default function AddressForm({ onCreated }) {
  const [form, setForm] = useState({ street: '', number: '', city: '', state: '', zipCode: '', neighborhood: '' });
  const [error, setError] = useState('');
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/users/me/addresses`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onCreated(data);
    } catch (err) { setError(err.message); }
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 border border-linha rounded-[3px] p-4 bg-white">
      <h4 className="font-display text-lg">Novo endereço</h4>
      <Field id="addr-street" label="Rua" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required autoComplete="street-address" />
      <Field id="addr-number" label="Número" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} required />
      <Field id="addr-neighborhood" label="Bairro" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
      <Field id="addr-city" label="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required autoComplete="address-level2" />
      <Field id="addr-state" label="Estado" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
      <Field id="addr-zip" label="CEP" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} required autoComplete="postal-code" inputMode="numeric" />
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" className="btn btn-dark btn-block">Salvar endereço</button>
    </form>
  );
}
