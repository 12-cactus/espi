import axios from 'axios';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { apis, apisCA } from '../config';
import { asInfoDayAR, asInfoDayCA } from '../helpers/holidays.helper';
import logger from '../lib/logger';
import { InfoDay } from './long-weekend';
import { HolidayResponseAR, HolidayResponseCA } from './types';

dayjs.extend(isSameOrAfter);

/**
 * Class related to getting holidays.
 */
export default class Holidays {
  private static readonly REQUEST_TIMEOUT = 5000; // 5 seconds

  static async fetchNextHolidaysAR(dayFrom = dayjs(), amount = 7) {
    try {
      const year = dayFrom.year();
      const [thisYearData, nextYearData] = await Promise.all<HolidayResponseAR>([
        axios.get(apis.holidays.replace('{year}', `${year}`), { timeout: this.REQUEST_TIMEOUT }),
        axios.get(apis.holidays.replace('{year}', `${year + 1}`), { timeout: this.REQUEST_TIMEOUT }),
      ]);

      const thisYearHolidays: InfoDay[] = thisYearData.data.map(holiday => asInfoDayAR(holiday, year));
      const nextYearHolidays: InfoDay[] = nextYearData.data.map(holiday => asInfoDayAR(holiday, year + 1));

      const holidays = [...thisYearHolidays, ...nextYearHolidays]
        .filter(t => t.date.isSameOrAfter(dayFrom, 'day') && t.isRestingDay)
        .slice(0, amount);

      return holidays;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`[Holidays] Failed to fetch AR holidays: ${errorMsg}`);
      return [];
    }
  }

  static async fetchNextHolidaysCA(dayFrom = dayjs(), amount = 7) {
    try {
      const year = dayFrom.year();
      const [thisYearData, nextYearData] = await Promise.all<HolidayResponseCA>([
        axios.get(apisCA.holidays.replace('{year}', `${year}`), { timeout: this.REQUEST_TIMEOUT }),
        axios.get(apisCA.holidays.replace('{year}', `${year + 1}`), { timeout: this.REQUEST_TIMEOUT }),
      ]);

      const thisYearHolidays: InfoDay[] = thisYearData.data.province.holidays.map(holiday => asInfoDayCA(holiday));
      const nextYearHolidays: InfoDay[] = nextYearData.data.province.holidays.map(holiday => asInfoDayCA(holiday));

      const holidays = [...thisYearHolidays, ...nextYearHolidays]
        .filter(t => t.date.isSameOrAfter(dayFrom, 'day') && t.isRestingDay)
        .slice(0, amount);

      return holidays;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`[Holidays] Failed to fetch CA holidays: ${errorMsg}`);
      return [];
    }
  }
}
