const express = require('express');
const router = express.Router();
const controller = require('./auth.controller');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, googleSchema } = require('./auth.schema');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/google', validate(googleSchema), controller.google);
router.post('/logout', controller.logout);
router.get('/me', authMiddleware, controller.me);

module.exports = router;
