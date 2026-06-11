# EPIS2 — Brief sesión PROG-DUAL-CHART

> Generado: 2026-06-11 · `npm run dev:dual-chart:session`

## Alcance SDEPIS2

| Campo | Valor |
|-------|-------|
| Programa | PROG-DUAL-CHART |
| Fase | **MF-DUAL-CHART-01** — Paridad visual ficha electrónica tradicional |
| ADR | [ADR-002](docs/adr/ADR-002-dual-chart-modes.md) |
| Estado ledger | READY |

## Objetivo único de sesión

- [ ] parseChartModeSearch() en chartModeSearch.ts
- [ ] PatientClinicalSummaryGrid en TraditionalEhrMode
- [ ] Command bar transversal en ClinicalShell para /espacio/*
- [ ] npm run quality:dual-chart-traditional-gate

## Archivos permitidos

```text
a
p
p
s
/
w
e
b
/
s
r
c
/
r
o
u
t
e
s
/
c
h
a
r
t
M
o
d
e
S
e
a
r
c
h
.
t
s


a
p
p
s
/
w
e
b
/
s
r
c
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
/
T
r
a
d
i
t
i
o
n
a
l
E
h
r
M
o
d
e
.
t
s
x


a
p
p
s
/
w
e
b
/
s
r
c
/
c
o
m
p
o
n
e
n
t
s
/
c
h
a
r
t
/
C
l
i
n
i
c
a
l
S
h
e
l
l
.
t
s
x


a
p
p
s
/
w
e
b
/
s
r
c
/
p
a
g
e
s
/
P
a
t
i
e
n
t
W
o
r
k
s
p
a
c
e
P
a
g
e
.
t
s
x


a
p
p
s
/
w
e
b
/
s
r
c
/
l
a
y
o
u
t
s
/
*
*


p
a
c
k
a
g
e
s
/
d
e
s
i
g
n
-
s
y
s
t
e
m
/
s
r
c
/
c
o
p
y
/
e
s
.
t
s
```

## Prohibido esta sesión

- Segundo registry temporal
- Import EPIS sin manifest
- Romper `three-modes-journey.spec.ts`
- `@mui/*` directo desde apps/web
- IA que apruebe o firme

## Comandos automatizados

```bash
npm run stack:dev                    # una vez al día
npm run dev:dual-chart:session       # este brief
npm run quality:dual-chart-next      # JSON fase activa
npm run quality:dual-chart-plan -- --phase 1 --verify
VITE_ENABLE_DUAL_CHART_MODES=true npm run dev:web
# Preview: http://localhost:5173/dev/chart-modes

# Cierre fase (cuando gate pase):
npm run quality:dual-chart-plan -- --phase 1 --verify --e2e --legacy
npm run dev:agent:close
```

## Referencias Figma

- [Ficha electrónica tradicional](https://www.figma.com/make/PhZ55jJhxLQUtIWEuf17ZO/Medical-Record)
- [Ficha papel editable](https://www.figma.com/make/AJ9MNrSyClA0hh8jB8sx49/Crear-p%C3%A1ginas-de-ficha-m%C3%A9dica)

## Rollback

`VITE_ENABLE_DUAL_CHART_MODES=false` — cero impacto rutas legacy.

## Cierre

Reporte: `reports/epis2-mf-dual-chart-01-traditional.md`

Actualizar `docs/quality/dual-chart-ledger.json`: marcar DONE → siguiente READY.
