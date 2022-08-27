import bot from './bot';
import logger from './logger';

const { BOT_DOMAIN } = process.env;

if (!BOT_DOMAIN) {
  logger.error('You have to define BOT_DOMAIN env var');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const path = Math.random().toString(36).substr(2, 10);
bot.telegram.setWebhook(`${BOT_DOMAIN}/${path}`);

const webhook = bot.webhookCallback(`/${path}`);

export default webhook;
