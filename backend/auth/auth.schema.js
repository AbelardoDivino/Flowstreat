const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha mínimo 6 caracteres'),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

const googleSchema = z.object({
  idToken: z.string().min(1, 'idToken obrigatório'),
});

module.exports = { registerSchema, loginSchema, googleSchema };
