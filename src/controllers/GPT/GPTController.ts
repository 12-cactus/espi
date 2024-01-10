import fs from 'fs';

import { ChatCompletionMessageParam } from 'openai/resources';
import { Message } from 'telegraf/typings/core/types/typegram';

import { TextMatchedContext, TranscriptContext } from './types';
import { espiId } from '../../config';
import GPT from '../../core/GPT';
import api from '../../lib/api';
import { showTypingAction } from '../helpers';

export default class GPTController {
  /**
   * Handle incoming question asking to ChatGPT API
   */
  static async handleQuestion(ctx: TextMatchedContext) {
    showTypingAction(ctx);
    const question = (ctx.match?.groups?.question || '').trim();
    if (question.length < 7) {
      ctx.reply('Muy cortito amigo');
      return;
    }

    const reply = ctx.message.reply_to_message as Message.TextMessage;
    const contextText = reply?.text || '';
    const contextRole = reply?.from?.id === espiId ? 'system' : 'user';
    const context: ChatCompletionMessageParam | undefined = contextText
      ? { role: contextRole, content: contextText }
      : undefined;
    const answer = await GPT.ask(question, context);
    ctx.reply(answer);
  }

  static async transcriptAudio(ctx: TranscriptContext) {
    // TODO:
    // - Filtering by voice duration/size

    showTypingAction(ctx);
    const voice = ctx.message?.voice;
    const tmpFile = `./voice-${ctx.message?.message_id}.mp3`;
    const link = await ctx.telegram.getFileLink(voice.file_id);
    const res = await api.get(link.href, { responseType: 'arraybuffer' });
    await fs.promises.writeFile(tmpFile, res.data);
    const transcription = await GPT.transcript(tmpFile);
    ctx.reply(transcription);
    await fs.promises.rm(tmpFile);
  }
}
