/* eslint-disable max-classes-per-file */
class ApiError extends Error {
  constructor(message, status = 400, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

class BadRequestResponse extends ApiError {
  constructor(message, errors = []) {
    super(message, 400, errors);
  }
}

class ForbiddenResponse extends ApiError {
  constructor(message, errors = []) {
    super(message, 403, errors);
  }
}

class UnauthorizedResponse extends ApiError {
  constructor(message, errors = []) {
    super(message, 401, errors);
  }
}

module.exports = {
  ApiError,
  BadRequestResponse,
  ForbiddenResponse,
  UnauthorizedResponse,
};
