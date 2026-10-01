// Redis opcional (cache/filas — fase 2). Só conecta se REDIS_URL estiver configurada.
const env = require('../config/env');

let client = null;

function getRedis() {
  if (client) return client;
  if (!env.REDIS_URL || env.REDIS_URL.includes('localhost')) {
    return null;
  }
  try {
    const Redis = require('ioredis');
    client = new Redis(env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 });
    client.on('error', () => {});
    return client;
  } catch {
    return null;
  }
}

module.exports = { getRedis };
