import {
  defaultApiErrorCode,
  type ApiErrorBody,
  type ApiErrorCode,
  type ApiErrorDetail,
} from '@epis2/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';

interface SendApiErrorOptions {
  code?: ApiErrorCode;
  details?: ApiErrorDetail[];
}

/**
 * Emite el envelope de error compartido (MF-NORM-202): las rutas no construyen
 * `{ error }` ad-hoc. El `correlationId` sale del request id (x-correlation-id).
 */
export function sendApiError(
  reply: FastifyReply,
  statusCode: number,
  message: string,
  options?: SendApiErrorOptions,
) {
  const body: ApiErrorBody = {
    code: options?.code ?? defaultApiErrorCode(statusCode),
    message,
    correlationId: String(reply.request.id),
    ...(options?.details ? { details: options.details } : {}),
  };
  return reply.status(statusCode).send(body);
}

/** Convierte issues Zod (`error.issues`) en `details` del envelope. */
export function zodIssuesToDetails(
  issues: Array<{ path: Array<string | number>; message: string }>,
): ApiErrorDetail[] {
  return issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

/** Handler global: errores lanzados (incl. validación Fastify) → envelope. */
export function apiErrorHandler(
  error: Error & { statusCode?: number; validation?: unknown },
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const statusCode =
    typeof error.statusCode === 'number' && error.statusCode >= 400 ? error.statusCode : 500;

  if (statusCode >= 500) {
    request.log.error({ err: error }, 'unhandled error');
  } else {
    request.log.warn({ err: error }, 'request error');
  }

  // No filtrar detalles internos en 500 (norma R-37: mensaje genérico).
  const message = statusCode >= 500 ? 'Error interno' : error.message || 'Error en la solicitud';
  return sendApiError(reply, statusCode, message);
}

/** Handler global 404 de ruta inexistente → envelope. */
export function apiNotFoundHandler(request: FastifyRequest, reply: FastifyReply) {
  return sendApiError(reply, 404, `Ruta no encontrada: ${request.method} ${request.url}`);
}
