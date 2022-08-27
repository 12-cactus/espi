import ApiError from './ApiError';

export default class BadRequestResponse extends ApiError {
  constructor(message: string, errors: string[] = []) {
    super(message, 400, errors);
  }
}
