const env = require('./env');

// FRONTEND_URL pode ser lista separada por vírgula.
// Além disso, libera qualquer preview https://*.vercel.app (deploys de preview).
const allowed = (env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // requisições sem origin (curl, health check do Render, mobile) passam
    if (!origin) return callback(null, true);
    if (allowed.includes(origin)) return callback(null, true);
    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

module.exports = corsOptions;
