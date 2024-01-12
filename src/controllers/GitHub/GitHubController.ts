import GitHub from '../../lib/GitHub';
import logger from '../../lib/logger';
import BaseController from '../BaseController';
import { BaseContext } from '../types';

export default class GitHubController extends BaseController {
  static async listIssues(ctx: BaseContext) {
    this.showTypingAction(ctx);
    try {
      const issues = await GitHub.getIssues();
      const issuesList = issues.map(issue => `\\- [\\#${issue.number}](${issue.url}) ${issue.title}`).join('\n');
      ctx.replyWithMarkdownV2(`*Issues Abiertos*\n\n${issuesList}`, { disable_web_page_preview: true });
    } catch (error) {
      logger.error(error);
      ctx.reply('Hubo un error al obtener los issues');
    }
  }
}
