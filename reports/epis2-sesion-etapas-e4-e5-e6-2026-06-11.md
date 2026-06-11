# EPIS2 — Sesión Etapas E4 · E5 · E6 (Hilo C)

**Fecha:** 2026-06-11  
**Alcance:** Entrega C-2 (parcial) · sin tocar C-3b ni prod flag C-4  
**Evitar choques:** E4 solo `@epis2/epis2-ui` tema · E5 solo command/chart shell · E6 solo reporte/docs

---

## Etapa E4 — Octava paleta `clinical-calm`

### Entregables

| Artefacto | Estado |
|-----------|--------|
| `source/clinical-calm.material-theme.json` | ✓ seed `#0B5C66` |
| `generated/clinical-calm.ts` | ✓ `npm run theme:generate` |
| `Epis2ApprovedThemeId` + registry + `clinicalCalm` accent | ✓ 8/8 MTB |
| UI preferencias — chip «Petróleo calm premium» | ✓ |
| Tests `theme-generated` + `create-epis2-theme.mtb` | ✓ |

### Gates

| Gate | Resultado |
|------|-----------|
| `theme:generate` | PASS |
| `validate-material-theme` (implícito en generate) | PASS |
| `theme:validate` global | FAIL preexistente `no-hardcoded-colors` chart tokens |

---

## Etapa E5 — Barra comando unificada

### Cambios

| Superficie | Variante | testId |
|------------|----------|--------|
| Ficha dual (`ClinicalShell`) | `clinical-chart` | `epis2-chart-command-bar` |
| Censo `/espacio/buscar-paciente` | `census-search` | `epis2-census-command-bar` |
| Otras rutas /espacio con paciente | `clinical-chart` | `epis2-espacio-chart-command-bar` |

**Layout unificado:** `episUniversalCommandBarLayoutSx` — min 52px · radius 8px · `outlineVariant` · `surfaceContainerHigh`.

Legacy modos (`command-center`, `classic-contextual`, `dashboard-operational`) sin cambio visual.

### Gate

`validate-mode-safety-gate` actualizado — exige variantes `clinical-chart` y `census-search`.

---

## Etapa E6 — Signoff visual integrado (revisión)

### Matriz GO / NO-GO (post E1–E5)

| Eje | Criterio | Veredicto | Notas |
|-----|----------|-----------|-------|
| Forma traditional | Radios EMR ≤ 10px | **GO** | E3 `epis2ShapeProfiles` |
| 8 paletas MTB | Registry 8/8 | **GO** | E4 `clinical-calm` |
| Light/dark/contrast 8× | Tests MTB + manual high | **GO parcial** | high contrast: validar en UI manual |
| Barra comando 3 contextos | censo + traditional + paper | **GO** | E5 variantes + E2E existente |
| Dual shell C-4 | CI `e2e-dual-chart` | **GO** | E2 sesión previa |
| Calm Premium signoff completo | 6 capturas 6 superficies | **NO-GO** | Falta THEME-CALM-01 islas 20px fuera EMR + capturas |
| `theme:validate` hex chart | SoT tokens | **NO-GO** | Deuda — migrar `chart-modes-tokens` a roles |

### Veredicto integrado

**GO con notas** — listo para **C-3b** y cierre humano **C-1**; **C-2 signoff** pendiente islas Calm Premium (no bloquea datos clínicos).

---

## Próximo paso

1. **C-3b** — MF-CLINICAL-SUMMARY-B  
2. **E4 follow-up** — migrar hex `chart-modes-tokens` → roles tema (desbloquea `theme:validate`)  
3. **C-2.4** — capturas signoff Calm Premium 6 superficies

```bash
npm run check
npm run theme:generate
npm run quality:mode-safety-gate  # vía pm01
```
