const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function getProducts(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`${API}/products${params ? `?${params}` : ''}`);
  if (!res.ok) throw new Error('Erro ao listar produtos');
  return res.json();
}

export async function getProductBySlug(slug) {
  const res = await fetch(`${API}/products/${slug}`);
  if (!res.ok) throw new Error('Produto não encontrado');
  return res.json();
}
