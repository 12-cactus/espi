require('dotenv').config();
const bot = require('./bot');

const { BOT_DOMAIN } = process.env;

if (!BOT_DOMAIN) {
  // eslint-disable-next-line no-console
  console.error('You have to define BOT_DOMAIN env var');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const path = Math.random().toString(36).substr(2, 10);
bot.telegram.setWebhook(`${BOT_DOMAIN}/${path}`);

module.exports = bot.webhookCallback(`/${path}`);
