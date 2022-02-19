const axios = require('axios').default;
const differenceInDays = require('date-fns/differenceInDays');
const isAfter = require('date-fns/isAfter');
const format = require('date-fns/format');
const { apisCA } = require('../config');

const today = () => new Date();

const isAfterTodayCa = holiday => isAfter(new Date(holiday.date), today());

const toStringItem = (holiday) => {
  const date = new Date(holiday.date);
  const diff = differenceInDays(date, today());
  return `- *${format(date, 'dd MMM')}* ${holiday.nameFr} (${diff}d)`;
};
// ----- ----- Exported Functions ----- -----

/**
 * Example
 *
 * "nameEn": "New Year's Day",
 * "nameFr": "Jour de l'An",
 * "date": "2021-01-01",
 * "federal": 1,
 * "observedDate": "2021-01-01",
 * "id": 1
 */
const holidaysCa = async (ctx) => {
  const thisYear = today().getFullYear();
  const nextYear = thisYear + 1;
  const [resThisYear, resNextYear] = await Promise.all([
    axios.get(apisCA.holidays.replace('{year}', thisYear)),
    axios.get(apisCA.holidays.replace('{year}', nextYear)),
  ]);

  const data = [...resThisYear.data.province.holidays, ...resNextYear.data.province.holidays];
  const days = data
    .filter(isAfterTodayCa)
    .map(toStringItem)
    .slice(0, 7);
  const content = `🇨🇦 Vous étes paresseux, *il reste ${days.length} jours férié* en tout la année.\n\n${days.join('\n')}`;
  ctx.replyWithMarkdown(content);
};

module.exports = holidaysCa;
