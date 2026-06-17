# PROG-FICHA-FIRST — Cierre Ola 1 (Activación)

**Programa:** PROG-FICHA-FIRST-2026  
**Fecha:** 2026-06-14  
**Gate:** `npm run quality:ficha-first-gate`

## MF cerradas

| MF | Entrega |
|----|---------|
| MF-FF-01 | Dual chart ON por default |
| MF-FF-02 | Home = `/espacio/buscar-paciente` |
| MF-FF-03 | `/comando` redirect compat |
| MF-FF-06 | ClinicalShell + barra transversal en `/espacio/*` |

## Flujo activo

```text
Login → censo (barra transversal)
     → ficha clásica | ficha papel
     → formularios con misma barra
/comando → redirect
```

## Evidencia

| Artefacto | Estado |
|-----------|--------|
| `quality:ficha-first-gate` | ✓ |
| [`epis2-mf-ff-01-03-ficha-first.md`](epis2-mf-ff-01-03-ficha-first.md) | ✓ |
| [`epis2-mf-ff-06-clinical-shell-forms.md`](epis2-mf-ff-06-clinical-shell-forms.md) | ✓ |

## Siguiente

**MF-FF-00** — Conciliar canon censo-first (Ola 2)

```bash
npm run quality:ficha-first-next
```
