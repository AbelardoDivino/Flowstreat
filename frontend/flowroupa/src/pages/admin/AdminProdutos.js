import { useEffect, useState } from 'react';
import { getProducts } from '../../components/services/productService';

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function AdminProdutos() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', categorySlug: 'camisetas', variants: '[{"size":"M","color":"Preto","stock":10}]' });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const data = await getProducts({ limit: 50 });
      setProducts(data.products || []);
    } catch (e) { setMsg(e.message); }
  }
  useEffect(() => { load(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('description', form.description);
      fd.append('price', form.price);
      fd.append('categorySlug', form.categorySlug);
      fd.append('variants', form.variants);
      if (file) fd.append('images', file);
      const res = await fetch(`${API}/products`, { method: 'POST', credentials: 'include', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(`Criado: ${data.slug}`);
      load();
    } catch (err) { setMsg(err.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Excluir produto?')) return;
    await fetch(`${API}/products/${id}`, { method: 'DELETE', credentials: 'include' });
    load();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="font-display text-2xl mb-4">Produtos</h1>
      <form onSubmit={handleCreate} className="border border-linha p-4 mb-6 flex flex-col gap-2">
        <h3 className="font-semibold">Novo produto</h3>
        <input placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="border border-linha rounded-[3px] px-3 py-2 text-sm" />
        <input placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-linha rounded-[3px] px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <input placeholder="Preço" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="border border-linha rounded-[3px] px-3 py-2 text-sm w-32" />
          <select value={form.categorySlug} onChange={(e) => setForm({ ...form, categorySlug: e.target.value })} className="border border-linha rounded-[3px] px-3 py-2 text-sm">
            <option value="camisetas">Camisetas</option>
            <option value="calcas">Calças</option>
            <option value="vestidos">Vestidos</option>
            <option value="jaquetas">Jaquetas</option>
            <option value="tenis">Tênis</option>
            <option value="acessorios">Acessórios</option>
          </select>
        </div>
        <input placeholder='Variantes JSON' value={form.variants} onChange={(e) => setForm({ ...form, variants: e.target.value })} className="border border-linha rounded-[3px] px-3 py-2 text-sm" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" />
        <button className="bg-fluxo text-white py-2 rounded-[3px] font-semibold">Cadastrar produto</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
      {products.map((p) => (
        <div key={p.id} className="border-b border-linha py-2 flex justify-between items-center">
          <span className="text-sm">{p.name} — R$ {p.price?.toFixed(2)}</span>
          <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600">Excluir</button>
        </div>
      ))}
    </div>
  );
}
