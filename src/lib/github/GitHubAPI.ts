import { AxiosInstance } from 'axios';
import { GitHubIssue } from './types';

export default class GitHubAPI {
  constructor(private httpClient: AxiosInstance) {}

  async getIssues(state = 'open') {
    const response = await this.httpClient.get<GitHubIssue[]>(`/issues`, { params: { state } });
    return response.data;
  }

  async setIssue(title: string, body: string) {
    const response = await this.httpClient.post<GitHubIssue>(`/issues`, { title, body });
    return response.data;
  }
}
