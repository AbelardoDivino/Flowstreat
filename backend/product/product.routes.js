const express = require('express');
const multer = require('multer');
const controller = require('./product.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMidlleware');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', controller.list);
router.get('/:slug', controller.getBySlug);
router.post('/', authMiddleware, adminMiddleware, upload.array('images', 5), controller.create);
router.put('/:id', authMiddleware, adminMiddleware, controller.update);
router.delete('/:id', authMiddleware, adminMiddleware, controller.remove);

module.exports = router;
