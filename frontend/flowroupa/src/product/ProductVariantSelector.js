const colorMap = { Preto: '#111', Branco: '#F7F6F2', Azul: '#2A3EF5', Vermelho: '#D33' };
export default function ProductVariantSelector({ variants, selected, onSelect }) {
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color))];
  const variant = variants.find((v) => v.size === selected.size && v.color === selected.color);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm text-poeira mb-2">Tamanho</p>
        <div className="flex gap-2">
          {sizes.map((s) => (
            <button key={s} onClick={() => onSelect({ ...selected, size: s })} className={`w-10 h-10 border rounded-[3px] text-sm font-semibold ${selected.size === s ? 'bg-tinta text-base border-tinta' : 'bg-base border-linha'}`}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-poeira mb-2">Cor</p>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button key={c} title={c} onClick={() => onSelect({ ...selected, color: c })} className={`w-8 h-8 rounded-full border-2 ${selected.color === c ? 'border-tinta' : 'border-linha'}`} style={{ background: colorMap[c] || '#C9C6BC' }} />
          ))}
        </div>
      </div>
      {variant && <p className="text-sm text-poeira">{variant.stock > 0 ? `${variant.stock} em estoque` : 'Indisponível'}</p>}
    </div>
  );
}
