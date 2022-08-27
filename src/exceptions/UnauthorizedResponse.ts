import ApiError from './ApiError';

export default class UnauthorizedResponse extends ApiError {
  constructor(message: string, errors: string[] = []) {
    super(message, 401, errors);
  }
}
