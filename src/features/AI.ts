import fs from 'fs';

import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';

import { openAI } from '../config';

const openai = new OpenAI({ apiKey: openAI.apiKey });

export default class AI {
  static async ask(question: string, context?: ChatCompletionMessageParam) {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'Sus un bot de Telegram llamado Espi. Estás en el grupo "12 Cactus".' },
    ];
    if (context) messages.push(context);
    messages.push({ role: 'user', content: question });

    const response = await openai.chat.completions.create({
      ...openAI.defaultOptions,
      messages,
    });

    const answer = response.choices[0].message?.content || '';
    return answer || 'Ups... no se que decirte';
  }

  static async transcript(filename: string) {
    try {
      const file = fs.createReadStream(filename);
      const transcript = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'es',
      });
      return transcript.text;
    } catch (error) {
      const err = error as Error;
      return err?.message || 'Something went wrong while transcribing audio...';
    }
  }
}
