import { useState } from 'react';

export default function ProductFilters({ onChange }) {
  const [filters, setFilters] = useState({ category: '', size: '', color: '', minPrice: '', maxPrice: '' });

  function update(key, value) {
    const next = { ...filters, [key]: value };
    setFilters(next);
    const clean = Object.fromEntries(Object.entries(next).filter(([, v]) => v));
    onChange(clean);
  }

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
      <select value={filters.category} onChange={(e) => update('category', e.target.value)}>
        <option value="">Todas categorias</option>
        <option value="camisetas">Camisetas</option>
        <option value="calcas">Calças</option>
        <option value="vestidos">Vestidos</option>
        <option value="jaquetas">Jaquetas</option>
      </select>
      <select value={filters.size} onChange={(e) => update('size', e.target.value)}>
        <option value="">Todos tamanhos</option>
        <option value="P">P</option>
        <option value="M">M</option>
        <option value="G">G</option>
        <option value="GG">GG</option>
      </select>
      <select value={filters.color} onChange={(e) => update('color', e.target.value)}>
        <option value="">Todas cores</option>
        <option value="Preto">Preto</option>
        <option value="Branco">Branco</option>
        <option value="Azul">Azul</option>
        <option value="Vermelho">Vermelho</option>
      </select>
      <input placeholder="Preço mín" type="number" value={filters.minPrice} onChange={(e) => update('minPrice', e.target.value)} style={{ width: 90 }} />
      <input placeholder="Preço máx" type="number" value={filters.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} style={{ width: 90 }} />
    </div>
  );
}
