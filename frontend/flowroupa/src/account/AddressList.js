import { useEffect, useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
export default function AddressList() {
  const [list, setList] = useState([]);
  useEffect(() => { fetch(`${API}/users/me/addresses`, { credentials: 'include' }).then((r) => r.json()).then(setList).catch(() => {}); }, []);
  if (!list.length) return <p>Nenhum endereço cadastrado</p>;
  return <div>{list.map((a) => <p key={a.id} style={{ border: '1px solid #ddd', padding: 8 }}>{a.street}, {a.number} - {a.city}/{a.state} CEP {a.zipCode}</p>)}</div>;
}
