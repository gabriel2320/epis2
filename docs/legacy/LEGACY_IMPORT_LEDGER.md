# EPIS2 — Ledger de importaciones legacy

Registro humano de cada extracción desde EPIS. Fuente de verdad estructurada: `legacy-import-manifest.json`.

---

## Cómo registrar

| Campo | Descripción |
|-------|-------------|
| ID | `IMP-YYYYMMDD-NNN` |
| Fuente | Ruta en `../Epis` |
| SHA | Commit o blob SHA del donante |
| Destino | Ruta EPIS2 |
| Modo | `rewrite` \| `extract` \| `reference` |
| Motivo | Por qué se importa |
| Responsable | Persona o agente |
| Tests | Archivos de test que cubren el port |

---

## Importaciones

| ID | Fuente | Destino | Modo | Fecha | Tests | Estado |
|----|--------|---------|------|-------|-------|--------|
| — | — | — | — | — | — | *Sin importaciones aún* |

---

## Reglas

- No marcar «hecho» sin entrada en manifiesto.
- No borrar filas; usar estado `reverted` si se deshace.
- Revisar allowlist antes de abrir PR.
