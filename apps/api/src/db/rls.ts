export type RlsMode = 'off' | 'enforce';

export type RlsSessionContext = {
  mode: RlsMode;
  actorId?: string;
  actorRole?: string;
};

export function parseRlsMode(value: string | undefined): RlsMode {
  return value === 'enforce' ? 'enforce' : 'off';
}

/** Sentencias SET LOCAL para transacción con RLS (ADR-005). */
export function buildRlsSetLocalStatements(ctx: RlsSessionContext): string[] {
  const statements = [`SET LOCAL epis2.rls_mode = '${ctx.mode}'`];
  if (ctx.actorId) {
    statements.push(`SET LOCAL epis2.actor_id = '${ctx.actorId.replace(/'/g, "''")}'`);
  }
  if (ctx.actorRole) {
    statements.push(`SET LOCAL epis2.actor_role = '${ctx.actorRole.replace(/'/g, "''")}'`);
  }
  return statements;
}

export const RLS_PROTECTED_TABLES = ['clinical_drafts', 'clinical_notes', 'patients'] as const;
