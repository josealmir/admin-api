import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/app-error';

export function errorHandler(
  error: FastifyError | AppError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.message,
    });
  }

  const err = error as unknown as Record<string, unknown>;
  const code =
    'statusCode' in error && typeof err.statusCode === 'number' ? (err.statusCode as number) : 500;

  return reply.status(code).send({
    statusCode: code,
    error: error.message || 'Internal Server Error',
  });
}
