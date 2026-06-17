# EPIS2 — Rebaseline plan visual Material 3 Clinical

**Fecha:** 2026-06-04 · **Decisión:** adoptar M3 + M3 Expressive controlado como referencia oficial de experiencia

---

## Contexto

Tras completar **MUI-01…MUI-10** (wrappers, MUI X, modo tablero, spike Scheduler), el siguiente trabajo técnico planificado (**MUI-11**: bundle y CI) se **reencuadra** dentro del roadmap **M3-09**.

Material UI no implementa Material 3 de forma nativa; EPIS2 interpretará M3 vía tema propio, variables CSS y overrides en `@epis2/epis2-ui`.

---

## Contrato visual

```text
EPIS2 Material 3 Clinical

Material 3     → lenguaje visual
Material UI    → base React
@epis2/epis2-ui → implementación clínica
```

**Regla:** M3 Standard en trabajo clínico; M3 Expressive solo para orientar, simplificar y humanizar (Login, Comando, empty states) — nunca en errores críticos, aprobación o seguridad.

---

## Documentos creados / actualizados

| Documento | Rol |
|-----------|-----|
| `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` | Especificación completa M3 Clinical |
| `docs/design/M3_ADOPTION_PLAN.md` | Roadmap M3-00…M3-09 |
| `docs/quality/M3_ANTI_DRIFT_GATES.md` | Gates M3-G01…G15 |
| `docs/design/EPIS2_THEME_SPEC.md` | Enlace a evolución M3 |
| `docs/design/MUI_X_ADOPTION_PLAN.md` | Nota de convivencia M3 / MUI X |
| `docs/design/EPIS2_UI_ARCHITECTURE.md` | Principio M3 añadido |

---

## Mapa MUI → M3

| Hecho (MUI) | Próximo paso M3 |
|-------------|-----------------|
| Tema `epis2Theme` | M3-01 roles + M3-02 `createEpis2Theme` |
| Login + Comando | M3-04 re-skin Expressive |
| Formularios clínicos | M3-05 Standard documento |
| Grids / charts / tree | M3-06–07 adaptación + densidad |
| Dashboard shell | M3-07 tablero secundario |
| Scheduler spike | Sin cambio hasta LIC-007 APPROVED |
| MUI-11 bundle/CI | M3-09 |

---

## Fase activa: M3-00

**Entregable siguiente:** `reports/epis2-m3-00-baseline-audit.md` (inventario visual + ruido + comprensión Comando).

**No iniciar cambios de tokens en código** hasta cerrar M3-00.

---

## Referencias externas

- [Material Design 3](https://m3.material.io/)
- [MUI — Material UI overview](https://mui.com/material-ui/getting-started/) (MD2 base)
- [MUI CSS theme variables](https://mui.com/material-ui/customization/css-theme-variables/overview/)
