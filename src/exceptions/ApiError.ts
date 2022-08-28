export default class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(message: string, status = 400, errors: string[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}
