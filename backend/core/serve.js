const app = require('./app');
const env = require('../config/env');
const prisma = require('../lib/prisma');

async function serve() {
  try {
    await prisma.$connect();
    console.log('MongoDB conectado com sucesso');
  } catch (err) {
    console.error('Erro ao conectar no MongoDB:', err.message);
  }

  const port = env.PORT;
  app.listen(port, () => {
    console.log(`FlowStreat backend rodando em http://localhost:${port} [${env.NODE_ENV}]`);
  });
}

module.exports = serve;
