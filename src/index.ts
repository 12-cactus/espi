import dotenv from 'dotenv';

// Dotenv configuration should be called before import any internal module
dotenv.config();

import app from './app';
import bot from './bot';
import { ownerChannel } from './config';
import crontab from './crontab';
import logger from './lib/logger';

const { EXPRESS_PORT = 3000 } = process.env;

// Start
app.listen(EXPRESS_PORT, () => {
  // start cron jobs
  crontab.schedule.start();
  bot.telegram.sendMessage(ownerChannel, '🌵 Espi started');
  logger.info('✔ Crontab started');
  logger.info('✔ Bot launched');
  logger.info(`✔ Running on ${EXPRESS_PORT}`);
});
