# MF-DI-03 — Autocompletado con ranking de frecuencia

**Fecha cierre:** 2026-06-11 · **Programa:** PROG-DETERMINISTIC-INTELLIGENCE-2026  
**Gate:** `npm run quality:di-autocomplete-gate` ✓ · `npm run check` ✓

---

## Alcance

Ranking determinístico institucional + personal para medicamentos (catálogo), laboratorio y diagnósticos (barra de comandos). El uso personal se acumula en memoria operacional (MF-DI-02).

## Entregables

| Artefacto | Descripción |
|-----------|-------------|
| `catalogFrequencyRank.ts` | Algoritmo rank + pesos demo institucionales |
| `medicationRank.ts` | API catálogo medicamentos ranked |
| `catalogUsage` en operational memory | Contadores por dominio |
| `POST /api/user/operational-memory/catalog-usage` | Bump al seleccionar |
| `MedicationCatalogAutocomplete` | Ranking API + registro uso |
| `filterClinicalCommandAutocomplete` | Ranking lab/dx en barra |
| `quality:di-autocomplete-gate` | Gate MF-DI-03 |

## Gates

```bash
npm run quality:di-autocomplete-gate
npm run check
```

## Próximo paso

**MF-DI-07** o **MF-DI-08** según `npm run quality:di-next` (PROG-DI-MEMORY cerrado).

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
