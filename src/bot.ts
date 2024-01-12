import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import GPTController from './controllers/GPTController';
import GitHubController from './controllers/GitHubController';
import StickersController from './controllers/StickersController';
import Holidays from './core/holidays';
import logger from './lib/logger';
import GPTMiddleware from './middlewares/GPTMiddleware';

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
bot.hears(/^ping$/i, ctx => ctx.reply('ACK'));
bot.hears(/\b(hi|hola)\b/, ctx => ctx.reply('👋'));
bot.hears(/^espi +version/i, ctx => ctx.reply(`Soy ${ctx.botInfo?.username}@${process.env.npm_package_version}`));
bot.hears(/^espi +id/i, ctx => {
  const name = ctx.chat.type === 'private' ? `${ctx.chat.first_name} (@${ctx.chat.username})` : ctx.chat.title;
  ctx.reply(`
- Nombre: ${name}
- ID: ${ctx.chat.id} (${ctx.chat.type})
`);
});

// Espi Commands
bot.hears(/^espi +feriados/i, Holidays.holidaysAR);
bot.hears(/^espi +(férié|ferie)/i, Holidays.holidaysCA);
bot.hears(/^espi +(finde +largo|fl)/i, Holidays.nextLongWeekendAR);
bot.hears(/^espi +(findes +largos|ffll)/i, Holidays.nextThreeLongWeekendsAR);
bot.hears(/^espi +issues$/i, async ctx => GitHubController.listIssues(ctx));
bot.hears(/^espi +issue +(?<title>[a-zA-ZÀ-ÿ0-9 _-]+)[.\n]?(?<description>.+)?$/i, async ctx =>
  GitHubController.createIssue(ctx)
);

// ChatGPT answers
bot.hears(
  /^espi +(?<question>.+)/i,
  async (ctx, next) => GPTMiddleware.authorizedChannel(ctx, next),
  async ctx => GPTController.handleQuestion(ctx)
);

// ChatGPT Audio Transcription
bot.on(
  message('voice'),
  async (ctx, next) => GPTMiddleware.authorizedChannel(ctx, next),
  async ctx => GPTController.transcriptAudio(ctx)
);

// Reply With Stickers
bot.hears(/\bfacuuu\b/i, StickersController.replyWithMaybeFacu);
bot.hears(/pinto +\w+ +perro/i, StickersController.replyWithPaintedDog);
bot.hears(/pattern +matching/i, StickersController.replyWithPatternMatchingDan);

// Let me google that
const searchLink = (query: string) => encodeURI(`https://www.google.com/search?q=${query}`);
bot.hears(/^(g|gg|google)\s+(?<q>.+)/i, async ctx => ctx.reply(searchLink(ctx.match?.groups?.q || '')));

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;
