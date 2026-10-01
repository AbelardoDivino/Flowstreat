const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function getProducts(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  try {
    const res = await fetch(`${API}/products${params ? `?${params}` : ''}`);
    if (!res.ok) {
      console.warn('getProducts', res.status);
      return { products: [], total: 0 };
    }
    return res.json();
  } catch (e) {
    console.warn('getProducts network', e.message);
    return { products: [], total: 0 };
  }
}

export async function getProductBySlug(slug) {
  const res = await fetch(`${API}/products/${slug}`);
  if (!res.ok) throw new Error('Produto não encontrado');
  return res.json();
}
