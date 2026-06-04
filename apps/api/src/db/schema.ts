import {
  boolean,
  date,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

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

export const encounters = pgTable('encounters', {
  id: uuid('id').primaryKey().defaultRandom(),
  patientId: uuid('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('open'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
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
});

export const auditEvents = pgTable('audit_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventType: text('event_type').notNull(),
  at: timestamp('at', { withTimezone: true }).notNull().defaultNow(),
  actorId: text('actor_id').references(() => appUsers.id),
  username: text('username'),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  message: text('message'),
  payload: jsonb('payload'),
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
