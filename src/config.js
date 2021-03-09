const apis = {
  holidays: 'https://nolaborables.com.ar/api/v2/feriados/{year}?incluir=opcional',
};
const apisCA = {
  holidays: 'https://canada-holidays.ca/api/v1/provinces/QC?year={year}',
};

module.exports = { apis, apisCA };
