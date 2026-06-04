import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { createRequirePermission } from '../auth/authenticate.js';
import {
  exportFhirDocumentReference,
  exportFhirEncounter,
  exportFhirPatient,
  exportFhirPatientBundle,
  exportFhirServiceRequest,
  FhirExportError,
  FHIR_BOUNDARY,
} from './service.js';

const FHIR_JSON = 'application/fhir+json; charset=utf-8';

function sendFhir(reply: import('fastify').FastifyReply, resource: unknown) {
  return reply.header('Content-Type', FHIR_JSON).send(resource);
}

function mapExportError(reply: import('fastify').FastifyReply, error: unknown) {
  if (error instanceof FhirExportError) {
    const status =
      error.code === 'NOT_FOUND' ? 404 : error.code === 'UNSUPPORTED' ? 422 : 500;
    return reply.status(status).send({ error: error.message, code: error.code });
  }
  return reply.status(500).send({ error: 'Error al exportar FHIR' });
}

export async function registerFhirRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  if (!db) {
    app.get('/api/fhir/status', async () => ({
      enabled: false,
      message: 'PostgreSQL no configurado — export FHIR no disponible',
      importEnabled: false,
    }));
    return;
  }

  const requireFhirExport = createRequirePermission(config, 'fhir.export');

  app.get('/api/fhir/status', async () => ({
    enabled: true,
    ...FHIR_BOUNDARY,
    resources: [
      'Patient',
      'Encounter',
      'DocumentReference',
      'ServiceRequest',
      'AllergyIntolerance',
      'MedicationStatement',
      'Bundle',
    ],
    profileDoc: 'docs/fhir/EPIS2_MINIMAL_EXPORT_PROFILE.md',
  }));

  app.get(
    '/api/fhir/Patient/:patientId',
    { preHandler: requireFhirExport },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      try {
        const resource = await exportFhirPatient(db, patientId);
        return sendFhir(reply, resource);
      } catch (e) {
        return mapExportError(reply, e);
      }
    },
  );

  app.get(
    '/api/fhir/Encounter/:encounterId',
    { preHandler: requireFhirExport },
    async (request, reply) => {
      const { encounterId } = request.params as { encounterId: string };
      try {
        const resource = await exportFhirEncounter(db, encounterId);
        return sendFhir(reply, resource);
      } catch (e) {
        return mapExportError(reply, e);
      }
    },
  );

  app.get(
    '/api/fhir/DocumentReference/:noteId',
    { preHandler: requireFhirExport },
    async (request, reply) => {
      const { noteId } = request.params as { noteId: string };
      try {
        const resource = await exportFhirDocumentReference(db, noteId);
        return sendFhir(reply, resource);
      } catch (e) {
        return mapExportError(reply, e);
      }
    },
  );

  app.get(
    '/api/fhir/ServiceRequest/:draftId',
    { preHandler: requireFhirExport },
    async (request, reply) => {
      const { draftId } = request.params as { draftId: string };
      try {
        const resource = await exportFhirServiceRequest(db, draftId);
        return sendFhir(reply, resource);
      } catch (e) {
        return mapExportError(reply, e);
      }
    },
  );

  app.get(
    '/api/fhir/patients/:patientId/bundle',
    { preHandler: requireFhirExport },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      try {
        const bundle = await exportFhirPatientBundle(db, patientId);
        return sendFhir(reply, bundle);
      } catch (e) {
        return mapExportError(reply, e);
      }
    },
  );
}
