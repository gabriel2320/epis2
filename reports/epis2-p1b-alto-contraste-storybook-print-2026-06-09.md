# P1b — Alto contraste ampliado + Storybook familia Print*

**Fecha:** 2026-06-09 · **Alcance:** auditoría 3.6 (diferida en Fase 3) + recomendación Auditoría II §5 · solo `packages/epis2-ui` (tema + stories) — sin tocar SoT, API ni rutas

## 1. Alto contraste ampliado (auditoría 3.6)

Antes: `contrast: 'high'` solo subía `fontWeight` del cuerpo. Ahora cubre los tres frentes señalados por la auditoría — **outline + `onSurfaceVariant` + foco** — sin inventar colores fuera del esquema MTB aprobado:

| Frente | Implementación |
|---|---|
| Jerarquía secundaria | `applyHighContrastRoles()` en `create-epis2-theme.ts`: cada rol sube un nivel hacia `onSurface` — `onSurfaceVariant → onSurface`, `outline → onSurfaceVariant`, `outlineVariant → outline` |
| Palette MUI | `text.secondary` y `divider` siguen a las superficies reforzadas (ambos paths: MTB y legacy) |
| Identidad visual | `buildVisualIdentity` recibe las superficies ya reforzadas → bordes de power bar etc. también suben |
| Foco | `buildEpis2Components(motion, contrast)`: con `high`, CssBaseline agrega `*:focus-visible { outline: 3px solid text.primary; outline-offset: 2px }` — indicador universal visible sobre cualquier superficie |

Decisiones:

- **Sin colores nuevos**: la rotación de roles reutiliza el esquema aprobado — los roles clínicos protegidos (`theme.epis2.clinical.*`) no se tocan (verificado por test existente).
- El toggle ya existía en `EpisAppearancePreferencesPanel` (`epis2-contrast-high`) — el cambio llega al usuario sin UI nueva.
- Tipografía reforzada (fontWeight 500) se mantiene como estaba.

Tests nuevos en `create-epis2-theme.contrast.test.ts`: rotación de roles verificada contra el tema estándar, palette siguiendo superficies, superficies base intactas, regla `*:focus-visible` presente solo en `high`.

## 2. Storybook familia Print* (Auditoría II §5)

| Story | Contenido |
|---|---|
| `PrintLetterDocument.stories.tsx` (nuevo) | `EpicrisisDemo` — Carta con `status` BORRADOR, 3 `PrintSection` + `PrintField`, pie · `SinEstadoNiPie` — nota de evolución mínima |
| `PrintA5Document.stories.tsx` (ampliado) | + `RecetaDemo` · + `OrdenLaboratorioUrgente` con prioridad como **texto explícito** (norma §16.2 — nunca solo color) |

Cobertura Storybook de la familia print: las 4 primitivas implementadas (`PrintA5Document`, `PrintLetterDocument`, `PrintSection`, `PrintField`) quedan visibles en `Impresión/` con datos sintéticos.

## Gates

| Gate | Estado |
|---|---|
| `npx vitest run packages/epis2-ui/src/theme` | ✓ 52/52 |
| `npm run storybook:ui:build` | ✓ |
| `npm run check` | ✓ |
| `npm run test` | ✓ (ver nota suite) |

## Riesgos / pendiente

- **Signoff visual humano pendiente** (por eso P1b estaba diferido): revisar alto contraste en `/comando` y formularios con `npm run dev` → panel apariencia → Contraste alto, en claro y oscuro. El foco 3px puede percibirse intrusivo en flujos densos — criterio clínico decide.
- El anillo de foco universal aplica a todo elemento focuseable; si algún componente ya dibuja su propio indicador (inputs con borde 2px), conviven ambos — aceptable en modo accesibilidad, no en estándar (donde no se activa).

## Próximo paso exacto

Signoff visual de alto contraste (humano) · luego P1c — checklist pre-producción (solo si sale del laboratorio).
