/**
 * MF-NORM-301 — OpenAPI 3.1 generado desde Zod (norma R-33/R-34).
 * Cubre rutas auth, drafts y search sin reescribir handlers Fastify.
 */
import 'zod-openapi';
import { createDocument } from 'zod-openapi';
import {
  apiErrorResponseSchema,
  createDraftRequestSchema,
  createDraftResponseSchema,
  documentSearchQuerySchema,
  documentSearchResponseSchema,
  draftDetailResponseSchema,
  draftIdParamSchema,
  draftsListQueryOpenApiSchema,
  draftsListResponseSchema,
  loginRequestOpenApiSchema,
  logoutOkSchema,
  patientIdParamSchema,
  patientsSearchQuerySchema,
  patientsSearchResponseSchema,
  sessionResponseOpenApiSchema,
  updateDraftRequestSchema,
} from './schemas.js';

const jsonError = (description: string) => ({
  description,
  content: {
    'application/json': { schema: apiErrorResponseSchema },
  },
});

export function buildOpenApiDocument(): Record<string, unknown> {
  return createDocument({
    openapi: '3.1.0',
    info: {
      title: 'EPIS2 API',
      version: '0.1.0',
      description:
        'Contrato HTTP de la API clínica EPIS2. Generado desde schemas Zod compartidos (MF-NORM-301).',
    },
    tags: [
      { name: 'auth', description: 'Sesión demo y auditoría de login' },
      { name: 'drafts', description: 'Borradores clínicos (SoT PostgreSQL)' },
      { name: 'search', description: 'Búsqueda de pacientes y documentos' },
    ],
    components: {
      securitySchemes: {
        sessionCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'epis2_session',
          description: 'Cookie de sesión JWT firmada (demo/hybrid)',
        },
      },
    },
    security: [{ sessionCookie: [] }],
    paths: {
      '/api/auth/login': {
        post: {
          tags: ['auth'],
          summary: 'Inicio de sesión demo',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: loginRequestOpenApiSchema },
            },
          },
          responses: {
            '200': {
              description: 'Sesión iniciada',
              content: {
                'application/json': { schema: sessionResponseOpenApiSchema },
              },
            },
            '400': jsonError('Datos de inicio de sesión inválidos'),
            '401': jsonError('Credenciales incorrectas'),
            '429': jsonError('Demasiados intentos'),
          },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['auth'],
          summary: 'Cierre de sesión',
          responses: {
            '200': {
              description: 'Sesión cerrada',
              content: {
                'application/json': { schema: logoutOkSchema },
              },
            },
            '401': jsonError('No autenticado'),
          },
        },
      },
      '/api/auth/session': {
        get: {
          tags: ['auth'],
          summary: 'Sesión actual',
          responses: {
            '200': {
              description: 'Sesión activa',
              content: {
                'application/json': { schema: sessionResponseOpenApiSchema },
              },
            },
            '401': jsonError('No autenticado'),
          },
        },
      },
      '/api/drafts': {
        get: {
          tags: ['drafts'],
          summary: 'Listar borradores (paginado)',
          requestParams: { query: draftsListQueryOpenApiSchema },
          responses: {
            '200': {
              description: 'Página de borradores',
              content: {
                'application/json': { schema: draftsListResponseSchema },
              },
            },
            '400': jsonError('Parámetros de paginación inválidos'),
            '401': jsonError('No autenticado'),
            '403': jsonError('Sin permiso draft.read'),
          },
        },
        post: {
          tags: ['drafts'],
          summary: 'Crear borrador clínico',
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: createDraftRequestSchema },
            },
          },
          responses: {
            '201': {
              description: 'Borrador creado',
              content: {
                'application/json': { schema: createDraftResponseSchema },
              },
            },
            '400': jsonError('Datos de borrador inválidos (details por campo)'),
            '401': jsonError('No autenticado'),
            '403': jsonError('Sin permiso draft.write'),
          },
        },
      },
      '/api/drafts/{draftId}': {
        get: {
          tags: ['drafts'],
          summary: 'Detalle de borrador',
          requestParams: { path: draftIdParamSchema },
          responses: {
            '200': {
              description: 'Borrador y versiones',
              content: {
                'application/json': { schema: draftDetailResponseSchema },
              },
            },
            '401': jsonError('No autenticado'),
            '403': jsonError('Sin permiso draft.read'),
            '404': jsonError('Borrador no encontrado'),
          },
        },
        patch: {
          tags: ['drafts'],
          summary: 'Actualizar borrador',
          requestParams: { path: draftIdParamSchema },
          requestBody: {
            required: true,
            content: {
              'application/json': { schema: updateDraftRequestSchema },
            },
          },
          responses: {
            '200': {
              description: 'Borrador actualizado',
              content: {
                'application/json': { schema: createDraftResponseSchema },
              },
            },
            '400': jsonError('Actualización inválida (details por campo)'),
            '401': jsonError('No autenticado'),
            '403': jsonError('Sin permiso draft.write'),
            '404': jsonError('Borrador no encontrado'),
            '409': jsonError('Conflicto al actualizar'),
          },
        },
      },
      '/api/patients': {
        get: {
          tags: ['search'],
          summary: 'Buscar pacientes',
          requestParams: { query: patientsSearchQuerySchema },
          responses: {
            '200': {
              description: 'Resultados de búsqueda',
              content: {
                'application/json': { schema: patientsSearchResponseSchema },
              },
            },
            '401': jsonError('No autenticado'),
            '403': jsonError('Sin permiso patient.read'),
          },
        },
      },
      '/api/patients/{patientId}/documents/search': {
        get: {
          tags: ['search'],
          summary: 'Buscar documentos del paciente',
          requestParams: {
            path: patientIdParamSchema,
            query: documentSearchQuerySchema,
          },
          responses: {
            '200': {
              description: 'Documentos coincidentes (solo lectura)',
              content: {
                'application/json': { schema: documentSearchResponseSchema },
              },
            },
            '401': jsonError('No autenticado'),
            '403': jsonError('Sin permiso patient.read'),
            '404': jsonError('Paciente no encontrado'),
          },
        },
      },
    },
  }) as unknown as Record<string, unknown>;
}
