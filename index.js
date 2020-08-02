require('dotenv').config();
const { Telegraf } = require('telegraf');
const y18n = require('y18n');
const holidays = require('./src/holidays');

const { __ } = y18n({ locale: 'es' });

const bot = new Telegraf(process.env.BOT_TOKEN);

// Handler for /start command.
bot.start(ctx => ctx.reply('Welcome!'));

// Handler for /help command.
bot.help(ctx => ctx.reply('Send me a sticker'));

// Registers middleware for provided update type.
bot.on('sticker', ctx => ctx.reply('👍'));

// Registers middleware for handling text messages.
bot.hears('ping', ctx => ctx.reply('ACK'));
bot.hears('hi', ctx => ctx.reply(__`hi`));
bot.hears(/^espi +feriados/, holidays);

bot.launch();
