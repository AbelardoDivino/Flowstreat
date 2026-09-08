const { verifyToken } = require('../utils/jwt');
const authService = require('../auth/auth.service');

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.replace('Bearer ', ''));
    if (!token) return res.status(401).json({ error: 'Não autenticado' });
    const decoded = verifyToken(token);
    const user = await authService.getById(decoded.id);
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado' });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = authMiddleware;
