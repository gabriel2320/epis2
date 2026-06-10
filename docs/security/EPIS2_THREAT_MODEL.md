# EPIS2 — Threat model (STRIDE ligero)

**Versión:** 1.0 · 2026-06-10 · **MF:** MF-NORM-302 (Hilo NORM) · Revisión humana pendiente de signoff
**Alcance:** EPIS2 en fase laboratorio/demo (sin PHI real, datos sintéticos `DEMO/SINTÉTICO`).

## 1. Actores y supuestos

| Actor | Confianza | Notas |
|-------|-----------|-------|
| Clínico demo (physician/nurse/pharmacist…) | Autenticado, rol acotado | Roles validados contra `CLINICAL_ROLES` al verificar JWT |
| Admin / auditor | Autenticado, permisos explícitos | Sin wildcards (gate `explicit-permissions`) |
| IA local (Ollama + local-ai) | **No confiable para escritura** | Solo borradores; nunca SoT (gate `ai-write-boundary`) |
| Sistemas legacy (EPIS, HL7) | No confiables | Cuarentena interop + manifest de imports |
| Atacante externo de red | Hostil | Fuera de alcance parcial: despliegue actual es local/laboratorio |

Supuestos: PostgreSQL local en 127.0.0.1; sin exposición a internet; datos 100% sintéticos.

## 2. Superficies y análisis STRIDE

### 2.1 Autenticación y sesión (`/api/auth/*`)

| Amenaza | Vector | Mitigación actual | Brecha / riesgo aceptado |
|---|---|---|---|
| **S**poofing | Robo de cookie de sesión | JWT firmado (jose, `SESSION_SECRET` ≥16), cookie de sesión, expiración | Demo keys (`DEMO-CLAVE-*`) en repo — **aceptado en laboratorio**, prohibido en staging+ |
| **T**ampering | Manipulación de rol en token | `verifySessionToken` rechaza roles fuera de `CLINICAL_ROLES` (fase 2 fb5ba23) | — |
| **E**levation | Saltarse permisos por ruta | `createRequirePermission` preHandler en cada ruta protegida + matriz RBAC | Sin rate limiting de login — abrir MF si sale del laboratorio |

### 2.2 Borradores y aprobación clínica (`/api/drafts*`)

| Amenaza | Vector | Mitigación | Brecha |
|---|---|---|---|
| Tampering | Aprobar sin humano / IA auto-aprueba | Gate `human-approval-required`; aprobación = transacción única (nota + approval + side-effects + auditoría) | — |
| **R**epudiation | Negar autoría de aprobación | `audit_events` emitido **dentro de la misma transacción** | — |
| **I**nfo disclosure | Drafts de otros pacientes | RLS piloto (3 tablas) + `runWithRlsContext`; fail-closed en producción (`RLS_MODE=enforce`) | RLS no cubre todas las tablas — plan por olas propio |
| **D**oS | Listados sin límite | Paginación `limit≤100` (MF-NORM-105); search con caps 50/20 | — |

### 2.3 IA asistencial (`/api/ai/*`, local-ai, Ollama)

| Amenaza | Vector | Mitigación | Brecha |
|---|---|---|---|
| Tampering | IA escribe datos aprobados | Frontera arquitectónica: IA solo produce borradores `requiresHumanReview`; gate CI `ai-write-boundary` | — |
| Info disclosure | Contexto clínico sale del perímetro | Ollama/local-ai corren en 127.0.0.1 (sin nube) | Si se adopta IA remota: abrir revisión de este modelo **antes** |
| Spoofing | Prompt injection vía texto clínico | Salida tratada como sugerencia editable; humano firma | Sin sanitización formal de prompts — riesgo bajo en demo, revisar en N4+ |

### 2.4 Interop / legacy (HL7, imports EPIS)

| Amenaza | Vector | Mitigación | Brecha |
|---|---|---|---|
| Tampering | Mensajes HL7 maliciosos | Cuarentena (`hl7Quarantine*`), validación, writeback como propuesta con revisión | — |
| Elevation | Código legacy inseguro portado | `legacy-import-manifest.json` + allowlist + gate `no-legacy-dependencies` | — |

### 2.5 Impresión y documentos

| Amenaza | Vector | Mitigación | Brecha |
|---|---|---|---|
| Info disclosure | Vista de impresión sin sesión | Rutas bajo `requireSession`; print preview vive en `sessionStorage` (se limpia al cerrar pestaña) | Marca BORRADOR visible hasta aprobación (anti-repudio documental) |

### 2.6 Plataforma

| Amenaza | Vector | Mitigación | Brecha |
|---|---|---|---|
| Tampering | Migraciones alteradas | Tabla `epis2_schema_migrations` con checksum | — |
| Info disclosure | Secretos en logs/git | `.env` fuera de git; pino `redact` de authorization/cookie (MF-NORM-201) | — |
| Repudiation | Acciones sin rastro | `audit_events` + `correlationId` por request (MF-NORM-201) | OTel pendiente (MF-NORM-203) |
| DoS | Sin límites de payload/rate | Fastify body limit default (1 MiB) | Rate limiting pendiente — gate pre-producción |

## 3. Riesgos aceptados (laboratorio)

1. Claves demo en repositorio (`DEMO-CLAVE-*`) — solo mientras no exista despliegue compartido.
2. HTTP sin TLS en localhost.
3. Sin rate limiting ni lockout de login.
4. RLS parcial (3 tablas piloto).

Cada uno se convierte en **bloqueador** en el checklist pre-producción
(`reports/epis2-auditoria-profunda-2026-06-09.md` §7 / fase 5).

## 4. Mantenimiento

- Revisar este documento al cerrar cada tramo NORM y ante cualquier cambio de frontera
  (IA remota, consumidor externo de API, despliegue fuera de localhost).
- Referenciado desde el checklist de signoff clínico y `docs/INDEX.md`.
