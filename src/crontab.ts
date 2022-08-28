import { CronJob } from 'cron';
import * as fns from 'date-fns';
import bot from './bot';
import Holidays from './features/holidays';
import Schedule from './features/schedule';

const Job = (cron: string, triggerFn: () => void) => new CronJob(cron, () => {
  triggerFn();
}, null, true, 'America/Argentina/Buenos_Aires');

const mainChannel = process.env.MAIN_CHANNEL || 0;

const crontab = {
  schedule: Job('0 9 * * *', () => {
    Schedule.sendRegards(bot);
  }),

  holidays: Job('15 9 * * *', async () => {
    const longWeekend = await Holidays.findNextLongWeekendAR();
    const diff = (startingDate: Date) => fns.differenceInDays(startingDate, new Date()) + 1;
    const shouldSend = longWeekend && [1, 7, 14].includes(diff(longWeekend.start));
    const format = (date: Date) => fns.format(date, 'dd MMM');
    if (shouldSend) {
      const content = `Próximo finde largo: *${format(longWeekend.start)}-${format(longWeekend.end)}*`;
      await bot.telegram.sendMessage(mainChannel, content, { parse_mode: 'Markdown' });
    }
  }),
};

export default crontab;
