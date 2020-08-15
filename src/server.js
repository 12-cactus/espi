require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('winston-ready');
const morgan = require('morgan');

// Config Express
const app = express();
app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));
app.use(bodyParser.urlencoded({ extended: true }));

// Telegram Webhook
app.use(require('./webhook'));

// Espi API
app.use(require('./router'));

// Not Found Handling
app.use((req, res, next) => {
  next({
    message: `${req.method} ${req.path} Not Found`,
    status: 404,
  });
});

// Must be the last middleware to work properly
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Ups, something is wrong...';
  if (status >= 500) logger.error(error);

  const response = { status, message };
  if (error.errors) response.errors = error.errors;
  return res.status(status).json(response);
});

module.exports = app;
