# EPIS2 — Complemento golden-guardian (2026-06-11)

**Rol:** `golden-guardian` (complementario, solo lectura)  
**Alcance evaluado:** Hilo C · P1 revisión M3 · receta A5  
**Fuentes:** `docs/quality/GOLDEN_CLINICAL_JOURNEY.md` · `reports/dev-agent-brief.md` · `docs/quality/GOLDEN_M3_MATRIX.md` · `reports/archive/2026-06/epis2-hilo-c-p1-print-prescription-2026-06-09.md` · `reports/archive/2026-06/epis2-m3-visual-pass-2026-06-10.md` · `reports/archive/2026-06/epis2-ux-audit-visual-2026-06-10.md`

---

## 1. ¿El golden journey cubre P1 M3 y Hilo C receta A5?

### Veredicto resumido

| Ámbito | ¿Cubierto por golden journey? | Gate / evidencia correcta |
|--------|------------------------------|---------------------------|
| **P1 revisión M3** (hover/foco/rail/two-pane claro/oscuro) | **Parcial** — solo cadena evolución (pasos 1–9) | `quality:m3-human-pilot` · `quality:m3-visual-pass` · revisión humana de `reports/m3-visual-evidence/2026-06-10/` |
| **Hilo C receta A5** | **No** — fuera del journey canónico | `quality:ola6a-print-gate` · `npm run test:e2e:print` · `e2e/ola6a-print-prescription.spec.ts` |

### P1 — Revisión M3 post-captura

El journey dorado canónico define **9 pasos** centrados en **evolución**: login → comando → paciente demo → formulario `evolution_note` → borrador → aprobación → auditoría → retorno a `/comando`.

La matriz `GOLDEN_M3_MATRIX.md` (MF-184) mapea pasos a superficies M3 relevantes para P1 **en evolución** (M3-05 two-pane, Power Bar, approval gate).

**Lo que P1 pide y el golden journey no cubre:** hover/foco en rail dashboard, modos clásico/dashboard, preferencias; densidad/jerarquía estética; signoff humano V1–V6 completo.

Estado actual: capturas auto **PASS**; signoff humano **NO-GO** (`epis2-ux-audit-visual-2026-06-10.md`).

**Conclusión P1:** golden journey valida regresión funcional + M3 en evolución; **no sustituye** revisión humana P1 ni gates M3 dedicados.

### Hilo C — Receta A5

Entrega en `reports/archive/2026-06/epis2-hilo-c-p1-print-prescription-2026-06-09.md` — ruta `/espacio/receta/imprimir`, CTA print, preview vía `sessionStorage`.

**Fuera del alcance de `quality:golden-journey`**, que solo ejecuta vitest golden specs. Cobertura A5: `quality:ola6a-print-gate`, E2E print, tests unitarios.

**Conclusión Hilo C:** receta A5 cubierta por gates Ola 6A / print, no por golden journey canónico.

---

## 2. ¿`npm run quality:golden-journey` ahora?

**Recomendable** — no bloqueado por P1 ni Hilo C (capas distintas). Requiere `DATABASE_URL` + migrate.

**No basta solo** para signoff P1 M3 ni validación receta A5.

---

## 3. Checklist (7 ítems)

| # | Ítem | Estado | Acción |
|---|------|--------|--------|
| 1 | Journey evolución (1–9) alineado invariantes | ✓ | Mantener; no mezclar con print A5 |
| 2 | `quality:golden-journey` ejecutable | ✓ | Ejecutar en sesión golden-guardian |
| 3 | P1 M3 capturas V1–V6 | ✓ auto | Revisión humana pendiente |
| 4 | P1 hover/foco/rail/two-pane modos | ⚠ parcial | Re-signoff UX-AESTHETIC |
| 5 | Hilo C receta A5 E2E print | ✓ | `quality:ola6a-print-gate` |
| 6 | Matriz vs receta A5 | ⚠ gap | A5 fuera pasos 1–9 |
| 7 | `test:e2e:ux-g02` | pendiente | Ejecutar con golden-journey en cierre |

---

## 4. Próximo paso

1. `npm run quality:golden-journey` — baseline regresión evolución.
2. Paralelo Hilo C: `npm run quality:ola6a-print-gate`.
3. Cerrar P1 humano: PNG en `reports/m3-visual-evidence/2026-06-10/` → `quality:m3-human-pilot`.
4. No usar golden-journey como único gate P1 ni impresión A5.

---

## Riesgos

- CI golden-journey verde ≠ signoff M3 GO ≠ receta A5 validada.
- P1 bloqueante para demo estética, no para gates técnicos evolución/print.
