import { Request, Response, NextFunction } from 'express';

interface ErrorObject {
  type: string,
  message: string
}

// Error but with one more property code
export class HttpError extends Error {
  constructor(public errors: Array<ErrorObject>, public statusCode: number) {
    super();
    this.errors = errors;
    this.statusCode = statusCode;
  }
}

// Error Handler Middleware for all routes
export function errorHandler(err: HttpError, req: Request, res: Response, next: NextFunction) {
  // in production, you may not want to log error to console
  console.log(err);

  res.status(err.statusCode).json({ error: err.errors });
}