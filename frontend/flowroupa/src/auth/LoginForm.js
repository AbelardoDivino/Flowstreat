import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useAuth from '../components/hooks/useAuth';

const inputCls = 'border border-linha rounded-[3px] px-4 py-3 text-base bg-white text-tinta w-full placeholder:text-poeira';
const labelCls = 'text-sm font-semibold';

function EyeIcon({ off }) {
  if (off) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
  );
}

export default function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!form.email.includes('@')) return setError('Confira seu email e tente de novo.');
    if (form.password.length < 6) return setError('A senha tem no mínimo 6 caracteres.');
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
    <div className="max-w-sm mx-auto my-10 px-4">
      <form onSubmit={handleSubmit} className="border border-linha rounded-[3px] bg-white p-6 flex flex-col gap-4">
        <div>
          <h2 className="font-display text-3xl">Login</h2>
          <p className="text-sm text-poeira mt-1">Bom te ver de novo.</p>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="login-email" className={labelCls}>Email</label>
          <input id="login-email" type="email" autoComplete="email" placeholder="voce@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="login-password" className={labelCls}>Senha</label>
          <div className="relative">
            <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Sua senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={`${inputCls} pr-20`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'} className="absolute right-2 top-1/2 -translate-y-1/2 text-poeira hover:text-tinta min-h-[44px] min-w-[44px] grid place-items-center">
              <EyeIcon off={showPassword} />
            </button>
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-700 border border-red-300 bg-red-50 rounded-[3px] px-3 py-2">{error}</p>}
        <button type="submit" disabled={loading} className="bg-tinta text-base py-3 rounded-[3px] font-semibold disabled:opacity-50">{loading ? 'Entrando...' : 'Entrar'}</button>
        <div className="flex justify-center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Erro no login com Google')} />
        </div>
      </form>
      <p className="text-sm text-center mt-4 text-poeira">Ainda não tem conta? <Link to="/cadastro" className="text-fluxo font-semibold">Cadastre-se</Link></p>
    </div>
  );
}
