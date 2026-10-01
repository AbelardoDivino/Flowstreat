const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = require('../config/cors');
const routes = require('./routes');
const errorHandler = require('../middlewares/errorHandler');
const { general } = require('../middlewares/rateLimiter');

const app = express();

app.use(helmet());
app.use(general);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', routes);

app.use(errorHandler);

module.exports = app;
