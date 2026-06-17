# EPIS2 UX-LAB Autopilot

Bot de auditoría Modo A (Ollama off). **No mergea. No taguea rc4.**

## Uso

```bash
npm run stack:dev   # recomendado
npm run quality:gate -- quality:ux-lab-autopilot
```

Modos registrados en catálogo:

| Gate | Modo |
|------|------|
| `quality:ux-lab-autopilot` | `audit-only` (fase A) |
| `quality:ux-lab-autopilot-pr` | `pr-candidate` (diferido) |

## Artefactos

- `reports/ux-lab-autopilot/run-YYYY-MM-DD.md`
- `reports/ux-lab-autopilot/walkthrough-result.json`
- `reports/ux-lab-autopilot/screenshots/` (local, no commitear por defecto)

Veredicto: `GO-CANDIDATE` o `NO-GO` — requiere signoff humano para rc4.
