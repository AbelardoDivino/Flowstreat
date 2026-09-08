import { useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, border: '1px solid #ddd', padding: 12 }}>
      <h4>Novo endereço</h4>
      <input placeholder="Rua" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
      <input placeholder="Número" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} required />
      <input placeholder="Bairro" value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} />
      <input placeholder="Cidade" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
      <input placeholder="Estado" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
      <input placeholder="CEP" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} required />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Salvar endereço</button>
    </form>
  );
}
