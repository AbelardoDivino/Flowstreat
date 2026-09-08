import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../components/hooks/useAuth';

export default function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.name.length < 2) return setError('Nome muito curto');
    if (!form.email.includes('@')) return setError('Email inválido');
    if (form.password.length < 6) return setError('Senha mínimo 6 caracteres');
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>Cadastro</h2>
      <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Senha (mín 6)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
    </form>
  );
}
