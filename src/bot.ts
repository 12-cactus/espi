import { Telegraf } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';
import { mainChannel } from './config';
import AI from './features/AI';

import Holidays from './features/holidays';
import stickers from './features/stickers';
import logger from './lib/logger';

const y18n = require('y18n');

// eslint-disable-next-line @typescript-eslint/naming-convention
const { __ } = y18n({ locale: 'es' });

if (!process.env.BOT_TOKEN) {
  logger.error('You have to define BOT_TOKEN env var');
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

// Espi commands
bot.hears(/^espi +feriados/i, Holidays.holidaysAR);
bot.hears(/^espi +(férié|ferie)/i, Holidays.holidaysCA);
bot.hears(/^espi +(finde +largo|fl)/i, Holidays.nextLongWeekendAR);
bot.hears(/^espi +(findes +largos|ffll)/i, Holidays.nextThreeLongWeekendsAR);
bot.hears((value, ctx) => {
  const update = ctx.update as Update.MessageUpdate;
  if (update.message.chat.id !== mainChannel) return null;
  return /^espi +(?<question>.+)/i.exec(value);
}, async (ctx) => {
  const question = (ctx.match?.groups?.question || '').trim();
  if (question.length < 7) {
    ctx.reply('Muy cortito amigo');
    return;
  }
  const answer = await AI.ask(question);
  ctx.reply(answer);
});

// Reply With Stickers
bot.hears(/\bfacuuu\b/i, async ctx => ctx.replyWithSticker(await stickers.maybeFacu()));
bot.hears(/pinto +\w+ +perro/i, async ctx => ctx.replyWithSticker(await stickers.paintedDog()));
bot.hears(/pattern +matching/i, async ctx => ctx.replyWithSticker(await stickers.patternMatchingDan()));

// Let me google that
const searchLink = (query: string) => encodeURI(`https://www.google.com/search?q=${query}`);
bot.hears(/^(g|gg|google)\s+(?<q>.+)/i, async ctx => ctx.reply(searchLink(ctx.match?.groups?.q || '')));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;
