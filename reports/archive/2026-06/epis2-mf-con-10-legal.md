# MF-CON-10 — Legal / público (raíz repo)

**Fecha:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE ola 2

## Alcance

Documentación legal mínima en raíz del monorepo (revisión humana recomendada).

## Archivos creados

| Archivo | Propósito |
|---------|-----------|
| `LICENSE` | MIT + referencia a DISCLAIMER |
| `DISCLAIMER.md` | No uso clínico real · solo sintéticos · sin PHI |
| `SECURITY.md` | Reporte responsable · alcance demo |
| `CONTRIBUTING.md` | SDEPIS2 · gates · reglas canon |

## Gate

`monorepo-governance` valida presencia de los cuatro archivos en `architecture:validate`.

## Revisión humana pendiente

- Confirmar licencia MIT vs. política institucional.
- Ajustar contacto en `SECURITY.md` si se publica ampliamente.
- Validar texto DISCLAIMER con asesoría legal antes de uso comercial.

## Gates ejecutados

```bash
npm run quality:fast
npm run architecture:validate
```

## Próximo paso

Cierre PROG-CONSOLIDATE ola 2 · reporte de sesión consolidación.
