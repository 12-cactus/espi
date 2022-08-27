/* eslint-disable import/first */
import dotenv from 'dotenv';

// Dotenv configuration should be called before import any internal module
dotenv.config();

import app from './server';
import crontab from './crontab';
import logger from './logger';

const { EXPRESS_PORT = 3000 } = process.env;

// Start
app.listen(EXPRESS_PORT, () => {
  logger.info(`Running on ${EXPRESS_PORT}`);

  // start cron jobs
  crontab.schedule.start();
});
