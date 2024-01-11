const toNumber = (value: string) => Number.parseInt(value, 10);

export const apis = {
  holidays: 'https://nolaborables.com.ar/api/v2/feriados/{year}?incluir=opcional',
};

export const apisCA = {
  holidays: 'https://canada-holidays.ca/api/v1/provinces/QC?year={year}',
};

export const mainChannel = toNumber(process.env.MAIN_CHANNEL || '-1');

export const ownerChannel = toNumber(process.env.OWNER_CHANNEL || '-1');

export const aiChannels = (process.env.AI_CHANNELS ?? `${mainChannel}`).split(',').map(toNumber) || [];

export const espiId = toNumber(process.env.BOT_TOKEN?.split(':')[0] || '-1');

export const openAI = {
  apiKey: process.env.OPENAI_API_KEY,
  defaultOptions: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  },
};

const config = {
  aiChannels,
  apis,
  apisCA,
  espiId,
  mainChannel,
  openAI,
};

export default config;
