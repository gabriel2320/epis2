# EPIS — Postmortem (memoria para EPIS2)

**Estado:** `LEGACY_REFERENCE` · **Donante:** `../Epis`  
**Regla EPIS2:** los errores aquí listados son **gates**, no anécdotas.

---

## Resumen

EPIS demostró que una ficha clínica **command-first** es deseable, pero la ejecución quedó condicionada por OpenMRS/O3, múltiples sistemas visuales y gobierno fragmentado. EPIS2 nace para conservar la visión y **eliminar las causas estructurales** de deriva.

---

## Errores estructurales (causa → gate EPIS2)

| # | Error en EPIS | Síntoma | Gate EPIS2 |
|---|---------------|---------|------------|
| 1 | OpenMRS/O3 como runtime visible o invisible acoplado | Home, rutas y datos ligados al SPA O3 | `no-legacy-dependencies` · `NON_GOALS` |
| 2 | Carbon + Soft Carbon + Material coexistiendo | Tres lenguajes visuales, CSS paralelo | Rechazo Carbon · solo MUI |
| 3 | Home derivando a dashboard / panel clínico | «¿Qué hacer?» perdido | `command-center-home` |
| 4 | Múltiples registries (comando, intent, formulario) | Rutas inconsistentes, duplicación | `single-command-registry` · `single-form-registry` |
| 5 | Documentación ≠ código ≠ runtime | Microfases «completas» sin producto | `ANTI_DRIFT_GATES` · reportes por fase |
| 6 | Demasiadas ramas y microfases paralelas | Main no reflejaba verdad canónica | Main canónico · una fase por sesión |
| 7 | Información no solicitada visible | Ruido clínico y técnico | Command-first · ocultamiento |
| 8 | IA e infra en superficie | Panel Ollama/RAG en home | `ai-write-boundary` · IA degradable |
| 9 | Permisos wildcard / admin.* | Riesgo de acceso ambiguo | `explicit-permissions` |
| 10 | Tests verdes sin journey humano | Producto no demostrable | `GOLDEN_CLINICAL_JOURNEY` |
| 11 | Migración masiva / copia de carpetas | Deuda arrastrada | `legacy-import-manifest.json` |
| 12 | Writeback y SoT dividida (OpenMRS + EPIS) | Borrador vs verdad confusa | PostgreSQL SoT · borradores separados |

---

## Lo que sí rescatar de EPIS

- Visión command-first y Centro de Comando.
- Command registry, resolver y blueprints (vía allowlist).
- Microcopy español y reglas por rol (reescritas).
- Fixtures sintéticos revisados.
- Aprendizajes de seguridad clínica y QA humano.

Ver `EPIS_DONOR_ALLOWLIST.md` y `legacy-import-manifest.json`.

---

## Frase guía

> Los errores de EPIS no son recuerdos: son gates de EPIS2.
