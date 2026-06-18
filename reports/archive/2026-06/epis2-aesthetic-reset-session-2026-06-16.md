# PROG-AESTHETIC-RESET — Sesión MF-AEST-01 + MF-AEST-03 (foundation)

**Fecha:** 2026-06-16  
**Alcance:** Cirugía composicional — sin lógica clínica nueva  
**Programa:** [`docs/product/EPIS2_AESTHETIC_RESET_PROGRAM.md`](../docs/product/EPIS2_AESTHETIC_RESET_PROGRAM.md)

---

## Entregado

### MF-AEST-01 — Densidad de acciones

| Artefacto | Cambio |
|-----------|--------|
| `EpisPrimaryActionBar` | Patrón canónico: 1 primaria + 2 secundarias + menú «Más» |
| `EpisClinicalFormActionBar` | Delega en `EpisPrimaryActionBar` |
| `ClinicalActionBar` | Elimina fila mobile duplicada; acciones en overflow |
| `uiDensityRules.ts` | `EPIS_MAX_VISIBLE_*` constants |
| Gate | `quality:aesthetic-action-density-gate` ✓ |

### MF-AEST-03 — Modo papel exclusivo

| Artefacto | Cambio |
|-----------|--------|
| Ruta | `/espacio/ficha/papel?patientId=&paperDate=` |
| `StandalonePaperChartPage` | Pantalla completa, canvas calm |
| `PaperDayNavBar` | ← Día anterior · Hoy · Día siguiente → |
| `DualChartPatientPage` | Redirige paper → standalone; ya no embebe `PaperChartMode` |
| Gate | `quality:paper-mode-standalone-gate` ✓ |

### Gates compuestos

- `quality:aesthetic-reset-close` ✓ (MF-AEST-01 + MF-AEST-03 + ui-density + duplicate-actions)

---

## Pendiente (próximos PRs)

| MF | Contenido |
|----|-----------|
| MF-AEST-02 | Ficha clásica tabulada (Resumen/Evoluciones/…) |
| MF-AEST-04 | Default `clinical-calm` |
| MF-AEST-05 | Breadcrumb + volver a ficha en formularios |
| MF-AEST-06 | Gates restantes + signoff humano rc4 |

---

## Verificación

```bash
npm run quality:gate -- quality:aesthetic-reset-close
npm run check
```

E2E actualizado: `ux-lab-autopilot-mode-a.spec.ts` acepta URL `/espacio/ficha/papel`.

---

## Riesgo

- `PaperDocumentToolbar` en modo standalone aún muestra múltiples acciones — siguiente paso MF-AEST-01 tramo 2.
- MF-AEST-02 no iniciado: ficha tradicional sigue composición previa.

---

*PASS WITH FIXES — funcional intacto; percepción visual mejora con papel exclusivo.*
