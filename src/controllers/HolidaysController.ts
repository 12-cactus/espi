import dayjs from 'dayjs';
import Holidays from '../core/Holidays-v2';
import { InfoDay } from '../core/long-weekend';
import BaseController from './BaseController';
import { BaseContext } from './types';

/**
 * Convert a InfoDay to a string.
 * Format `*DD MMM* Name (Xd)`.
 * Example `*01 Jan* New Year (1d)`.
 * TODO move it to a helper file and test it
 */
const toStringItem = (day: InfoDay) => {
  const diff = day.date.diff(dayjs(), 'day');
  return `- *${day.date.format('DD MMM')}* ${day.name} (${diff}d)`;
};

/**
 * Escape markdown special characters from a text.
 * Chars replaced: - | . ( )
 * Example: `markdownEscape('Hello (world)')` => `Hello \(world\)`.
 */
function markdownEscape(text: string): string {
  return text
    .replaceAll('-', '\\-')
    .replaceAll('|', '\\|')
    .replaceAll('.', '\\.')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

export default class HolidaysController extends BaseController {
  static async holidaysAR(ctx: BaseContext) {
    this.showTypingAction(ctx);
    const today = dayjs();

    const holidays = await Holidays.fetchNextHolidaysAR(today);
    const days = holidays.map(h => toStringItem(h)).slice(0, 7);

    ctx.replyWithMarkdownV2(markdownEscape(`🇦🇷 Próximos Feriados\n\n${days.join('\n')}`));
  }
}
