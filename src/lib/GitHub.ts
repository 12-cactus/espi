import { GitHubAPI } from './api';
import { GitHubIssue } from './github.types';

export default class GitHub {
  static async getIssues(state = 'open') {
    const response = await GitHubAPI.get<GitHubIssue[]>(`/issues`, { params: { state } });
    return response.data;
  }
}
