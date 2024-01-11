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

    const response = await openai.chat.completions.create({
      ...openAI.defaultOptions,
      messages,
    });

    const answer = response.choices[0].message?.content || '';
    return answer || 'Ups... no se que decirte';
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
