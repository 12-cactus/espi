const axios = require('axios').default;
const differenceInDays = require('date-fns/differenceInDays');
const isAfter = require('date-fns/isAfter');
const format = require('date-fns/format');
const parse = require('date-fns/parse');
const { apis, apisCA } = require('../config');

const today = () => new Date();

const isAfterToday = holiday => isAfter(parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today()), today());

const isAfterTodayCA = holiday => isAfter(new Date(holiday.date), today());

const isProperHoliday = (holiday) => {
  const isNonWorking = ['inamovible', 'puente', 'trasladable'].includes(holiday.tipo);
  const isCristian = holiday.tipo === 'nolaborable'
                  && holiday.opcional === 'religion'
                  && holiday.religion === 'cristianismo';
  return isNonWorking || isCristian;
};

const toStringItem = (holiday) => {
  const date = parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today());
  const diff = differenceInDays(date, today());
  return `- *${format(date, 'dd MMM')}* ${holiday.motivo} (${diff}d)`;
};

const toStringItemCA = (holiday) => {
  const date = new Date(holiday.date);
  const diff = differenceInDays(date, today());
  return `- *${format(date, 'dd MMM')}* ${holiday.nameFr} (${diff}d)`;
};

// ----- ----- Exported Functions ----- -----

/**
 * Example
 *
 * "motivo": "Año Nuevo",
 * "tipo": "inamovible",
 * "info": "https://es.wikipedia.org/wiki/A%C3%B1o_Nuevo",
 * "dia": 1,
 * "mes": 1,
 * "id": "año-nuevo"
 */
const holidaysAR = async (ctx) => {
  const thisYear = today().getFullYear();
  const nextYear = thisYear + 1;
  const [resThisYear, resNextYear] = await Promise.all([
    axios.get(apis.holidays.replace('{year}', thisYear)),
    axios.get(apis.holidays.replace('{year}', nextYear)),
  ]);

  const data = [...resThisYear.data, ...resNextYear.data];
  const days = data
    .filter(isAfterToday)
    .filter(isProperHoliday)
    .map(toStringItem)
    .slice(0, 7);

  ctx.replyWithMarkdown(`🇦🇷 Próximos Feriados\n\n${days.join('\n')}`);
};

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
const holidaysCA = async (ctx) => {
  const thisYear = today().getFullYear();
  const nextYear = thisYear + 1;
  const [resThisYear, resNextYear] = await Promise.all([
    axios.get(apisCA.holidays.replace('{year}', thisYear)),
    axios.get(apisCA.holidays.replace('{year}', nextYear)),
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
};
