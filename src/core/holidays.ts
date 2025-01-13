import axios from 'axios';
import * as fns from 'date-fns';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { Context } from 'telegraf';
import { apis, apisCA } from '../config';
import { DayType, InfoDay, LongWeekend, longWeekendMap } from './long-weekend';

dayjs.extend(isSameOrAfter);

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

export type HolidayCA = {
  date: string;
  nameFr: string;
};

const today = () => new Date();
const currentYear = () => today().getFullYear();
const nextYear = () => currentYear() + 1;

function markdownEscape(text: string): string {
  return text
    .replaceAll('-', '\\-')
    .replaceAll('|', '\\|')
    .replaceAll('.', '\\.')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');
}

const isAfterTodayCA = (holiday: HolidayCA) => fns.isAfter(new Date(holiday.date), today());

const toStringItemCA = (holiday: HolidayCA) => {
  const date = new Date(holiday.date);
  const diff = fns.differenceInDays(date, today());
  return `- *${fns.format(date, 'dd MMM')}* ${holiday.nameFr} (${diff}d)`;
};

const isNationalHoliday = (h: HolidayAR) => {
  const isHoliday = ['inamovible', 'trasladable'].includes(h.tipo);
  const isCristian = h.tipo === 'nolaborable' && h.opcional === 'religion' && h.religion === 'cristianismo';
  return isHoliday || isCristian;
};

const mapTypeDay = (h: HolidayAR): DayType => {
  if (h.tipo === 'puente') return 'touristic-bridge';
  if (isNationalHoliday(h)) return 'national-holiday';
  return 'unknown';
};

const mapWithYear = (h: HolidayAR, year: number): InfoDay => {
  const month = h.mes.toString().padStart(2, '0');
  const day = h.dia.toString().padStart(2, '0');
  const type = mapTypeDay(h);
  return {
    name: h.motivo,
    date: dayjs(`${year}-${month}-${day}`),
    isoDate: `${year}-${month}-${day}`,
    type,
    isRestingDay: type === 'national-holiday' || type === 'touristic-bridge',
  };
};

const fetchNextHolidaysAR = async () => {
  const thisYear = currentYear();
  const [thisYearData, nextYearData] = await Promise.all([
    axios.get(apis.holidays.replace('{year}', `${thisYear}`)),
    axios.get(apis.holidays.replace('{year}', `${thisYear + 1}`)),
  ]);

  const thisYearHolidays: InfoDay[] = thisYearData.data.map((h: HolidayAR) => mapWithYear(h, thisYear));
  const nextYearHolidays: InfoDay[] = nextYearData.data.map((h: HolidayAR) => mapWithYear(h, thisYear + 1));

  return [...thisYearHolidays, ...nextYearHolidays].filter(t => t.date.isSameOrAfter(dayjs(), 'day') && t.isRestingDay);
};

// ----- ----- Exported Functions ----- -----

const findNextLongWeekendsAR = async (): Promise<LongWeekend[]> => {
  const holidays = await fetchNextHolidaysAR();
  return longWeekendMap(holidays);
};

/**
 * Next Long Weekend AR
 */
const nextLongWeekendAR = async (ctx: Context) => {
  const nextLongWeekends = await findNextLongWeekendsAR();
  const longWeekend = nextLongWeekends[0];
  const daysLeft = longWeekend.start.diff(dayjs(), 'day');
  const format = (date: Dayjs) => date.format('ddd DD/MMM');
  const range = `${format(longWeekend.start)} -- ${format(longWeekend.end)}`;
  const content = longWeekend
    ? `_Próximo finde largo_\n\n📌 *${longWeekend.name}*\n📆 ${range}\n⏳ faltan ${daysLeft} días`
    : 'No encontré ningún finde largo 🪦';
  ctx.replyWithMarkdownV2(markdownEscape(content));
};

/**
 * Next Three Long Weekends AR
 */
const nextThreeLongWeekendsAR = async (ctx: Context) => {
  const nextLongWeekends = await findNextLongWeekendsAR();
  const longWeekends = nextLongWeekends.slice(0, 3);
  const formatLongWeekend = (lw: LongWeekend) => {
    const daysLeft = (day: Dayjs) => day.diff(dayjs(), 'day');
    const range = `${lw.start.format('DD MMM')}-${lw.end.format('DD MMM')}`;
    return ` - *${range}* ${lw.name} (${daysLeft(lw.start)}d)`;
  };
  const content =
    longWeekends.length > 0
      ? `🏝 _Próximos 3 findes largos_\n\n${longWeekends.map(lw => formatLongWeekend(lw)).join('\n')}`
      : 'No encontré ningún finde largo 🪦';
  ctx.replyWithMarkdownV2(markdownEscape(content));
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
  const days = data.filter(isAfterTodayCA).map(toStringItemCA).slice(0, 7);
  const content = `🇨🇦 Prochaines Férié\n\n${days.join('\n')}`;
  ctx.replyWithMarkdownV2(markdownEscape(content));
};

const Holidays = {
  holidaysCA,
  nextLongWeekendAR,
  nextThreeLongWeekendsAR,
  findNextLongWeekendsAR,
};

export default Holidays;
