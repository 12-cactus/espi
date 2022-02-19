const axios = require('axios').default;
const fns = require('date-fns');

const { apis, apisCA } = require('../config');

const today = () => new Date();
const currentYear = () => today().getFullYear();
const nextYear = () => currentYear() + 1;

const isAfterToday = holiday => fns.isAfter(fns.parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today()), today());

const isAfterTodayCA = holiday => fns.isAfter(new Date(holiday.date), today());

const isProperHoliday = (holiday) => {
  const isNonWorking = ['inamovible', 'puente', 'trasladable'].includes(holiday.tipo);
  const isCristian = holiday.tipo === 'nolaborable'
                  && holiday.opcional === 'religion'
                  && holiday.religion === 'cristianismo';
  return isNonWorking || isCristian;
};

const toStringItem = (holiday) => {
  const date = fns.parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today());
  const diff = fns.differenceInDays(date, today());
  return `- *${fns.format(date, 'dd MMM')}* ${holiday.motivo} (${diff}d)`;
};

const toStringItemCA = (holiday) => {
  const date = new Date(holiday.date);
  const diff = fns.differenceInDays(date, today());
  return `- *${fns.format(date, 'dd MMM')}* ${holiday.nameFr} (${diff}d)`;
};

const fetchHolidaysAR = async (year) => {
  const { data } = await axios.get(apis.holidays.replace('{year}', year));
  return data
    .filter(isAfterToday)
    .filter(isProperHoliday)
    .map(holiday => ({ ...holiday, date: new Date(year, holiday.mes - 1, holiday.dia) }));
};

function isRestingDay(date, holidays) {
  return fns.isWeekend(date) || holidays.some(holiday => fns.isSameDay(holiday.date, date));
}

/**
 * Find Next Long Weekend
 * Recursive function over holidays array
 */
function findNextLongWeekendBasedOn(holidays) {
  if (holidays.length === 0) return null;
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

  return groupDays.length > 2
    ? { start: groupDays[0], end: groupDays[groupDays.length - 1] }
    : findNextLongWeekendBasedOn(restHolidays);
}

// ----- ----- Exported Functions ----- -----

/**
 * Holidays AR
 */
const holidaysAR = async (ctx) => {
  const [resThisYear, resNextYear] = await Promise.all([
    axios.get(apis.holidays.replace('{year}', currentYear())),
    axios.get(apis.holidays.replace('{year}', nextYear())),
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
const nextLongWeekendAR = async (ctx) => {
  const longWeekendFound = await findNextLongWeekendAR();

  const content = longWeekendFound
    ? `Próximo finde largo: *${fns.format(longWeekendFound.start, 'dd MMM')}-${fns.format(longWeekendFound.end, 'dd MMM')}*`
    : 'No encontré ningún finde largo 🪦';
  ctx.replyWithMarkdown(content);
};

/**
 * Holidays CA
 */
const holidaysCA = async (ctx) => {
  const [resThisYear, resNextYear] = await Promise.all([
    axios.get(apisCA.holidays.replace('{year}', currentYear())),
    axios.get(apisCA.holidays.replace('{year}', nextYear())),
  ]);

  const data = [...resThisYear.data.province.holidays, ...resNextYear.data.province.holidays];
  const days = data
    .filter(isAfterTodayCA)
    .map(toStringItemCA)
    .slice(0, 7);
  const content = `🇨🇦 Prochaines Férié\n\n${days.join('\n')}`;
  ctx.replyWithMarkdown(content);
};

module.exports = {
  holidaysAR,
  holidaysCA,
  nextLongWeekendAR,
  findNextLongWeekendAR,
};
