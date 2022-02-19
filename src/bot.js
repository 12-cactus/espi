require('dotenv').config();
const { Telegraf } = require('telegraf');
const y18n = require('y18n');
const holidays = require('./features/holidays');
const holidaysCa = require('./features/holidays-ca');
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
bot.hears(/^espi +(férié|ferie)/, holidaysCa);

// Reply With Stickers
bot.hears(/\bfacuuu\b/i, async ctx => ctx.replyWithSticker(await stickers.maybeFacu()));
bot.hears(/pinto +\w+ +perro/i, async ctx => ctx.replyWithSticker(await stickers.paintedDog()));
bot.hears(/pattern +matching/i, async ctx => ctx.replyWithSticker(await stickers.patternMatchingDan()));

// Let me google that
const searchLink = q => encodeURI(`https://www.google.com/search?q=${q}`);
bot.hears(/^(g|google)\s+(?<q>.+)/i, async ctx => ctx.reply(searchLink(ctx.match.groups.q)));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
