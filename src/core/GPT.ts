import fs from 'fs';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { openAI } from '../config';
import logger from '../lib/logger';

/**
 * Wrapper for OpenAI API
 * @see https://platform.openai.com/docs/api-reference
 */
const openai = new OpenAI({ apiKey: openAI.apiKey });

/**
 * Wrapper class for ChatGPT API
 */
export default class GPT {
  /**
   * Ask a question to ChatGPT API
   * @param question Question to ask
   * @param context Context to provide to the API
   * @returns Answer from the API
   */
  static async ask(question: string, context?: ChatCompletionMessageParam) {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'Sus un bot de Telegram llamado Espi. Estás en el grupo "12 Cactus".' },
    ];
    if (context) messages.push(context);
    messages.push({ role: 'user', content: question });

    const response = await openai.chat.completions.create({ ...openAI.defaultOptions, messages });
    const answer = response.choices[0].message?.content || '';
    return answer || 'Ups... no se que decirte';
  }

  /**
   * Ask to create an issue in GitHub
   * @param title Issue title
   * @param description Issue description
   * @returns Answer from the API
   */
  static async issueDescription(title: string, description?: string) {
    const titleContent = `Este es el título que proveyó el usuario: "${title}"`;
    const descriptionContent = description
      ? `El usuario proveyó esta descripción corta: "${description}". Usala como referencia`
      : 'No hay descripción';
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: 'Sos un Project Manager que se encarga de crear issues en un proyecto en GitHub.' },
      {
        role: 'system',
        content: 'El proyecto es un bot de telegram escrito en TypeScript + NodeJS + Telegraf (Telegram Client)',
      },
      {
        role: 'user',
        content: `Necesito crear un issue y necesito que me proveas de una solamente la descripción en formato Markdown.`,
      },
      { role: 'user', content: titleContent },
      { role: 'user', content: descriptionContent },
    ];

    const response = await openai.chat.completions.create({ ...openAI.defaultOptions, messages });
    const answer = response.choices[0].message?.content || '';
    if (!answer) throw new Error('No answer from ChatGPT API');

    const mdContent = answer.match(/```(md)?\n(?<md>(.|\n)+)```/)?.groups?.md || answer;
    return mdContent;
  }

  /**
   * Transcribe an audio file
   * @param buffer Audio file buffer
   * @param messageId Message ID to use as filename
   * @returns Transcription
   */
  static async transcript(buffer: Uint8Array, messageId = 42) {
    const filename = `./voice-${messageId}.mp3`;
    try {
      await fs.promises.writeFile(filename, buffer);
      const file = fs.createReadStream(filename);
      const transcript = await openai.audio.transcriptions.create({
        file,
        model: 'whisper-1',
        language: 'es',
      });
      return transcript.text;
    } catch (error: any) {
      logger.error(error, { filename });
      return 'Hubo un problema desconocido al transcribir el audio...';
    } finally {
      await fs.promises.rm(filename, { force: true });
    }
  }
}
