const axios = require('axios').default;
const differenceInDays = require('date-fns/differenceInDays');
const isAfter = require('date-fns/isAfter');
const format = require('date-fns/format');
const parse = require('date-fns/parse');
const { apis } = require('../config');

const today = new Date();

const isAfterToday = holiday => isAfter(parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today), today);


const isProperHoliday = (holiday) => {
  const isNonWorking = ['inamovible', 'puente', 'trasladable'].includes(holiday.tipo);
  const isCristian = holiday.tipo === 'nolaborable'
                  && holiday.opcional === 'religion'
                  && holiday.religion === 'cristianismo';
  return isNonWorking || isCristian;
};

const toStringItem = (holiday) => {
  const date = parse(`${holiday.mes}-${holiday.dia}`, 'M-d', today);
  const diff = differenceInDays(date, today);

  return `- *${format(date, 'dd MMM')}* ${holiday.motivo} (${diff}d)`;
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
const holidays = async (ctx) => {
  const url = apis.holidays.replace('{year}', today.getFullYear());
  const { data } = await axios.get(url);
  const days = data
    .filter(isAfterToday)
    .filter(isProperHoliday)
    .map(toStringItem);

  const content = `Manga de vagos, *quedan ${days.length} feriados* en todo el año.\n\n${days.join('\n')}`;

  ctx.replyWithMarkdown(content);
};




module.exports = holidays;
