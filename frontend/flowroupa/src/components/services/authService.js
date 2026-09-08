const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export async function register(data) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}
export async function login(data) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
}
export async function loginWithGoogle(idToken) {
  return request('/auth/google', { method: 'POST', body: JSON.stringify({ idToken }) });
}
export async function logout() {
  return request('/auth/logout', { method: 'POST' });
}
export async function getMe() {
  return request('/auth/me');
}
