export const apis = {
  holidays: 'https://nolaborables.com.ar/api/v2/feriados/{year}?incluir=opcional',
};

export const apisCA = {
  holidays: 'https://canada-holidays.ca/api/v1/provinces/QC?year={year}',
};

const config = { apis, apisCA };

export default config;
