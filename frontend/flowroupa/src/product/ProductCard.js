import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/produto/${product.slug}`} style={{ border: '1px solid #ddd', padding: 12, display: 'block', textDecoration: 'none', color: '#000' }}>
      <img src={product.images?.[0] || 'https://via.placeholder.com/300'} alt={product.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
      <h3 style={{ fontSize: 16, margin: '8px 0' }}>{product.name}</h3>
      <p style={{ fontWeight: 'bold' }}>R$ {product.price?.toFixed(2)}</p>
    </Link>
  );
}
