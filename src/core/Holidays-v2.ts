import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { apis } from '../config';
import { asInfoDay } from '../helpers/holidays.helper';
import { InfoDay } from './long-weekend';
import { HolidayResponse } from './types';

dayjs.extend(isSameOrAfter);

export default class Holidays {
  static async fetchNextHolidaysAR(dayFrom = dayjs(), amount = 7) {
    const year = dayFrom.year();
    const [thisYearData, nextYearData] = await Promise.all<HolidayResponse>([
      axios.get(apis.holidays.replace('{year}', `${year}`)),
      axios.get(apis.holidays.replace('{year}', `${year + 1}`)),
    ]);

    const thisYearHolidays: InfoDay[] = thisYearData.data.map(holiday => asInfoDay(holiday, year));
    const nextYearHolidays: InfoDay[] = nextYearData.data.map(holiday => asInfoDay(holiday, year + 1));

    const holidays = [...thisYearHolidays, ...nextYearHolidays]
      .filter(t => t.date.isSameOrAfter(dayFrom, 'day') && t.isRestingDay)
      .slice(0, amount);

    return holidays;
  }
}
