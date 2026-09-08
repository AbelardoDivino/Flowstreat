export default function ProductVariantSelector({ variants, selected, onSelect }) {
  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color))];
  const selectedVariant = variants.find((v) => v.size === selected.size && v.color === selected.color);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <strong>Tamanho:</strong>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {sizes.map((s) => (
            <button key={s} onClick={() => onSelect({ ...selected, size: s })} style={{ padding: '6px 12px', border: selected.size === s ? '2px solid #000' : '1px solid #ddd', background: '#fff' }}>{s}</button>
          ))}
        </div>
      </div>
      <div>
        <strong>Cor:</strong>
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          {colors.map((c) => (
            <button key={c} onClick={() => onSelect({ ...selected, color: c })} style={{ padding: '6px 12px', border: selected.color === c ? '2px solid #000' : '1px solid #ddd', background: '#fff' }}>{c}</button>
          ))}
        </div>
      </div>
      {selectedVariant && <p>Estoque: {selectedVariant.stock} {selectedVariant.stock === 0 && '(indisponível)'}</p>}
    </div>
  );
}
