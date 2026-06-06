# EPIS2 — Ola 2 Atención médica (ambulatorio)

**Fecha:** 2026-06-04  
**IDC:** 31–40 (consulta ambulatoria, certificados, cierre episodio)  
**Workspace:** `ambulatory`

---

## Entregables

| Entregable | Archivo / ruta | Estado |
|------------|------------------|--------|
| Consulta scrollspy Ola 2 | `outpatient-visit.ts` — 7 secciones, lazy collapsed | ✓ |
| Signos vitales + examen segmentario | Secciones `vitals`, `physical-*` | ✓ |
| CIE-10 demo + cierre episodio | `icd10Code`, `closeEncounter`, resumen paciente | ✓ |
| FAB ambulatorio | `copy.workspaces.ambulatory.fab` en dock | ✓ |
| Blueprint certificado médico | `medical-certificate.ts` → `/espacio/certificado` | ✓ |
| Comando «emitir certificado» | `create_medical_certificate` | ✓ |
| Migración draft type | `032_ola2_medical_certificate_draft_type.sql` | ✓ |
| Ficha tab Recetas → certificado | `patientChartNavigation.ts` | ✓ |
| Árbol reconciliado | `epis2NavigationTree.ts` | ✓ |

**Registry:** 19 blueprints (antes 18).

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | OK |
| `npm run test` | OK — 405 tests |
| `npm run db:validate` | OK — 32 migraciones |
| `npm run quality:golden-journey` | OK — 12 tests |

---

## Riesgos

| Riesgo | Mitigación |
|--------|------------|
| CIE-10 demo estático | Catálogo staging Ola 3+ |
| Cierre episodio = checkbox demo | API encuentros Ola 4 |
| Tab Certificados vs límite 5 tabs M3 | Certificado bajo tab Recetas por ahora |

---

## Próximo paso

**Ola 3** — antecedentes IDC 27–30 (blueprints mórbidos/familiares/hábitos).
