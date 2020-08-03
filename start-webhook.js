const bot = require('./src/bot');

const { WEBHOOK_DOMAIN, WEBHOOK_PORT } = process.env;

if (!WEBHOOK_DOMAIN) process.exit('You have to define WEBHOOK_DOMAIN env var');
if (!WEBHOOK_PORT) process.exit('You have to define WEBHOOK_PORT env var');

bot.launch({
  webhook: {
    domain: WEBHOOK_DOMAIN,
    port: WEBHOOK_PORT,
  },
});
