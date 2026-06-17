# MF-TRAMO-C-003/004 — Hospitalización hub + órdenes servicio

**Fecha:** 2026-06-07  
**Alcance:** Ficha paciente → ingreso/traslado/enfermería + enlace tablero servicio

---

## MF-TRAMO-C-003 — IDC 111 Done

- Sección `epis2-longitudinal-hospitalization` en ficha
- CTAs: ingreso (`/espacio/ingreso`), traslado, nota enfermería SBAR
- Quick actions: ingreso + traslado en `PatientWorkspacePage`
- Catálogo §7: ingreso y traslado **COMPLETE**
- E2E: `e2e/tramo-c-admission.spec.ts`
- Gate: `quality:tramo-c-admission-gate`

## MF-TRAMO-C-004 — Órdenes activas

- CTA `epis2-longitudinal-open-service-orders` → `/epis2/dashboard?tab=service`
- Catálogo §8: revisar órdenes **PARTIAL**
- Gate: `quality:tramo-c-orders-gate`

---

## Gates

| Gate | Resultado |
|------|-----------|
| check | pendiente sesión |
| test | pendiente sesión |
| tramo-c-admission | ✅ |
| tramo-c-orders | ✅ |

---

## Próximo paso

MF-TRAMO-C-005 tendencias resultados (IDC 164) · MF-TRAMO-C-006 epicrisis urgencias (IDC 110)
