# Tramo 3 — PROG-LEGAL-DISCLAIMER · MF-LEG-01

**Fecha:** 2026-06-16 · **Programa:** PROG-POST-RC3 · **Gate:** `quality:legal-disclaimer-gate`

---

## Alcance MF-LEG-01

Checklist revisión humana para `DISCLAIMER.md`, `SECURITY.md`, `LICENSE`, `CONTRIBUTING.md`.

| Entrega | Ruta |
|---------|------|
| Checklist | `docs/legal/EPIS2_LEGAL_REVIEW_CHECKLIST.md` |
| Gate | `scripts/quality/validate-legal-disclaimer-gate.mjs` |

**Prohibido en MF-LEG-01:** editar `DISCLAIMER.md` a v1.1 (reservado MF-LEG-02 post sign-off).

---

## Verificación

```bash
npm run quality:legal-disclaimer-gate
npm run quality:fast
```

---

## Pendiente — MF-LEG-02

1. Operador completa checklist §5 (sign-off humano).
2. Actualizar `DISCLAIMER.md` → v1.1 con fecha y revisor.
3. PR con comentario legal explícito · **no** auto-merge IA.
4. Opcional: `EPIS2_LEGAL_V11_APPROVED=1` en gate CI tras merge.

---

## Próximo tramo

**Tramo 4 — PROG-DEPS-HYGIENE:** triage Dependabot (#5 Zod 4 defer, batch devDeps).
