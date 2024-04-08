import dayjs from 'dayjs';
import Holidays from '../core/Holidays-v2';
import { InfoDay } from '../core/long-weekend';
import BaseController from './BaseController';
import { markdownEscape, toMarkdownDay } from './helpers';
import { BaseContext } from './types';

/**
 * Type for functions that fetch holidays.
 */
type FetchFn = (dayFrom: dayjs.Dayjs, amount?: number) => Promise<InfoDay[]>;

/**
 * Controller for fetching and showing holidays.
 */
export default class HolidaysController extends BaseController {
  /**
   * Fetch and show the next holidays for Argentina.
   */
  static async holidaysAR(ctx: BaseContext) {
    return this.holidaysUsing(ctx, Holidays.fetchNextHolidaysAR, '🇦🇷 Próximos Feriados');
  }

  /**
   * Fetch and show the next holidays for Canada.
   */
  static async holidaysCA(ctx: BaseContext) {
    return this.holidaysUsing(ctx, Holidays.fetchNextHolidaysCA, '🇨🇦 Prochaines Férié');
  }

  /**
   * Fetch and show the next holidays for a country.
   * It requires a fetching function and a title.
   */
  private static async holidaysUsing(ctx: BaseContext, fetchFn: FetchFn, title: string) {
    this.showTypingAction(ctx);
    const today = dayjs();

    const holidays = await fetchFn(today);
    const days = holidays.map(infoDay => toMarkdownDay(infoDay));
    const content = `${title}\n\n${days.join('\n')}`;

    ctx.replyWithMarkdownV2(markdownEscape(content));
  }
}
