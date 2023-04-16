import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import config from '../config';

const configuration = new Configuration({ apiKey: config.openAI.apiKey });
const openai = new OpenAIApi(configuration);

const ask = async (question: string, context?: ChatCompletionRequestMessage) => {
  const messages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: 'Sus un bot de Telegram llamado Espi. Estás en el grupo "12 Cactus".' },
  ];
  if (context) messages.push(context);
  messages.push({ role: 'user', content: question });

  const response = await openai.createChatCompletion({
    ...config.openAI.defaultOptions,
    messages,
  });

  const answer = response.data.choices[0].message?.content || '';
  return answer || 'Ups... no se que decirte';
};

const AI = { ask };

export default AI;
