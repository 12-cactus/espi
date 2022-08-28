import express, { Request, Response } from 'express';
import morgan from 'morgan';
import logger from './logger';
import ApiError from './exceptions/ApiError';

import webhook from './webhook';
import router from './router';

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
  const message = error.message || 'Ups, something is wrong...';
  if (status >= 500) logger.error(error);

  const response = {
    status,
    message,
    errors: (error instanceof ApiError && error.errors.length > 0) ? error.errors : undefined,
  };

  return res.status(status).json(response);
});

export default app;
