const authService = require('./auth.service');

function setCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    setCookie(res, token);
    res.status(201).json({ user, token });
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    setCookie(res, token);
    res.json({ user, token });
  } catch (e) { next(e); }
}

async function google(req, res, next) {
  try {
    const { idToken } = req.body;
    const { user, token } = await authService.loginWithGoogle(idToken);
    setCookie(res, token);
    res.json({ user, token });
  } catch (e) { next(e); }
}

async function logout(req, res) {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  });
  res.json({ message: 'Logout ok' });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, google, logout, me };
