import { useEffect, useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
export default function ProfileForm() {
  const [user, setUser] = useState(null);
  useEffect(() => { fetch(`${API}/users/me`, { credentials: 'include' }).then((r) => r.json()).then((d) => setUser(d.user)).catch(() => {}); }, []);
  if (!user) return <p>Carregando perfil...</p>;
  return <div style={{ border: '1px solid #ddd', padding: 12 }}><h4>Perfil</h4><p>Nome: {user.name}</p><p>Email: {user.email}</p><p>Role: {user.role}</p></div>;
}
