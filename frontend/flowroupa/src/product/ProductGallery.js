import { useState } from 'react';

export default function ProductGallery({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return null;
  return (
    <div>
      <img src={images[idx]} alt="produto" style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {images.map((img, i) => (
          <img key={i} src={img} alt="" onClick={() => setIdx(i)} style={{ width: 60, height: 60, objectFit: 'cover', border: i === idx ? '2px solid #000' : '1px solid #ddd', cursor: 'pointer' }} />
        ))}
      </div>
    </div>
  );
}
