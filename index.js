const express = require('express');
const bot = require('./src/bot');

const { BOT_DOMAIN, EXPRESS_PORT = 3000 } = process.env;

if (!BOT_DOMAIN) {
  console.error('You have to define BOT_DOMAIN env var');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const app = express();

const path = Math.random().toString(36).substr(2, 10);
bot.telegram.setWebhook(`${BOT_DOMAIN}/${path}`);
app.use(bot.webhookCallback(`/${path}`));

app.get('/', async (req, res) => {
  const me = await bot.telegram.getMe();
  res.send(`I'm ${me.first_name}`);
});

app.listen(EXPRESS_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Running on ${EXPRESS_PORT}`);
});

// bot.launch(); // Uncomment to start bot in polling mode
