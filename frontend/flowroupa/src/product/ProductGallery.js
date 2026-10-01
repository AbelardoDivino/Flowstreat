import { useState } from 'react';
export default function ProductGallery({ images }) {
  const [idx, setIdx] = useState(0);
  if (!images?.length) return null;
  return (
    <div>
      <div className="aspect-square bg-white border border-linha overflow-hidden">
        <img src={images[idx]} alt="produto" loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="flex gap-2 mt-3">
        {images.map((img, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`w-16 h-16 border overflow-hidden ${i === idx ? 'border-tinta' : 'border-linha'}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
