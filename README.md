# FlowStreat — Loja streetwear (São João Evangelista, MG)

E-commerce de roupas, tênis e acessórios. Catálogo → sacola → checkout → pedido → rastreio. Pagamento via Mercado Pago (Pix, cartão, boleto).

## Rodar localmente

Pré-requisitos: Node 18+, conta MongoDB Atlas.

```bash
# backend
cd backend
cp .env.example .env   # preencha DATABASE_URL, JWT_SECRET etc
npm install
npx prisma db push --schema=prisma/schema.prisma
node prisma/seed.js    # opcional: dados de exemplo
npm run dev            # http://localhost:4000 (GET /health)

# frontend (outro terminal)
cd frontend/flowroupa
cp .env.example .env
npm install
npm start              # http://localhost:3000
```

## Variáveis de ambiente

Backend: ver `backend/.env.example` (PORT, DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID/SECRET, MERCADOPAGO_ACCESS_TOKEN/PUBLIC_KEY, SMTP_*, FRONTEND_URL).
Frontend: ver `frontend/flowroupa/.env.example` (REACT_APP_API_URL, REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_MERCADOPAGO_PUBLIC_KEY).

Nunca suba `.env` pro Git — já estão no `.gitignore`.

## Deploy

- Backend: Render/Railway com `render.yaml` de referência (`npm start`, `NODE_ENV=production`, cookie `secure`, CORS via `FRONTEND_URL`).
- Frontend: Vercel/Netlify com `REACT_APP_API_URL` apontando pro backend publicado.
- Trocar credenciais TEST do Mercado Pago por produção só ao vender de verdade.
- Virar admin: no Atlas, campo `role: "admin"` no seu usuário. Telas em `/admin/produtos` e `/admin/pedidos`.

## Estrutura

- `backend/`: Express (auth, user, product, order, payment, admin) + Prisma/MongoDB.
- `frontend/flowroupa/`: React 19 + Tailwind (tokens em `tailwind.config.js`, fontes Anton/Archivo).
- Fotos locais em `frontend/flowroupa/public/pictures/profissional/` (1000px, JPG q82).
