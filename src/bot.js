require('dotenv').config();
const { Telegraf } = require('telegraf');
const y18n = require('y18n');
const holidays = require('./features/holidays');
const stickers = require('./features/stickers');

const { __ } = y18n({ locale: 'es' });

if (!process.env.BOT_TOKEN) {
  // eslint-disable-next-line no-console
  console.error('You have to define BOT_TOKEN env var');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Handler for /start command.
bot.start(ctx => ctx.reply('Welcome!'));

// Handler for /help command.
bot.help(ctx => ctx.reply('Send me a sticker'));

// Registers middleware for provided update type.
// bot.on('sticker', ctx => ctx.reply('👍'));

// Registers middleware for handling text messages.
bot.hears('ping', ctx => ctx.reply('ACK'));
bot.hears('hi', ctx => ctx.reply(__`hi`));
bot.hears(/^espi +feriados/, holidays);
bot.hears(/facu/i, async (ctx, next) => {
  if (ctx.match.input.toLowerCase().includes('la facu')) return next();
  return stickers.maybeFacu(ctx);
});
bot.hears(/te pinto el perro/i, stickers.iWillPaintYourDog);

module.exports = bot;
