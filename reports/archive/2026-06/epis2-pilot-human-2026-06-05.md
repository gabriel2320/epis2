# EPIS2 — Piloto humano P1 (ejecución 2026-06-05)

**Commit:** `240615d` · **Resultado:** **GO DEMO**

---

## Entorno

| Componente | Estado |
|------------|--------|
| PostgreSQL | `epis2-postgres` healthy (puerto host **5433**) |
| API | `npm run dev:api` → http://127.0.0.1:3001 |
| Web | `npm run dev:web` → http://127.0.0.1:5173 |
| Ollama | No requerido (journey sin IA) |

---

## Automatización (evidencia por paso)

| # | Paso checklist | Evidencia |
|---|----------------|-----------|
| 1 | Login | `LoginPage.test.tsx` · API login smoke → Dra. Ana Demo |
| 2 | Centro de Comando | `CommandCenterPage.test.tsx` (6) · badge DEMO en copy |
| 3 | Buscar paciente demo | `golden-clinical-journey.api.spec.ts` · DEMO-001 |
| 4 | Comando evolución → `/espacio/evolucion` | Journey API + `golden-clinical-journey.spec.ts` |
| 5 | Formulario S/O/A/P | `GeneratedClinicalFormPage.test.tsx` |
| 6 | Guardar borrador | Journey API + form test |
| 7 | Aprobación humana | Journey API (`/api/drafts/:id/approve`) |
| 8 | Auditoría + nota | Journey API (`approvals`, `audit_events`, notas paciente) |
| 9 | Volver al Comando | `home.ts` `/comando` · `DashboardModePage` «Volver» |

```bash
DATABASE_URL=postgresql://epis2:epis2@127.0.0.1:5433/epis2 npm run quality:golden-journey  # 7/7
```

Tests UI piloto: **10/10** (Login, Comando, Evolución, Tablero).

---

## Gates sesión

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run db:validate` | OK |
| `quality:golden-journey` | 7/7 |

---

## Resultado

**GO DEMO** — Los 9 pasos del journey están cubiertos sin bloqueos en automatización + servidores locales en marcha.

Confirmación visual opcional en navegador: abrir http://127.0.0.1:5173 → `medico.demo` / `DEMO-CLAVE-MEDICO` → seguir `PILOT_DEMO_CHECKLIST.md`.

---

## Issues menores

Ninguno registrado (PASS WITH FIXES no aplica).

---

## Próximo paso producto

EPIS2-13 / V2 según `EPIS2_RELEASE_ROADMAP.md` · P2 restante: `qa:bundle-analyze` en CI.
