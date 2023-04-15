const toNumber = (value: string) => Number.parseInt(value, 10);

export const apis = {
  holidays: 'https://nolaborables.com.ar/api/v2/feriados/{year}?incluir=opcional',
};

export const apisCA = {
  holidays: 'https://canada-holidays.ca/api/v1/provinces/QC?year={year}',
};

export const mainChannel = toNumber(process.env.MAIN_CHANNEL || '-1');

export const aiChannels = (process.env.AI_CHANNELS ?? `${mainChannel}`).split(',').map(toNumber) || [];

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
  aiChannels,
  openAI,
};

export default config;
