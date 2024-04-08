import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { apis, apisCA } from '../config';
import { asInfoDayAR, asInfoDayCA } from '../helpers/holidays.helper';
import { InfoDay } from './long-weekend';
import { HolidayResponseAR, HolidayResponseCA } from './types';

dayjs.extend(isSameOrAfter);

export default class Holidays {
  static async fetchNextHolidaysAR(dayFrom = dayjs(), amount = 7) {
    const year = dayFrom.year();
    const [thisYearData, nextYearData] = await Promise.all<HolidayResponseAR>([
      axios.get(apis.holidays.replace('{year}', `${year}`)),
      axios.get(apis.holidays.replace('{year}', `${year + 1}`)),
    ]);

    const thisYearHolidays: InfoDay[] = thisYearData.data.map(holiday => asInfoDayAR(holiday, year));
    const nextYearHolidays: InfoDay[] = nextYearData.data.map(holiday => asInfoDayAR(holiday, year + 1));

    const holidays = [...thisYearHolidays, ...nextYearHolidays]
      .filter(t => t.date.isSameOrAfter(dayFrom, 'day') && t.isRestingDay)
      .slice(0, amount);

    return holidays;
  }

  static async fetchNextHolidaysCA(dayFrom = dayjs(), amount = 7) {
    const year = dayFrom.year();
    const [thisYearData, nextYearData] = await Promise.all<HolidayResponseCA>([
      axios.get(apisCA.holidays.replace('{year}', `${year}`)),
      axios.get(apisCA.holidays.replace('{year}', `${year + 1}`)),
    ]);

    const thisYearHolidays: InfoDay[] = thisYearData.data.province.holidays.map(holiday => asInfoDayCA(holiday));
    const nextYearHolidays: InfoDay[] = nextYearData.data.province.holidays.map(holiday => asInfoDayCA(holiday));

    const holidays = [...thisYearHolidays, ...nextYearHolidays]
      .filter(t => t.date.isSameOrAfter(dayFrom, 'day') && t.isRestingDay)
      .slice(0, amount);

    return holidays;
  }

  // const data = [...resThisYear.data.province.holidays, ...resNextYear.data.province.holidays];
  // const days = data.filter(isAfterTodayCA).map(toStringItemCA).slice(0, 7);
  // const content = `🇨🇦 Prochaines Férié\n\n${days.join('\n')}`;
  // ctx.replyWithMarkdownV2(markdownEscape(content));
}
