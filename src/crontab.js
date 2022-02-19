require('dotenv').config();
const { CronJob } = require('cron');
const fns = require('date-fns');
const bot = require('./bot');
const { findNextLongWeekendAR } = require('./features/holidays');
const sendRegards = require('./features/schedule');

const Job = (cron, triggerFn) => new CronJob(cron, () => {
  triggerFn();
}, null, true, 'America/Argentina/Buenos_Aires');

const mainChannel = process.env.MAIN_CHANNEL;

module.exports = {
  schedule: Job('0 9 * * *', () => { sendRegards(bot); }),
  holidays: Job('15 9 * * * *', async () => {
    const longWeekendFound = await findNextLongWeekendAR();
    const diff = startingDate => fns.differenceInDays(startingDate, new Date()) + 1;
    const shouldSend = longWeekendFound && [1, 7, 14].includes(diff(longWeekendFound.start));
    if (shouldSend) {
      const content = `Próximo finde largo: *${fns.format(longWeekendFound.start, 'dd MMM')}-${fns.format(longWeekendFound.end, 'dd MMM')}*`;
      await bot.telegram.sendMessage(mainChannel, content, { parse_mode: 'Markdown' });
    }
  }),
};
