const prisma = require('../lib/prisma');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const { OAuth2Client } = require('google-auth-library');
const env = require('../config/env');

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email já cadastrado');
    err.status = 400;
    throw err;
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role: 'customer' },
  });
  const token = signToken({ id: user.id, role: user.role });
  return { user: sanitize(user), token };
}

async function login(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }
  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }
  const token = signToken({ id: user.id, role: user.role });
  return { user: sanitize(user), token };
}

async function loginWithGoogle(idToken) {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (e) {
    const err = new Error('Token Google inválido');
    err.status = 401;
    throw err;
  }

  const { sub: googleId, email, name } = payload;
  if (!email) {
    const err = new Error('Email não fornecido pelo Google');
    err.status = 400;
    throw err;
  }

  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId }, { email }] },
  });

  if (!user) {
    user = await prisma.user.create({
      data: { name: name || email, email, googleId, role: 'customer' },
    });
  } else if (!user.googleId) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { googleId },
    });
  }

  const token = signToken({ id: user.id, role: user.role });
  return { user: sanitize(user), token };
}

function sanitize(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

async function getById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return null;
  return sanitize(user);
}

module.exports = { register, login, loginWithGoogle, getById, sanitize };
