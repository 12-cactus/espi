import fs from 'fs';

import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import AIController from './controllers/AIController';
import StickersController from './controllers/StickersController';
import AI from './features/AI';
import Holidays from './features/holidays';
import api from './lib/api';
import logger from './lib/logger';

if (!process.env.BOT_TOKEN) {
  logger.error('You have to define BOT_TOKEN env var');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

// Handler for /start command
bot.start(ctx => ctx.reply('Welcome!'));

// Handler for /help command
bot.help(ctx => ctx.reply('Send me a sticker'));

// Basic and Info
bot.hears('ping', ctx => ctx.reply('ACK'));
bot.hears(/(hi|hola)/, ctx => ctx.reply('👋'));
bot.hears(/^espi +version/i, ctx => ctx.reply(`Soy ${ctx.botInfo?.username}@${process.env.npm_package_version}`));
bot.hears(/^espi +id/i, ctx => {
  const name = ctx.chat.type === 'private' ? `${ctx.chat.first_name} (@${ctx.chat.username})` : ctx.chat.title;
  ctx.reply(`
- Nombre: ${name}
- ID: ${ctx.chat.id} (${ctx.chat.type})
`);
});

// Espi Featuring
bot.hears(/^espi +feriados/i, Holidays.holidaysAR);
bot.hears(/^espi +(férié|ferie)/i, Holidays.holidaysCA);
bot.hears(/^espi +(finde +largo|fl)/i, Holidays.nextLongWeekendAR);
bot.hears(/^espi +(findes +largos|ffll)/i, Holidays.nextThreeLongWeekendsAR);
bot.hears(AIController.shouldRespond, AIController.handleQuestion);

// Reply With Stickers
bot.hears(/\bfacuuu\b/i, StickersController.replyWithMaybeFacu);
bot.hears(/pinto +\w+ +perro/i, StickersController.replyWithPaintedDog);
bot.hears(/pattern +matching/i, StickersController.replyWithPatternMatchingDan);

// Let me google that
const searchLink = (query: string) => encodeURI(`https://www.google.com/search?q=${query}`);
bot.hears(/^(g|gg|google)\s+(?<q>.+)/i, async ctx => ctx.reply(searchLink(ctx.match?.groups?.q || '')));

// Audio
bot.on(message('voice'), async ctx => {
  const voice = ctx.message?.voice;
  const tmpFile = `./voice-${ctx.message.message_id}.mp3`;
  const link = await ctx.telegram.getFileLink(voice.file_id);
  const res = await api.get(link.href, { responseType: 'arraybuffer' });
  await fs.promises.writeFile(tmpFile, res.data);
  const transcription = await AI.transcript(tmpFile);
  ctx.reply(transcription);
  await fs.promises.rm(tmpFile);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;
