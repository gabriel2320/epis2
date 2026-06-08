# EPIS2 — MF-UI-DENSITY Audit (2026-06-07)

**Alcance:** MF-UI-00 audit + MF-UI-01 simplificación `/comando`  
**Canon:** sin nuevas pantallas, sin árbol paralelo, home = `/comando`

---

## Diagnóstico confirmado

El crecimiento por tramos (UX/CE + acercamiento mockup) había **multiplicado superficies** en `/comando`:

| Problema | Causa | Severidad |
|----------|-------|-----------|
| Scroll vertical excesivo | Hero + 5 chips + 4 tarjetas + actividad + contexto + notas IA/seguridad | Alta |
| Sensación dashboard | Tarjetas sugeridas + bento/actividad + meta chips rol/IA | Alta |
| Iconos decorativos | Bolt, AutoAwesome, Lock, iconos por chip, iconos por fila | Media |
| Duplicación semántica | Chips rápidos **y** tarjetas con mismo registry | Alta |
| Rail visible en home | Compite con pantalla Tipo A (decisión) | Media |

**Conclusión:** el problema no era falta de UI sino **presupuesto visual no aplicado**.

---

## Presupuesto MF-UI-DENSITY (aplicado en código)

```txt
/comando (Tipo A — decisión):
  máx. 4 chips sugeridos
  0 tarjetas grandes
  máx. 5 filas “Continuar trabajo”
  1 barra de comando
  0 panel derecho
  rail oculto
  contexto paciente solo si hay paciente activo
  iconos: solo búsqueda en barra + chevron en lista
```

Constante: `COMMAND_CENTER_DENSITY` en `packages/command-registry/src/chips.ts`.

---

## Cambios MF-UI-01 (implementados)

| Archivo | Cambio |
|---------|--------|
| `chips.ts` | `COMMAND_CENTER_DENSITY`; `cardChips` vacío por defecto; `richCards` opt-in dev |
| `EpisCommandCenterHero.tsx` | Chips texto sin iconos; sin tarjetas; sin notas pie; spacing reducido |
| `EpisCommandCenterInlineBar.tsx` | Sin iconos decorativos (⚡, ⌘K, IA) |
| `CommandCenterPage.tsx` | `railHidden`, `maxWidth={720}`, sin meta chips, contexto condicional, 1 botón paciente |
| `CommandCenterRecentActivity.tsx` | “Continuar trabajo”, máx. 5 filas, sin iconos de fila |

---

## Pantallas auditadas — pendientes MF-UI-02…06

| Pantalla | Scroll | ActionBar | Duplicación | Prioridad |
|----------|--------|-----------|-------------|-----------|
| `/comando` | **Mejorado** | N/A | **Reducida** | MF-UI-01 ✓ |
| `/espacio/ficha` | Revisar | Dock compacto | Rail + dock | MF-UI-04 |
| `/espacio/evolucion` | Formulario largo | `EpisClinicalFormActionBar` | Two-pane footer | MF-UI-05 |
| `/espacio/farmacia` | Medio | ActionBar | Pre Tramo J | MF-UI-04 |
| `/epis2/dashboard?tab=*` | Alto en tabs | Varias | Cards por tab | MF-UI-04 |
| `/espacio/borrador/$id` | Medio | Aprobar duplicado? | Revisar | MF-UI-02 |

---

## Gates añadidos

```bash
npm run quality:command-center-layout-gate
npm run quality:ui-density-gate
```

---

## Riesgos antes de Tramo J (Farmacia 161–170)

1. **Dashboard tabs** siguen densos — farmacia no debe añadir cards antes de MF-UI-04.
2. **`EpisClinicalFormActionBar`** existe pero no hay shell `100dvh` unificado aún.
3. **Formularios largos** sin acordeones sistemáticos (MF-UI-05).
4. **Mockup vs densidad:** `richCards: true` reservado para Storybook; no reactivar en producción.

---

## Próximo paso exacto

```txt
MF-UI-02 — auditar GeneratedClinicalFormPage + DraftReviewPage (ActionBar única)
MF-UI-04 — EpisClinicalWorkspaceShell (scroll interno, header compacto)
MF-UI-06 — duplicate-actions-gate + icon-budget-gate
→ recién Tramo J farmacia
```

---

## Frase guía

> EPIS2 no necesita más UI; necesita menos superficie, más intención y una única acción clínica dominante por contexto.
