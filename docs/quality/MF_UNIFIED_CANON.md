# EPIS2 — Canon unificado de microfases (MF-1…MF-51)

**Versión:** 1.0.0 · **Fecha:** 2026-06-07  
**Propósito:** Numeración continua desde el primer paso del proyecto hasta el último planificado en hoja de ruta.  
**Ledger operativo vigente:** sigue usando IDs `MF-151…182` + inserciones `MF-183…188` hasta migración explícita del JSON.

## Reglas de conciliación

| Regla | Descripción |
|-------|-------------|
| **MF-1…13** | Fases fundacionales `EPIS2-00` … `EPIS2-12` (MVP v1 + tablero) |
| **MF-14…51** | Programa post-MVP en **orden canónico** del ledger v1.1 (`canonicalExecutionOrder`) |
| **Estado** | Fundación = DONE histórico; post-MVP = `microphase-ledger.json` al 2026-06-06 |
| **Paralelos** | M3-00…09, MUI-01…10, Plan A–G, WIDGET, V0–V5 se ejecutaron en paralelo a EPIS2-02…12 — no ocupan MF propia; ver nota al pie |

## Tabla maestra

| MF | ID legado | Fase / nombre | Ola | Estado |
|----|-----------|---------------|-----|--------|
| **MF-1** | EPIS2-00 | Decisión y congelamiento (canon, alcance, reglas) | Fundación | DONE |
| **MF-2** | EPIS2-01 | Bootstrap monorepo | Fundación | DONE |
| **MF-3** | EPIS2-02 | Sistema visual y shell | Fundación | DONE |
| **MF-4** | EPIS2-03 | Autenticación, roles y seguridad | Fundación | DONE |
| **MF-5** | EPIS2-04 | Núcleo PostgreSQL | Fundación | DONE |
| **MF-6** | EPIS2-05 | Command Registry y router | Fundación | DONE |
| **MF-7** | EPIS2-06 | Formularios generados (6 blueprints) | Fundación | DONE |
| **MF-8** | EPIS2-07 | IA local segura | Fundación | DONE |
| **MF-9** | EPIS2-08 | Borradores y aprobación | Fundación | DONE |
| **MF-10** | EPIS2-09 | Datos demo sintéticos (5 casos) | Fundación | DONE |
| **MF-11** | EPIS2-10 | Interoperabilidad FHIR (export) | Fundación | DONE |
| **MF-12** | EPIS2-11 | QA humano y piloto demo (GO DEMO) | Fundación | DONE |
| **MF-13** | EPIS2-12 | Modo tablero secundario | Fundación | DONE |
| **MF-14** | MF-151 | Gobernanza del programa de microfases | 0 | DONE |
| **MF-15** | MF-152 | Corrección copy español y deriva documental | 0 | DONE |
| **MF-16** | MF-153 | Paridad local con CI y PostgreSQL | 0 | DONE |
| **MF-17** | MF-154 | Playwright E2E crítico en CI | 0 | DONE |
| **MF-18** | MF-155 | RLS staging fail-closed | 0 | DONE |
| **MF-19** | MF-183 | Integración API estable (golden + RLS + censo) | 0 | DONE |
| **MF-20** | MF-184 | Matriz Golden Journey × M3 × dominio | 0 | DONE |
| **MF-21** | MF-185 | Auth UI — /login sin redirect 401 | 0 | DONE |
| **MF-22** | MF-186 | Golden E2E G3 — borrador→aprobación→auditoría | 0 | DONE |
| **MF-23** | MF-187 | Ollama stack docker + smoke local-ai | 0 | DONE |
| **MF-24** | MF-156 | Contrato y scaffolder de blueprints | 1 | DONE |
| **MF-25** | MF-188 | Patrón IA Ollama por blueprint | 1 | DONE |
| **MF-26** | MF-157 | Blueprint admission_note | 1 | DONE |
| **MF-27** | MF-158 | Cadena vertical ingreso hospitalario | 1 | DONE |
| **MF-28** | MF-159 | CRUD alergias | 1 | DONE |
| **MF-29** | MF-160 | CRUD problemas clínicos | 1 | DONE |
| **MF-30** | MF-161 | Bandeja mínima de resultados | 2 | DONE |
| **MF-31** | MF-162 | Resultados críticos y acuse | 2 | DONE |
| **MF-32** | MF-163 | Trazabilidad orden → resultado | 2 | DONE |
| **MF-33** | MF-164 | Tendencias clínicas | 2 | DONE |
| **MF-34** | MF-165 | Comandos de resultados | 2 | DONE |
| **MF-35** | MF-166 | Conciliación medicamentos | 3 | **READY** |
| **MF-36** | MF-167 | Nota de traslado | 3 | BLOCKED |
| **MF-37** | MF-168 | Consulta ambulatoria | 3 | BLOCKED |
| **MF-38** | MF-169 | Solicitud e informe interconsulta | 3 | BLOCKED |
| **MF-39** | MF-170 | Cola priorizada formularios restantes | 3 | BLOCKED |
| **MF-40** | MF-171 | Usuarios y roles | 4 | BLOCKED |
| **MF-41** | MF-172 | Catálogos clínicos | 4 | BLOCKED |
| **MF-42** | MF-173 | Consola de auditoría | 4 | BLOCKED |
| **MF-43** | MF-174 | Consola operacional | 4 | BLOCKED |
| **MF-44** | MF-175 | OIDC en staging | 5 | BLOCKED |
| **MF-45** | MF-176 | Rate limits y controles de abuso | 5 | BLOCKED |
| **MF-46** | MF-177 | Backup y restauración | 5 | BLOCKED |
| **MF-47** | MF-178 | Signoff humano M3, modo oscuro y offline | 5 | BLOCKED |
| **MF-48** | MF-179 | Ensayo formal de piloto | 5 | BLOCKED |
| **MF-49** | MF-180 | HL7 inbound en cuarentena sin writeback | 6 | BLOCKED |
| **MF-50** | MF-181 | Mapeo y reconciliación HL7 | 6 | BLOCKED |
| **MF-51** | MF-182 | Writeback HL7 controlado auditado reversible | 6 | BLOCKED |

## Resumen

| Métrica | Valor |
|---------|-------|
| Total MF unificadas | **51** |
| DONE | **34** (MF-1…34) |
| READY | **1** (MF-35) |
| BLOCKED | **16** (MF-36…51) |
| Próxima ejecución | **MF-35** ≡ `MF-166` |

## Conciliación con propuesta arquitecto v2 (MF-2xx)

La propuesta `reports/epis2-master-architect-program-v2.md` (MF-200+) **no sustituye** este canon hasta decisión explícita. Equivalencias orientativas:

| MF unificado | MF legado | MF-2xx (propuesta) |
|--------------|-----------|---------------------|
| MF-14…18 | MF-151…155 | MF-200…204 |
| MF-19…23 | MF-183…187 | MF-205…209 |
| MF-24…29 | MF-156…160 + MF-188 | MF-210…215 |
| MF-30…34 | MF-161…165 | MF-220…224 |
| MF-35…39 | MF-166…170 | MF-225…229 |
| MF-40…43 | MF-171…174 | MF-230…233 |
| MF-44…48 | MF-175…179 | MF-270…274 |
| MF-49…51 | MF-180…182 | MF-280…282 |

## Nota — hitos paralelos (sin MF propia)

Ejecutados durante fundación / post-MVP; evidencia en `reports/` y `docs/design/`:

- **M3-00…09** — Adopción Material Design 3  
- **MUI-01…10** — Migración MUI X / licensing  
- **LAYOUT-01…02**, **WIDGET-00…01** — Shell clínico y widgets  
- **Plan A–G** — Estabilización, FHIR, IA trazable, bundle CI  
- **V0–V5 slices** — Demo hospitalización, enfermería, farmacia, interop, IA  
- **PILOT-HUMAN** — GO DEMO 2026-06-05  

## Próximo paso operativo

**Plan maestro detallado (MF-1…51 + M3):** `reports/epis2-master-plan-mf1-51-m3.md`  
**Norma impresión clínica Chile (Carta/A5):** `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`

```bash
npm run quality:microphase-next   # → MF-166 ≡ MF-35 Conciliación medicamentos
```
