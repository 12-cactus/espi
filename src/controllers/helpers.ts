import dayjs from 'dayjs';
import { InfoDay } from '../core/long-weekend';

/**
 * This file contains helper functions that are used in the controllers.
 */

/**
 * Escape markdown special characters from a text.
 * Chars replaced: - | . ( )
 * Example: `markdownEscape('Hello (world)')` => `Hello \(world\)`.
 */
export const markdownEscape = (text: string) => {
  return text
    .replaceAll('-', '\\-')
    .replaceAll('|', '\\|')
    .replaceAll('.', '\\.')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)')
    .replaceAll('+', '\\+');
};

/**
 * Convert a InfoDay to a string.
 * Format `*DD MMM* Name (Xd)`.
 * Example `*01 Jan* New Year (1d)`.
 */
export const toMarkdownDay = (day: InfoDay, fromDay = dayjs()) => {
  const diff = day.date.diff(fromDay, 'day');
  return `- *${day.date.format('DD MMM')}* ${day.name} (${diff}d)`;
};
