# EPIS2 — Registro de pendientes (SDEPIS2)

**Fuente:** [epis2-audit-avance-proyecto-2026-06-09.md](./epis2-audit-avance-proyecto-2026-06-09.md)  
**Actualizado:** 2026-06-10

| ID | Prioridad | Pendiente | Owner / hilo |
|----|-----------|-----------|--------------|
| PEND-001 | ~~P1~~ **Cerrado 2026-06-09** | ~~Signoff Tramo J farmacia~~ → técnico + signoff · `fa38e4d` · [`epis2-tramo-j-signoff-2026-06-09.md`](./epis2-tramo-j-signoff-2026-06-09.md) | Hilo D |
| PEND-002 | ~~P1~~ **Defer → backlog** | Nota procedimiento clínica (IDC 58+ ≠ `procedure_request`) · Ola 2+/3 · no bloquea Hilo B | Backlog |
| PEND-003 | ~~P2~~ **Cerrado 2026-06-09** | ~~E2E `tramo-c-admission` + ficha-history~~ → `reports/epis2-tramo-c-admission-e2e-fix-2026-06-09.md` (3/3 E2E) | Calidad |
| PEND-004 | P2 | Patrón combobox MUI en E2E | Calidad |
| PEND-005 | P2 | Hitos Ola 1C / 1D | Ola 1 |
| PEND-006 | ~~P1~~ **Código cerrado 2026-06-09** | Impresión + piloto M3 | Ola 3 · receta A5 ✓ · cert A5 ✓ · epicrisis Carta ✓ · **lab/imagen A5 ✓** (registry `PRINTABLE_BLUEPRINTS` + 5 E2E en CI · [reporte](./epis2-f1-f2-limpieza-print-2026-06-09.md)) · m3-human-pilot automatizado cerrado ([reporte](./epis2-m3-human-pilot-2026-06-09.md)) · resta solo signoff humano opcional |
| PEND-007 | P3 | Dependabot zod 4.x | Plataforma |
| PEND-008 | ~~P3~~ **Cerrado 2026-06-09** | ~~microphase-next mensaje Hilo B~~ → ya usa Hilo B / Hilo D | Tooling |
| PEND-009 | P3 | Storybook por IDC | UI |
| PEND-010 | P3 | MF-2xx propuesta | Arquitectura |
| PEND-012 | ~~P1~~ **Cerrado 2026-06-10** | ~~Hilo NORM~~ — 16/16 MF · cumplimiento ≈90% · [`epis2-norm-hilo-close-2026-06-10.md`](./epis2-norm-hilo-close-2026-06-10.md) · precondición PEND-011 ✓ | Arquitectura / Calidad |
| PEND-011 | ~~P0~~ **Cerrado 2026-06-10** | ~~CI rojo desde fase 2~~ — causa raíz: carrera de autenticación en carga fría (guard de `GeneratedClinicalFormPage` redirigía a `/sin-acceso` antes de cargar la sesión; solo visible con bundle preview de CI). Fix: guard espera `isLoading` + 2 tests unitarios · paridad CI local 5/5 y set `test:e2e` 15/15 · [reporte](./epis2-pend011-ci-print-e2e-fix-2026-06-10.md) | Calidad / CI |

Cerrar ítem: marcar fecha en este registro + reporte `reports/` + actualizar [EPIS2_TABLERO.md](../docs/product/EPIS2_TABLERO.md).
