const rateLimit = require('express-rate-limit');

// geral: 100 req / 15min por IP
const general = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em instantes.' },
});

// restrito: login e pagamentos — 10 req / min por IP
const strict = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite de tentativas atingido. Aguarde 1 minuto.' },
});

module.exports = { general, strict, loginLimiter: strict, paymentLimiter: strict };
