import { z } from 'zod';

/**
 * Envelope de error compartido de la API (MF-NORM-202, norma R-37).
 *
 * Toda respuesta de error HTTP de la API cumple este schema; las rutas no
 * construyen `{ error }` ad-hoc. `correlationId` permite correlacionar la
 * respuesta con los logs estructurados (R-45/R-46).
 */

/** Códigos estables por categoría de error; el detalle humano va en `message`. */
export const apiErrorCodeSchema = z.enum([
  'VALIDATION',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'UNAVAILABLE',
  'INTERNAL',
]);

/** Detalle por campo (paths Zod) para mapear a errores de formulario (MF-NORM-404). */
export const apiErrorDetailSchema = z.object({
  path: z.string(),
  message: z.string(),
});

export const apiErrorSchema = z.object({
  code: apiErrorCodeSchema,
  message: z.string().min(1),
  correlationId: z.string().min(1),
  details: z.array(apiErrorDetailSchema).optional(),
});

export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;
export type ApiErrorDetail = z.infer<typeof apiErrorDetailSchema>;
export type ApiErrorBody = z.infer<typeof apiErrorSchema>;

/** Código por defecto según status HTTP (las rutas pueden sobreescribirlo). */
export function defaultApiErrorCode(statusCode: number): ApiErrorCode {
  switch (statusCode) {
    case 400:
    case 422:
      return 'VALIDATION';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 429:
      return 'RATE_LIMITED';
    case 503:
      return 'UNAVAILABLE';
    default:
      return 'INTERNAL';
  }
}
