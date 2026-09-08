import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuth from '../components/hooks/useAuth';

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email.includes('@')) return setError('Email inválido');
    if (form.password.length < 6) return setError('Senha mínimo 6 caracteres');
    setLoading(true);
    try {
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(cred) {
    try {
      await loginWithGoogle(cred.credential);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '40px auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2>Login</h2>
      <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      <div style={{ marginTop: 12 }}>
        <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Erro no login com Google')} />
      </div>
    </form>
  );
}
