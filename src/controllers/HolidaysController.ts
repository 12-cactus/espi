import dayjs from 'dayjs';
import Holidays from '../core/Holidays-v2';
import BaseController from './BaseController';
import { markdownEscape, toMarkdownDay } from './helpers';
import { BaseContext } from './types';

export default class HolidaysController extends BaseController {
  static async holidaysAR(ctx: BaseContext) {
    this.showTypingAction(ctx);
    const today = dayjs();

    const holidays = await Holidays.fetchNextHolidaysAR(today);
    const days = holidays.map(infoDay => toMarkdownDay(infoDay));
    const content = `🇦🇷 Próximos Feriados\n\n${days.join('\n')}`;

    ctx.replyWithMarkdownV2(markdownEscape(content));
  }

  static async holidaysCA(ctx: BaseContext) {
    this.showTypingAction(ctx);
    const today = dayjs();

    const holidays = await Holidays.fetchNextHolidaysCA(today);
    const days = holidays.map(infoDay => toMarkdownDay(infoDay));
    const content = `🇨🇦 Prochaines Férié\n\n${days.join('\n')}`;

    ctx.replyWithMarkdownV2(markdownEscape(content));
  }
}
