# Legacy scripts — snapshot pre-consolidación

**Fecha:** 2026-06-15 · **Programa:** PROG-CONSOLIDATE Fase 0

| Archivo | Contenido |
|---------|-----------|
| `package-before-consolidation.json` | Copia íntegra de `package.json` raíz antes de Fase 1 |
| `scripts-classification.csv` | Clasificación generada por `npm run tool:scripts:classify` |

No borrar hasta completar Fase 2–3 de descongestión.

Recuperar un comando:

```bash
node -e "const p=require('./package-before-consolidation.json'); console.log(p.scripts['NOMBRE'])"
```
