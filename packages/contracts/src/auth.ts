import { z } from 'zod';

export const loginRequestSchema = z.object({
  username: z.string().min(3).max(64),
  demoAuthKey: z.string().min(8).max(64),
});

export const sessionUserSchema = z.object({
  id: z.string().min(8),
  username: z.string(),
  displayName: z.string(),
  role: z.enum([
    'physician',
    'nurse',
    'paramedic',
    'kinesiologist',
    'pharmacist',
    'admin',
    'auditor',
  ]),
});

export const sessionResponseSchema = z.object({
  user: sessionUserSchema,
  permissions: z.array(z.string()),
  expiresAt: z.string().datetime(),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type SessionResponse = z.infer<typeof sessionResponseSchema>;

export const auditEventSchema = z.object({
  id: z.string(),
  type: z.enum(['auth.login.success', 'auth.login.failure', 'auth.logout']),
  at: z.string().datetime(),
  username: z.string().optional(),
  userId: z.string().optional(),
  message: z.string().optional(),
});

export type AuditEvent = z.infer<typeof auditEventSchema>;
