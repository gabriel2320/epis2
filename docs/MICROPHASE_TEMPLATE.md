# EPIS2 — Plantilla de microfase

Copiar esta plantilla a `reports/epis2-NN-<nombre>.md` al cerrar cada fase.

---

## Metadatos

```yaml
id: EPIS2-NN
title: <título corto>
status: in_progress | completed | blocked
depends_on: EPIS2-<N-1>
blocks: EPIS2-<N+1>
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
