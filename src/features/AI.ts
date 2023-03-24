import { Configuration, OpenAIApi } from 'openai';
import config from '../config';

const configuration = new Configuration({ apiKey: config.openAI.apiKey });
const openai = new OpenAIApi(configuration);

const ask = async (question: string) => {
  const response = await openai.createCompletion({
    ...config.openAI.defaultOptions,
    prompt: question,
  });

  const answer = response.data.choices[0].text || '';
  return answer || 'Ups... no se que decirte';
};

const AI = { ask };

export default AI;
