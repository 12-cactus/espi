import { githubClient } from '../http-clients';
import GitHubAPI from './GitHubAPI';

const github = new GitHubAPI(githubClient);

export default github;
