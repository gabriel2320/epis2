# Reporte — Conciliación EPIS2 Clinical Material 3 (adaptativo)

**Fecha:** 2026-06-06  
**Alcance:** Documentación de diseño — sin cambios de código productivo  
**Entrada:** Propuesta ECM3 + Material adaptive guidance + estado M3-00…09

---

## Alcance

Conciliar la propuesta de **un único sistema visual para las 21 olas** con la implementación EPIS2 existente (`@epis2/epis2-ui`, workspaces, two-pane, matriz IDC).

---

## Entregables

| Artefacto | Ruta |
|-----------|------|
| Canon ECM3 conciliado | `docs/design/EPIS2_CLINICAL_MATERIAL3_CONCILIATION.md` |
| Gate M3-UI en canon olas | `docs/product/EPIS2_WAVE_EXECUTION_CANON.md` §10 |
| Enlace experiencia M3 | `docs/design/EPIS2_MATERIAL3_CLINICAL_EXPERIENCE.md` |

---

## Decisiones clave

1. **Nombre canónico:** EPIS2 Clinical Material 3 Design System (ECM3) = `@epis2/epis2-ui` + docs design.
2. **No estética por ola** — olas consumen patrones M3 ya definidos.
3. **M3-00…09 ya cerrados** — propuesta M3-0.1…0.12 mapeada; gaps: print productivo, visual regression CI, workspace `emergency`.
4. **Navegación:** 6 áreas IA → 5 workspaces + ficha transversal; analítica dentro de calidad/dashboard, no home.
5. **Color:** default institucional `calm-teal`; 6 MTB perfiles conservados; roles clínicos inmutables.
6. **Tipografía:** Inter (no Roboto Flex en esta fase).
7. **Clinical dense:** compact + tokens workspace UCI/urgencia — no tercer toggle usuario.
8. **M3 Expressive:** solo Comando, Login, empty states — alineado con propuesta y anti-patrones.

---

## Gates

| Gate | Resultado |
|------|-----------|
| `npm run check` | No aplicado (solo docs) |
| Contradicción invariantes | Ninguna — IA en supporting pane, no firma, home = comando |

---

## Riesgos

1. **Expectativa 6 paquetes npm** — hoy consolidado; split diferido puede confundir si no se lee §3 del canon.
2. **Workspace `emergency`** — conciliado en docs pero no en rail (Ola 10).
3. **Print themes** — norma escrita; gate M3-UI fallará en olas documentales hasta `Print*`.

---

## Próximo paso

1. Al iniciar **Ola 3**, validar gate M3-UI en MF de antecedentes (IDC 27–30).
2. Planificar **M3-0.12** visual regression en CI tras piloto humano.
3. Añadir workspace `emergency` al registry cuando arranque Ola 10 — mismo ECM3, densidad clinical dense.
