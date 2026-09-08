import { useEffect, useState } from 'react';
const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
export default function AddressSelector({ selected, onSelect }) {
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    fetch(`${API}/users/me/addresses`, { credentials: 'include' }).then((r) => r.json()).then(setAddresses).catch(() => {});
  }, []);
  return (
    <div>
      <h4>Escolha o endereço</h4>
      {addresses.length === 0 ? <p>Nenhum endereço cadastrado</p> : addresses.map((a) => (
        <label key={a.id} style={{ display: 'block', border: selected === a.id ? '2px solid #000' : '1px solid #ddd', padding: 8, marginBottom: 8 }}>
          <input type="radio" checked={selected === a.id} onChange={() => onSelect(a.id)} />
          {a.street}, {a.number} - {a.city}/{a.state} CEP {a.zipCode}
        </label>
      ))}
    </div>
  );
}
