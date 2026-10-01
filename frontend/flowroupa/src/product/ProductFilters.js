import { useState } from 'react';

export default function ProductFilters({ onChange }) {
  const [f, setF] = useState({ category: '', size: '', color: '', minPrice: '', maxPrice: '' });
  function update(k, v) {
    const n = { ...f, [k]: v };
    setF(n);
    onChange(Object.fromEntries(Object.entries(n).filter(([, val]) => val)));
  }
  const btn = (active) => active ? 'bg-tinta text-base border-tinta' : 'bg-base border-linha';
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <select value={f.category} onChange={(e) => update('category', e.target.value)} className="border border-linha rounded-[3px] px-3 py-2 text-sm">
        <option value="">Todas</option>
        <option value="camisetas">Camisetas</option>
        <option value="calcas">Calças</option>
        <option value="vestidos">Vestidos</option>
        <option value="jaquetas">Jaquetas</option>
        <option value="tenis">Tênis</option>
        <option value="acessorios">Acessórios</option>
      </select>
      <div className="flex gap-1">
        {['P', 'M', 'G', 'GG'].map((s) => (
          <button key={s} onClick={() => update('size', f.size === s ? '' : s)} className={`w-9 h-9 border rounded-[3px] text-sm font-semibold ${btn(f.size === s)}`}>{s}</button>
        ))}
      </div>
      <input placeholder="Preço mín" type="number" value={f.minPrice} onChange={(e) => update('minPrice', e.target.value)} className="w-24 border border-linha rounded-[3px] px-2 py-2 text-sm" />
      <input placeholder="Preço máx" type="number" value={f.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} className="w-24 border border-linha rounded-[3px] px-2 py-2 text-sm" />
    </div>
  );
}
