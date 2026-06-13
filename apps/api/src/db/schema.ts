import { boolean, char, date, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const appUsers = pgTable('app_users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  role: text('role').notNull(),
  isSynthetic: boolean('is_synthetic').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const patients = pgTable('patients', {
  id: uuid('id').primaryKey().defaultRandom(),
  isSynthetic: boolean('is_synthetic').notNull().default(true),
  displayName: text('display_name').notNull(),
  birthDate: date('birth_date'),
  sex: text('sex'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const patientIdentifiers = pgTable('patient_identifiers', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  system: text('system').notNull(),
  value: text('value').notNull(),
  identifierType: text('identifier_type').notNull().default('RUN'),
  rutNumero: integer('rut_numero'),
  rutDv: char('rut_dv', { length: 1 }),
  valueNormalized: text('value_normalized'),
  countryCode: char('country_code', { length: 2 }).notNull().default('CL'),
  validFrom: timestamp('valid_from', { withTimezone: true }),
  validTo: timestamp('valid_to', { withTimezone: true }),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const patientCoverage = pgTable('patient_coverage', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  tipoPrevision: text('tipo_prevision').notNull(),
  fonasaTramo: text('fonasa_tramo'),
  isapreNombre: text('isapre_nombre'),
  planNombre: text('plan_nombre'),
  vigenteDesde: date('vigente_desde').notNull(),
  vigenteHasta: date('vigente_hasta'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const episodesOfCare = pgTable('episodes_of_care', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  tipoEpisodio: text('tipo_episodio').notNull().default('ambulatory'),
  estado: text('estado').notNull().default('active'),
  fechaInicio: timestamp('fecha_inicio', { withTimezone: true }).notNull().defaultNow(),
  fechaFin: timestamp('fecha_fin', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const professionals = pgTable('professionals', {
  id: uuid('id').primaryKey().defaultRandom(),
  appUserId: text('app_user_id')
    .notNull()
    .unique()
    .references(() => appUsers.id),
  runNormalizado: text('run_normalizado'),
  rnpiNumero: text('rnpi_numero'),
  titulo: text('titulo'),
  especialidad: text('especialidad'),
  subespecialidad: text('subespecialidad'),
  registroActivo: boolean('registro_activo').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const encounters = pgTable('encounters', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  episodeId: uuid('episode_id').references(() => episodesOfCare.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('open'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const problems = pgTable('problems', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id').references(() => encounters.id, { onDelete: 'set null' }),
  description: text('description').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const observations = pgTable('observations', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id').references(() => encounters.id, { onDelete: 'set null' }),
  code: text('code'),
  label: text('label').notNull(),
  valueText: text('value_text').notNull(),
  observedAt: timestamp('observed_at', { withTimezone: true }).notNull().defaultNow(),
  clinicalOrderId: uuid('clinical_order_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalDrafts = pgTable('clinical_drafts', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id').references(() => encounters.id, { onDelete: 'set null' }),
  draftType: text('draft_type').notNull(),
  status: text('status').notNull().default('draft'),
  title: text('title').notNull(),
  body: jsonb('body').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => appUsers.id),
});

export const draftVersions = pgTable('draft_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  draftId: uuid('draft_id')
    .notNull()
    .references(() => clinicalDrafts.id, { onDelete: 'cascade' }),
  versionNo: integer('version_no').notNull(),
  status: text('status').notNull(),
  title: text('title').notNull(),
  body: jsonb('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalNotes = pgTable('clinical_notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id').references(() => encounters.id, { onDelete: 'set null' }),
  noteType: text('note_type').notNull(),
  title: text('title').notNull(),
  body: jsonb('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  updatedBy: text('updated_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalNoteVersions = pgTable('clinical_note_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  noteId: uuid('note_id')
    .notNull()
    .references(() => clinicalNotes.id, { onDelete: 'cascade' }),
  versionNo: integer('version_no').notNull(),
  title: text('title').notNull(),
  body: jsonb('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const approvals = pgTable('approvals', {
  id: uuid('id').primaryKey().defaultRandom(),
  draftId: uuid('draft_id')
    .notNull()
    .unique()
    .references(() => clinicalDrafts.id),
  noteId: uuid('note_id')
    .notNull()
    .references(() => clinicalNotes.id),
  approvedAt: timestamp('approved_at', { withTimezone: true }).notNull().defaultNow(),
  approvedBy: text('approved_by')
    .notNull()
    .references(() => appUsers.id),
  aiRunId: uuid('ai_run_id').references(() => aiRuns.id, { onDelete: 'set null' }),
});

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(),
  at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  actorId: text('actor_id').references(() => appUsers.id),
  username: text('username'),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  patientId: uuid('patient_id').references(() => patients.id, { onDelete: 'set null' }),
  action: text('action'),
  tableName: text('table_name'),
  recordId: text('record_id'),
  ipAddress: text('ip_address'),
  reason: text('reason'),
  message: text('message'),
  payload: jsonb('payload'),
});

export const patientAllergies = pgTable('patient_allergies', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  substance: text('substance').notNull(),
  severity: text('severity').notNull().default('moderate'),
  status: text('status').notNull().default('active'),
  recordedAt: timestamp('recorded_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const patientMedications = pgTable('patient_medications', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  doseText: text('dose_text'),
  route: text('route'),
  status: text('status').notNull().default('active'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalDocuments = pgTable('clinical_documents', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id').references(() => encounters.id, { onDelete: 'set null' }),
  title: text('title').notNull(),
  documentType: text('document_type').notNull().default('other'),
  mimeType: text('mime_type'),
  storageRef: text('storage_ref').notNull(),
  textContent: text('text_content'),
  intakeStatus: text('intake_status').notNull().default('indexed'),
  status: text('status').notNull().default('indexed'),
  indexedAt: timestamp('indexed_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalUnits = pgTable('clinical_units', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const beds = pgTable('beds', {
  id: uuid('id').primaryKey().defaultRandom(),
  unitId: uuid('unit_id')
    .notNull()
    .references(() => clinicalUnits.id, { onDelete: 'cascade' }),
  bedLabel: text('bed_label').notNull(),
  status: text('status').notNull().default('available'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const inpatientAdmissions = pgTable('inpatient_admissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id')
    .notNull()
    .references(() => encounters.id, { onDelete: 'cascade' }),
  unitId: uuid('unit_id')
    .notNull()
    .references(() => clinicalUnits.id),
  bedId: uuid('bed_id')
    .notNull()
    .references(() => beds.id),
  status: text('status').notNull().default('active'),
  admittedAt: timestamp('admitted_at', { withTimezone: true }).notNull().defaultNow(),
  expectedDischargeAt: timestamp('expected_discharge_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalCriticalResults = pgTable('clinical_critical_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id').references(() => encounters.id, { onDelete: 'set null' }),
  label: text('label').notNull(),
  valueText: text('value_text').notNull(),
  severity: text('severity').notNull().default('critical'),
  observedAt: timestamp('observed_at', { withTimezone: true }).notNull().defaultNow(),
  clinicalOrderId: uuid('clinical_order_id'),
  acknowledgedAt: timestamp('acknowledged_at', { withTimezone: true }),
  acknowledgedBy: text('acknowledged_by').references(() => appUsers.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalOrders = pgTable('clinical_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  encounterId: uuid('encounter_id').references(() => encounters.id, { onDelete: 'set null' }),
  orderType: text('order_type').notNull(),
  title: text('title').notNull(),
  detail: text('detail'),
  status: text('status').notNull().default('active'),
  priority: text('priority').notNull().default('routine'),
  orderedAt: timestamp('ordered_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const marScheduledDoses = pgTable('mar_scheduled_doses', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  medication: text('medication').notNull(),
  doseText: text('dose_text').notNull(),
  route: text('route').notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
  windowEnd: timestamp('window_end', { withTimezone: true }).notNull(),
  status: text('status').notNull().default('scheduled'),
  requiresDoubleCheck: boolean('requires_double_check').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const marAdministrationRecords = pgTable('mar_administration_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  draftId: uuid('draft_id').references(() => clinicalDrafts.id, { onDelete: 'set null' }),
  medication: text('medication').notNull(),
  doseText: text('dose_text').notNull(),
  route: text('route').notNull(),
  doubleCheck: boolean('double_check').notNull().default(false),
  administeredAt: timestamp('administered_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const clinicalCatalogStaging = pgTable('clinical_catalog_staging', {
  id: uuid('id').primaryKey().defaultRandom(),
  catalogCode: text('catalog_code').notNull(),
  entryCode: text('entry_code').notNull(),
  label: text('label').notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

// MF-183: staging drug-intel (scraping fuentes públicas + correlación). No SoT clínico.
export const drugIntelStaging = pgTable('drug_intel_staging', {
  id: uuid('id').primaryKey().defaultRandom(),
  recordKey: text('record_key').notNull().unique(),
  productName: text('product_name').notNull(),
  activeIngredient: text('active_ingredient'),
  atcCode: text('atc_code'),
  reviewStatus: text('review_status').notNull().default('pending'),
  requiresHumanReview: boolean('requires_human_review').notNull().default(true),
  payload: jsonb('payload').notNull(),
  sourceHash: text('source_hash').notNull(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull(),
  reviewedBy: text('reviewed_by').references(() => appUsers.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// MF-CASE-01: staging clinical-case-intel (casos sintéticos scrapeados/normalizados). No SoT hasta promote.
export const clinicalCaseStaging = pgTable('clinical_case_staging', {
  id: uuid('id').primaryKey().defaultRandom(),
  caseCode: text('case_code').notNull().unique(),
  scenario: text('scenario').notNull(),
  reviewStatus: text('review_status').notNull().default('pending'),
  requiresHumanReview: boolean('requires_human_review').notNull().default(true),
  payload: jsonb('payload').notNull(),
  sourceHash: text('source_hash').notNull(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull(),
  reviewedBy: text('reviewed_by').references(() => appUsers.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const interopHl7Quarantine = pgTable('interop_hl7_quarantine', {
  id: uuid('id').primaryKey().defaultRandom(),
  messageType: text('message_type'),
  rawMessage: text('raw_message').notNull(),
  status: text('status').notNull().default('quarantine'),
  mappedPreview: jsonb('mapped_preview'),
  proposedDraftId: uuid('proposed_draft_id').references(() => clinicalDrafts.id, {
    onDelete: 'set null',
  }),
  stagedAt: timestamp('staged_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
  revertedAt: timestamp('reverted_at', { withTimezone: true }),
  revertedBy: text('reverted_by').references(() => appUsers.id),
});

export const interopStagingBatches = pgTable('interop_staging_batches', {
  id: uuid('id').primaryKey().defaultRandom(),
  sourceSystem: text('source_system').notNull(),
  batchLabel: text('batch_label').notNull(),
  status: text('status').notNull().default('staged'),
  recordCount: integer('record_count').notNull().default(0),
  stagedAt: timestamp('staged_at', { withTimezone: true }).notNull().defaultNow(),
  notes: text('notes'),
  createdBy: text('created_by')
    .notNull()
    .references(() => appUsers.id),
});

export const aiRuns = pgTable('ai_runs', {
  id: uuid('id').primaryKey().defaultRandom(),
  actorId: text('actor_id').references(() => appUsers.id),
  blueprintId: text('blueprint_id').notNull(),
  patientId: uuid('patient_id').references(() => patients.id, { onDelete: 'set null' }),
  promptHash: text('prompt_hash').notNull(),
  model: text('model').notNull(),
  latencyMs: integer('latency_ms').notNull(),
  status: text('status').notNull(),
  inputPayload: jsonb('input_payload'),
  outputPayload: jsonb('output_payload'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
