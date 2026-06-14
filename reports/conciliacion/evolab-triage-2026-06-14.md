# F3 — Triage findings Evolab (top-10 high)

**Fecha sync:** 2026-06-14T15:49:41Z · **Fuente:** `reports/evolab-open-findings.json`  
**Totales:** 200 open · 142 high · 58 medium

> Hallazgos = señales de simulación, no bugs confirmados. Triage propone MF/backlog EPIS2; no auto-fix.

| # | Fingerprint | Repeticiones | Escenario(s) | MF EPIS2 propuesta | Prioridad |
|---|-------------|-------------|--------------|-------------------|-----------|
| 1 | `efa918267c3cb027` | 8 | admission-discharge mutated | Backlog admisión/alta · revisar eval `audit-completeness` | P2 |
| 2 | `129c4d642faf16a7` | 7 | admission-discharge mutated | Backlog flujo alta · golden journey admisión | P2 |
| 3 | `8aeb8c6185184187` | 5 | admission-discharge deep mutate | Backlog CDR consistencia | P2 |
| 4 | `506ef4bc80655fff` | 5 | discharge-critical-pending | Tramo C epicrisis / pending orders | P2 |
| 5 | `50df1d69aac96d12` | 4 | admission-discharge base mutate | MF-SH evals intent (STRENGTHEN) | P1 |
| 6 | `ad10b9ca2328a548` | 4 | admission-discharge | Backlog admisión | P2 |
| 7 | `573cf1a080ff62ee` | 4 | double-booking branch | Backlog censo/citas | P3 |
| 8 | `574d5e3ea683be74` | 4 | admission-double-booking | Backlog censo | P3 |
| 9 | `0bf2e44cf31856bb` | 4 | role-evolution-sign | Human approval / RBAC signoff | P1 |
| 10 | `2f5e783a3139475d` | 4 | admission-discharge mutate | Backlog alta | P2 |

## Acciones inmediatas

1. **No cerrar masivamente** — muchos duplicados por misma fingerprint en runs de evolución.
2. **MF-SH-02** cubre señales de intent/command (filas 5 + posible overlap RBAC).
3. **Revisión humana** de fingerprints `efa918*` y `506ef4*` tras MF-SH-02.
4. Próximo sync: tras MF-SH-02 o cierre semanal tríada.

## Evolab remoto

- Push: `6b9e40b` (F5) + `246fc27` (quality fix) → `origin/master`
- Smoke: **14/14** passed contra EPIS2 post-DI
