# EPIS2 — Wire híbrido Centro de Comando (Mockup A + dock + registry)

**Fecha:** 2026-06-04 · **Alcance:** Vista 1 ampliada sin panel derecho fijo

---

## Composición

| Zona | Componente | Fuente |
|------|------------|--------|
| Hero | `EpisCommandCenterHero` | Título display, flujo, contexto, chips, cards |
| Contexto | `CommandCenterContextLine` | Paciente activo / buscar |
| Sugerencias | `getCommandCenterWireSuggestions` | `@epis2/command-registry` |
| Bloques | `CommandCenterMinimalBlocks` | ≤4 bento (sin cambio) |
| Entrada | `EpisFloatingCommandDock` `compact` | Dock inferior (Power Bar) |

---

## Gates

| Gate | Resultado |
|------|-----------|
| UX-G01 | Hero + bento ≤4 + dock |
| M3-G04 | Sin panel clínico fijo derecho |
| M3-G13 | Una filled en dock (Continuar) |
| LAYOUT-G12 | Cards con borde único, sin Paper anidado |

---

## Verificación

```bash
npm run test -- --run apps/web/src/pages/CommandCenterPage.test.tsx
npm run test:e2e:ux-g02
```

---

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
