# EPIS2 — Resumen clínico MD3 (Fase A)

> Alcance: ficha paciente en **modo clásico MD3**. Home sigue siendo Centro de Comando.  
> Estética objetivo: [`EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md`](./EPIS2_CLINICAL_CALM_PREMIUM_PLAN.md) — tramos **UX-CALM-PATIENT** + **P3**.

## Objetivo

Responder en **≤2 scrolls** las preguntas clínicas habituales al abrir una ficha:

1. ¿Qué pasa **ahora**? (eventos recientes, pendientes, alertas, alergias)
2. ¿Cuál es el **contexto**? (problemas, medicación, labs, timeline reciente)

## Composición

```
┌─────────────────────────────────────────────────────────┐
│ Header: avatar + nombre + meta + chips alergia/alerta   │
├──────────┬──────────────────────────────┬───────────────┤
│ Nav      │  Grid resumen (main)         │ Supporting    │
│ lateral  │  ┌─ Ahora ─────────────┐     │ Longitudinal  │
│          │  │ tarjetas 2 col     │     │ (≥1280px)     │
│          │  └─ Contexto ────────┘     │               │
│          │  Acciones rápidas (text)   │               │
├──────────┴──────────────────────────────┴───────────────┤
│ Dock: comando + estado                                  │
└─────────────────────────────────────────────────────────┘
```

## Componentes

| Componente | Rol |
|------------|-----|
| `EpisClinicalSummaryCard` | Tarjeta MD3: título, meta/timestamp, cuerpo, CTA opcional, severidad |
| `PatientClinicalSummaryGrid` | Orquesta secciones **Ahora** / **Contexto** + alertas críticas live |
| `ClinicalSummaryStickyBanner` | Banner sticky chips críticos + alergias (C-3b) |
| `clinicalSummaryData` | Partición medicación 3 zonas · labs · alergias estructuradas |
| `EpisClassicMd3PatientHeader` | Avatar iniciales + identidad compacta |

### Pulido estético pendiente (Calm Premium)

| Aspecto | Objetivo | Tramo |
|---------|----------|-------|
| Tarjetas | Borde `outlineVariant`, radius 20px, sin sombra (`surface=calm`) | UX-AESTHETIC P3 ✓ |
| Banner | Sticky, chips críticos + alergias (`ClinicalSummaryStickyBanner`) | UX-CALM-PATIENT ✓ C-3b |
| Fondo app | `#F7F9FC` vía tema | THEME-CALM-01 |
| Iconos por tarjeta | Material Symbols Outlined | UX-CALM-PATIENT |
| Labs destacados | Valor grande + meta temporal | MF-CLINICAL-SUMMARY-B ✓ C-3b |

## Datos

- `clinicalContext.summaryFields` — texto demo por campo (`demoCases.ts`)
- `PatientLongitudinalResponse` — alergias, problemas, timeline estructurados
- `ClinicalAlert[]` — CDS/CDR en vivo (severidad `critical` → tarjeta destacada)

## CTAs por tarjeta

| Tarjeta | Acción |
|---------|--------|
| Alertas críticas (live) | Abrir evolución / nota |
| Alergias | Registrar / gestionar |
| Borradores | Revisar primer borrador |
| Problemas | Registrar problema |
| Timeline preview | Abrir supporting pane (línea de tiempo) |
| Labs | Bandeja de resultados |

## Entrega C-3b (MF-CLINICAL-SUMMARY-B) ✓

- Medicación 3 zonas: activa / PRN / suspendida (`partitionMedicationZones`)
- Labs destacados con valor tipográfico grande + timestamp
- Alergias con severidad estructurada (`formatAllergyLine`)
- Banner sticky con chips críticos + alergias
- Storybook: `Ficha/Resumen clínico MD3` → `GridScaffold`

## Fuera de alcance (Fases B–D)

- Cola de firma transversal (medicación 3 zonas ya en C-3b)
- Cola de firma transversal
- Timeline filtrado por tipo
- Re-signoff visual piloto

## Invariantes respetados

- Home ≠ ficha resumen
- PostgreSQL SoT; tarjetas muestran datos aprobados + alertas informativas
- IA no aprueba ni firma
- Sin segundo registry ni imports EPIS sin manifiesto

## Verificación

```bash
npx vitest run apps/web/src/components/clinical-summary/PatientClinicalSummaryGrid.test.tsx
npm run check
```

Revisión humana: abrir `/espacio/ficha?patientId=…` en modo clásico (`preferencias-apariencia`).
