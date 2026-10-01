const { MercadoPagoConfig } = require('mercadopago');
const env = require('../config/env');

let client = null;
if (env.MERCADOPAGO_ACCESS_TOKEN && env.MERCADOPAGO_ACCESS_TOKEN !== 'TEST-pendente') {
  client = new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
}

module.exports = client;
