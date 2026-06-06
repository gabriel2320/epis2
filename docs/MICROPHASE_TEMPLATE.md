# EPIS2 — Plantilla de microfase

Copiar esta plantilla a `reports/epis2-mf-XXX-<nombre>.md` al cerrar cada microfase del programa post-MVP.

Ledger: `docs/quality/microphase-ledger.json` · Comando: `npm run quality:microphase-next`

---

## Metadatos

```yaml
id: MF-XXX
title: <título corto>
state: DONE | BLOCKED | READY | IN_PROGRESS
depends_on: [MF-YYY]
ledger: docs/quality/microphase-ledger.json
```

---

## Objetivo

Un párrafo: qué demuestra esta fase y qué **no** incluye.

---

## Archivos permitidos

```text
# Listar paths o globs explícitos
apps/api/src/modules/drafts/**
```

---

## Archivos prohibidos

```text
# Ejemplo
../Epis/**
openmrs/**
**/*carbon*
```

---

## Entregables

- [ ] …
- [ ] …

---

## Gates

| Gate | Estado | Evidencia |
|------|--------|-----------|
| … | pass/fail | comando o enlace test |

---

## Pruebas

```bash
# comandos ejecutados
npm run test -- <scope>
```

---

## Criterio de parada

Condiciones bajo las cuales **no** se avanza:

- …

---

## Decisiones tomadas

| ID | Decisión | Motivo |
|----|----------|--------|
| … | … | … |

---

## Riesgos / deuda

- …

---

## Commit sugerido

```text
feat(epis2-NN): <mensaje imperativo, 1 línea>

<cuerpo opcional: qué, por qué, gates>
```

---

## Siguiente paso exacto

```text
Ejecutar solo EPIS2-<N+1>: <título>
No avanzar a EPIS2-<N+2>.
```
