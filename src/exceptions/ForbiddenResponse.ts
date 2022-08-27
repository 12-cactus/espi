import ApiError from './ApiError';

export default class ForbiddenResponse extends ApiError {
  constructor(message: string, errors: string[] = []) {
    super(message, 403, errors);
  }
}
