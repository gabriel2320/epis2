# EPIS2 — Inventario navegación tres modos (FASE 0)

**Fecha:** 2026-06-08  
**Microfase:** MF-THREE-MODES-01 (alias histórico: ~~MF-THREE-MODES-ORCHESTRATION~~)

## Rutas canónicas

| Ruta | Modo | Home |
|------|------|------|
| `/login` | gateway | no |
| `/comando` | command | **sí** |
| `/espacio/ficha?mode=classic` | classic | no |
| `/epis2/dashboard?mode=dashboard` | dashboard | no |

## Hallazgos

| Tema | Estado | Acción |
|------|--------|--------|
| Login → `/comando` | OK | Mantener |
| Classic access desde comando | Parcial | + dashboard access + mode switcher |
| Dashboard MD3 shell | OK | Conectar transiciones returnTo |
| Query `mode=classic\|dashboard` | Inconsistente en command navigate | Unificar en modeTransitions |
| ActivePatient sessionStorage | OK | EpisSessionContext lo referencia |
| Mode switcher global | Ausente | EpisModeSwitcher |
| Guard classic sin paciente | Débil | EpisModeGuard |
| Registries duplicados | No | OK |
| Preferencia modo | Parcial en userPreferences | EpisSessionContext |

## Próximo paso

Orquestador `apps/web/src/modes/` + session context + switcher en tres shells.
