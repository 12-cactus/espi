export const apis = {
  holidays: 'https://nolaborables.com.ar/api/v2/feriados/{year}?incluir=opcional',
};

export const apisCA = {
  holidays: 'https://canada-holidays.ca/api/v1/provinces/QC?year={year}',
};

export const mainChannel = Number.parseInt(process.env.MAIN_CHANNEL || '-1', 10);

export const openAI = {
  apiKey: process.env.OPENAI_API_KEY,
  defaultOptions: {
    model: 'text-davinci-003',
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
};

const config = {
  apis,
  apisCA,
  mainChannel,
  openAI,
};

export default config;
