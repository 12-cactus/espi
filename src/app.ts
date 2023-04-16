import express, { Request, Response } from 'express';
import morgan from 'morgan';

import ApiError from './exceptions/ApiError';
import logger from './lib/logger';
import router from './router';
import webhook from './webhook';

// Config Express
const app = express();

app.use(morgan('combined', { stream: { write: message => logger.info(message) } }));
app.use(webhook); // Telegram Webhook
app.use(router); // Espi API

// Not Found Handling
app.use((req, res, next) => {
  next({
    message: `${req.method} ${req.path} Not Found`,
    status: 404,
  });
});

// Must be the last middleware to work properly
app.use((error: Error | ApiError, req: Request, res: Response) => {
  const status = error instanceof ApiError ? error.status : 500;
  const message = error.message || 'Ups, something went wrong...';
  const errors = error instanceof ApiError && error.errors.length > 0 ? error.errors : undefined;

  if (status >= 500) logger.error(error);
  return res.status(status).json({ status, message, errors });
});

export default app;
