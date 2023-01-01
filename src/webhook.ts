import bot from './bot';
import logger from './lib/logger';

const { BOT_DOMAIN } = process.env;

if (!BOT_DOMAIN) {
  logger.error('You have to define BOT_DOMAIN env var');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const randomPath = Math.random().toString(32).substring(2);

bot.telegram.setWebhook(`${BOT_DOMAIN}/${randomPath}`);

const webhook = bot.webhookCallback(`/${randomPath}`);

export default webhook;
