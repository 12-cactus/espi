import axios from 'axios';
import * as fns from 'date-fns';
import { Context } from 'telegraf';

import { apis, apisCA } from '../config';

export type HolidayAR = {
  id: string;
  dia: number;
  mes: number;
  motivo: string;
  tipo: string;
  info: string;
  opcional?: string | null;
  religion?: string | null;
  origen?: string | null;
  original?: string | null;
};

type ParsedHolidayAR = HolidayAR & { date: Date };

export type HolidayCA = {
  date: string;
  nameFr: string;
};

type LongWeekendDate = {
  start: Date,
  end: Date
};

const today = () => new Date();
const currentYear = () => today().getFullYear();
const nextYear = () => currentYear() + 1;

const isAfterToday = (holiday: HolidayAR) => fns.isAfter(
  fns.parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today()),
  today(),
);

const isAfterTodayCA = (holiday: HolidayCA) => fns.isAfter(new Date(holiday.date), today());

const isProperHoliday = (holiday: HolidayAR) => {
  const isNonWorking = ['inamovible', 'puente', 'trasladable'].includes(holiday.tipo);
  const isCristian = holiday.tipo === 'nolaborable'
                  && holiday.opcional === 'religion'
                  && holiday.religion === 'cristianismo';
  return isNonWorking || isCristian;
};

const toStringItem = (holiday: HolidayAR) => {
  const date = fns.parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today());
  const diff = fns.differenceInDays(date, today());
  return `- *${fns.format(date, 'dd MMM')}* ${holiday.motivo} (${diff}d)`;
};

const toStringItemCA = (holiday: HolidayCA) => {
  const date = new Date(holiday.date);
  const diff = fns.differenceInDays(date, today());
  return `- *${fns.format(date, 'dd MMM')}* ${holiday.nameFr} (${diff}d)`;
};

const fetchHolidaysAR = async (year: number) => {
  const { data } = await axios.get(apis.holidays.replace('{year}', `${year}`));
  return data
    .filter(isAfterToday)
    .filter(isProperHoliday)
    .map((holiday: HolidayAR) => ({ ...holiday, date: new Date(year, holiday.mes - 1, holiday.dia) }));
};

function isRestingDay(date: Date, holidays: ParsedHolidayAR[]) {
  return fns.isWeekend(date) || holidays.some(holiday => fns.isSameDay(holiday.date, date));
}

/**
 * Find Next Long Weekend
 * Recursive function over holidays array
 */
function findNextLongWeekendBasedOn(holidays: ParsedHolidayAR[]): LongWeekendDate {
  if (holidays.length === 0) return { start: new Date(), end: new Date() };
  const [nextHoliday, ...restHolidays] = holidays;

  const groupDays = [nextHoliday.date];
  let prevDate = fns.subDays(nextHoliday.date, 1);
  while (isRestingDay(prevDate, holidays)) {
    groupDays.unshift(prevDate);
    prevDate = fns.subDays(prevDate, 1);
  }

  let nextDate = fns.addDays(nextHoliday.date, 1);
  while (isRestingDay(nextDate, holidays)) {
    groupDays.push(nextDate);
    nextDate = fns.addDays(nextDate, 1);
  }

  const result: LongWeekendDate = groupDays.length > 2
    ? { start: groupDays[0], end: groupDays[groupDays.length - 1] }
    : findNextLongWeekendBasedOn(restHolidays);

  return result;
}

// ----- ----- Exported Functions ----- -----

/**
 * Holidays AR
 */
const holidaysAR = async (ctx: Context) => {
  const [resThisYear, resNextYear] = await Promise.all([
    axios.get(apis.holidays.replace('{year}', `${currentYear()}`)),
    axios.get(apis.holidays.replace('{year}', `${nextYear()}`)),
  ]);

  const data = [...resThisYear.data, ...resNextYear.data];
  const days = data
    .filter(isAfterToday)
    .filter(isProperHoliday)
    .map(toStringItem)
    .slice(0, 7);

  ctx.replyWithMarkdown(`🇦🇷 Próximos Feriados\n\n${days.join('\n')}`);
};

const findNextLongWeekendAR = async () => {
  const holidays = (await Promise.all([
    fetchHolidaysAR(currentYear()),
    fetchHolidaysAR(nextYear()),
  ])).flat();

  return findNextLongWeekendBasedOn(holidays);
};

/**
 * Next Long Weekend AR
 */
const nextLongWeekendAR = async (ctx: Context) => {
  const longWeekend = await findNextLongWeekendAR();
  const diffDays = fns.differenceInDays(longWeekend.start, new Date());
  const format = (date: Date) => fns.format(date, 'dd MMM');
  const content = longWeekend
    ? `Próximo finde largo: *${format(longWeekend.start)}-${format(longWeekend.end)} *Faltan: ${diffDays} días`
    : 'No encontré ningún finde largo 🪦';
  ctx.replyWithMarkdown(content);
};

/**
 * Holidays CA
 */
const holidaysCA = async (ctx: Context) => {
  const [resThisYear, resNextYear] = await Promise.all([
    axios.get(apisCA.holidays.replace('{year}', `${currentYear()}`)),
    axios.get(apisCA.holidays.replace('{year}', `${nextYear()}`)),
  ]);

  const data = [...resThisYear.data.province.holidays, ...resNextYear.data.province.holidays];
  const days = data
    .filter(isAfterTodayCA)
    .map(toStringItemCA)
    .slice(0, 7);
  const content = `🇨🇦 Prochaines Férié\n\n${days.join('\n')}`;
  ctx.replyWithMarkdown(content);
};

const Holidays = {
  holidaysAR,
  holidaysCA,
  nextLongWeekendAR,
  findNextLongWeekendAR,
};

export default Holidays;
