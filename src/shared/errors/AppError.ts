export interface IAppError {
  statusCode: number;
  errors?: unknown;
}

export class AppError extends Error implements IAppError {
  public readonly statusCode: number;
  public readonly errors?: unknown;

  constructor(message: string, statusCode = 400, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}