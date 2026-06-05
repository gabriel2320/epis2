# EPIS2 — Gates anti-deriva Material 3 Clinical

**Fase:** M3-00 · Complementa `MUI_ANTI_DRIFT_GATES.md` y `ANTI_DRIFT_GATES.md`

Los gates MUI (MUI-G01…G15) siguen vigentes para la capa técnica MUI/MUI X. Los gates M3 gobiernan **experiencia visual, expresividad y adaptación clínica**.

---

## Gates obligatorios M3

| ID | Gate | Falla si… | Verificación |
|----|------|-----------|--------------|
| M3-G01 | Un solo generador de tema | Más de un `createTheme` / `createEpis2Theme` productivo | Grep + lint (M3-02) |
| M3-G02 | Roles clínicos inmutables | Personalización de acento altera draft/critical/approved/warning | Test tema (M3-08) |
| M3-G03 | Sin decoración con semántica clínica | Colores críticos usados en chips decorativos o fondos neutros | Revisión PR |
| M3-G04 | Información no solicitada | Pantalla muestra paneles/widgets sin acción del usuario | UX review + M3-06 |
| M3-G05 | Home = Centro de Comando | Dashboard o legacy como home | `command-center-home` (existente) |
| M3-G06 | Expressive prohibido en crítico | Animación expressive en error, aprobación, alerta seguridad | Revisión motion tokens |
| M3-G07 | Layout adaptativo | Ruta principal sin comportamiento documentado compacto/expandido | Checklist M3-06 |
| M3-G08 | Estados multi-indicador | Estado crítico solo color (sin icono/texto/forma) | Revisión componentes |
| M3-G09 | Copy clínico en español | UI visible en inglés | `spanish-visible-copy` (existente) |
| M3-G10 | Estados loading/error/empty | Componente de lista/form sin los tres | Checklist PR |
| M3-G11 | Sin import MUI directo | `@mui/*` en `apps/web` | `no-direct-mui-imports` (existente) |
| M3-G12 | Identidad EPIS2, no copia Google | Marca genérica «Material demo» sin contexto clínico | Revisión diseño |
| M3-G13 | Una acción primaria | Más de una acción primaria filled compitiendo en mismo viewport | Revisión pantalla |
| M3-G14 | Personalización no altera seguridad | Usuario oculta safety bar, warnings o permisos UI | Test preferencias |
| M3-G15 | Modo tablero secundario | Tablero sin «Volver al Centro de Comando» | Test E2E (existente) |

---

## Lista de fallo rápido (CI / revisión)

El proyecto debe **fallar revisión** si:

```text
- existe más de un generador de tema;
- se usan colores clínicos críticos como decoración;
- una pantalla muestra información no solicitada;
- el dashboard vuelve a ser home;
- una animación crítica usa esquema expressive;
- un estado depende solo del color;
- una ruta no adapta su layout (sin excepción documentada);
- aparece copy clínico en inglés;
- existe un componente sin estado vacío, carga y error;
- se importan componentes MUI directamente fuera de epis2-ui;
- se crea apariencia «Google» sin identidad EPIS2;
- una personalización modifica semántica clínica;
- una pantalla presenta más de una acción primaria.
```

---

## Integración CI (roadmap)

| Fase | Automatización |
|------|----------------|
| M3-00 | Gates manuales; baseline en reporte |
| M3-02 | M3-G01 grep `createTheme` fuera de `epis2-ui/theme` |
| M3-08 | Test unitario acento vs clinical-roles |
| M3-09 | Bundle budget; MUI-G13 bundle; licencias MUI X |

---

## Checklist PR (UI M3)

```markdown
- [ ] Tratamiento M3 documentado (Standard vs Expressive) para la pantalla
- [ ] Sin expressive en alertas/aprobación/errores críticos
- [ ] Estados con ≥2 indicadores si son críticos o de seguridad
- [ ] Una acción primaria por viewport
- [ ] Layout probado compacto + expandido
- [ ] Copy desde @epis2/design-system/copy
- [ ] loading / error / empty
- [ ] prefers-reduced-motion respetado
- [ ] Golden journey afectado ejecutado
```

---

## Frase guía

> Material 3 humaniza; EPIS2 no negocia precisión clínica por decoración.

---

## Referencias

- `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md`
- `docs/design/M3_ADOPTION_PLAN.md`
- `docs/quality/MUI_ANTI_DRIFT_GATES.md`
