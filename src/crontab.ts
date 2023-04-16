import { CronJob } from 'cron';
import dayjs, { Dayjs } from 'dayjs';
import bot from './bot';
import Holidays from './features/holidays';
import Schedule from './features/schedule';

const Job = (cron: string, triggerFn: () => void) =>
  new CronJob(
    cron,
    () => {
      triggerFn();
    },
    null,
    true,
    'America/Argentina/Buenos_Aires'
  );

const mainChannel = process.env.MAIN_CHANNEL || 0;

const crontab = {
  schedule: Job('0 9 * * *', () => {
    Schedule.sendRegards(bot);
  }),

  holidays: Job('15 9 * * *', async () => {
    const nextLongWeekends = await Holidays.findNextLongWeekendsAR();
    if (nextLongWeekends.length === 0) return;

    const longWeekend = nextLongWeekends[0];
    const daysLeft = longWeekend.start.diff(dayjs(), 'day');
    const shouldSend = [1, 8, 15].includes(daysLeft);
    if (shouldSend) {
      const format = (date: Dayjs) => date.format('ddd DD/MMM');
      const range = `${format(longWeekend.start)} -- ${format(longWeekend.end)}`;
      const content = `_Próximo finde largo_\n\n📌 *${longWeekend.name}*\n📆 ${range}\n⏳ faltan ${daysLeft} días`;
      await bot.telegram.sendMessage(mainChannel, content, { parse_mode: 'Markdown' });
    }
  }),
};

export default crontab;
