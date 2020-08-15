require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const logger = require('winston-ready');
const morgan = require('morgan');

const { BOT_DOMAIN } = process.env;
if (!BOT_DOMAIN) {
  console.error('You have to define BOT_DOMAIN env var');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

// Config Express
const app = express();
app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));
app.use(bodyParser.urlencoded({ extended: true }));

// Telegram Webhook
app.use(require('./webhook'));

// Espi API
app.use(require('./router'));

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
