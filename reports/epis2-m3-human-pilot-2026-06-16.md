# EPIS2 — Piloto humano M3 (2026-06-16)

**Commit:** `c15700a` · **Script:** `npm run quality:m3-human-pilot`

---

## Alcance

Recorrido visual Material Design 3 pasos **V1–V6** según `docs/quality/M3_VISUAL_SIGNOFF_STEPS.md`.

| Capa | Artefacto | Resultado |
|------|-----------|-----------|
| Gates auto | `verify-m3-signoff` | OK |
| E2E visual | `e2e/m3-visual-signoff.spec.ts` | OK |
| Confirmación humana opcional | Navegador — mismas rutas V1–V6 | Pendiente revisor |

---

## Pasos V1–V6 (E2E)

| Paso | Tema | Evidencia automatizada |
|------|------|------------------------|
| V1 | Preferencias MTB instantáneas | Playwright — acentos + localStorage |
| V2 | Modo oscuro Comando + evolución | Playwright — power bar + formulario |
| V3 | Alto contraste + borrador pendiente | Playwright — draft status chip |
| V4 | Catálogo visual dev | Playwright — roles clínicos + sin sombra decorativa |
| V5 | Login → Comando → Evolución → Aprobación | Playwright — approval gate |
| V6 | Banner offline + reduced motion | Playwright — `setOffline` + emulateMedia |

---

## Registro de signoff visual (humano)

Completar tras revisión opcional en navegador (`medico.demo` / `DEMO-CLAVE-MEDICO`):

| Campo | Valor |
|-------|--------|
| Revisor | |
| Fecha | 2026-06-16 |
| Entorno | local staging |
| V1–V6 confirmados visualmente | [ ] Sí / [ ] No (anotar paso) |
| Resultado | **GO DEMO M3** / PASS WITH FIXES / BLOCKED |

Rutas: `/preferencias-apariencia`, `/comando`, `/espacio/evolucion`, `/desarrollo/catalogo-visual`

---

## Gates sesión

| Gate | Resultado |
|------|-----------|
| `npm run quality:m3-signoff` | OK |
| `npm run quality:m3-human-pilot` | OK |
| `npm run test:e2e m3-visual-signoff` | OK |

---

## Resultado automatizado

**GO DEMO M3 (automatizado)** — V1–V6 cubiertos por E2E + gates M3 sin fallos.

Confirmación visual humana opcional para capturas o edge cases OS (Seguir sistema).

---

## Próximo paso

Impresión clínica Chile — `docs/design/EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md`
