function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';
  // esconder stack cru do Prisma em produção/dev para o front
  if (message.includes('Raw query failed') || message.includes('ReplicaSetNoPrimary')) {
    message = 'Banco temporariamente indisponível. Verifique o Atlas (cluster pausado ou IP não liberado) e tente recarregar.';
  }
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
