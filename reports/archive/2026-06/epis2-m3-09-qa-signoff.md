# EPIS2 M3-09 — Signoff QA Material 3 Clinical

**Fecha:** 2026-06-05 · **Estado:** signoff completado

---

## Gates automáticos

| Gate | Resultado |
|------|-----------|
| Tests | **182** OK |
| `architecture:validate` | OK (`single-epis2-theme` incluido) |
| `npm run qa:bundle-analyze` | OK — ver presupuestos abajo |

---

## Checklist M3-09

| Ítem | Evidencia | Estado |
|------|-----------|--------|
| Prueba 3 s — Power Bar en `/comando` | Panel paciente colapsado por defecto; prompt → Power Bar → toggle contexto (`CommandCenterPage.test.tsx`) | ✓ |
| Teclado — Login | Tab: usuario → clave → submit (`LoginPage.test.tsx`) | ✓ |
| Lector de pantalla — alertas críticas | `role="alert"` + mensaje + detalle; icono MUI Alert (`ClinicalAlertsPanel.test.tsx`) | ✓ |
| Contraste WCAG AA — `critical`, `approved` | Ratio ≥ 4.5:1 (`clinical-roles.contrast.test.ts`) | ✓ |
| `prefers-reduced-motion` | `buildEpis2Components('reduced')` sin transiciones (`components.motion.test.ts`); aprobación/errores sin motion expressive | ✓ |
| Bundle analyze + presupuestos | `npm run qa:bundle-analyze` → `reports/epis2-m3-09-bundle-budget.md` | ✓ |

---

## Presupuestos MUI X (gzip)

| Chunk | Medido | Límite | Estado |
|-------|--------|--------|--------|
| `mui-x-grid` | 98.3 KB | 150 KB | OK |
| `mui-x-charts` | 60.7 KB | 120 KB | OK |
| `mui-x-other` | 11.9 KB | 100 KB | OK |
| `mui-x-scheduler` | 77.7 KB | 200 KB | OK (solo `/dev/scheduler-spike`) |

Reporte visual local (no versionado): `apps/web/dist/bundle-stats.html` tras `npm run qa:bundle-analyze`.

---

## Observaciones

1. **Lazy MUI X:** barrel principal solo `*Suspense`; subpaths `data|charts|tree` para tests; catálogo dev lazy — sin warnings static+dynamic Vite.
2. **Modo oscuro:** activo en Centro de Comando (`EpisThemeModeToggle`) y catálogo M3-08; persiste en `localStorage`.
3. **Teclado Comando → formulario:** cubierto por golden journey existente; tab order específico de formularios en journey E2E.

---

## Próximo paso

Piloto clínico con feedback de modo oscuro; evaluar presupuesto `mui-core` (+ date pickers) si entry supera 130 KB gzip.
