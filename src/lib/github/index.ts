import { GitHubClient } from '../http-clients';
import GitHubAPI from './GitHubAPI';

const github = new GitHubAPI(GitHubClient);

export default github;
