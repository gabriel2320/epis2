# EPIS2 — Canon de producto

**Versión:** 1.0 · **Fase:** EPIS2-00  
**Estado:** Canónico — fuente única de verdad de producto

---

## Qué es EPIS2

EPIS2 es una **aplicación clínica command-first** construida como producto nuevo. No es una migración visual de OpenMRS ni un overlay sobre O3.

El profesional:

1. Inicia sesión.
2. Entra al **Centro de Comando**.
3. Busca o selecciona un paciente.
4. Escribe una **instrucción clínica** en lenguaje natural (español).
5. EPIS2 interpreta intención y datos faltantes.
6. Genera la **página o formulario mínimo** necesario.
7. La **IA local** ayuda a preparar un **borrador**.
8. El profesional **revisa y aprueba**.
9. El registro aprobado queda **versionado y auditado** en PostgreSQL.

Nada se firma ni ejecuta automáticamente.

Modos secundarios (Classic EMR, Dashboard MD3) amplían la experiencia sin cambiar home: ver [`docs/architecture/EPIS2_MODES_LAYER.md`](architecture/EPIS2_MODES_LAYER.md).

---

## Frase guía

> **¿Qué necesitas hacer?**

La home es el Centro de Comando (`/comando`). No es un dashboard. No es una ficha hospitalaria completa en v1.

---

## Home canónica (anatomía)

Un solo concepto de home; tres capas de experiencia:

```text
Home canónica = Centro de Comando (/comando)
  Estado inicial     → búsqueda / censo de paciente
  Tras fijar paciente → workspace ficha dual (electrónica | papel)
  Dashboard          → secundario; nunca home
```

La barra de comando (palette Ctrl+K) es **transversal** al workspace; no compite con la ficha. Ver [`adr/ADR-002-dual-chart-modes.md`](adr/ADR-002-dual-chart-modes.md) para evolución dual chart.

Gate ejecutable: `command-center-home` (prohíbe dashboard como entrada).

## Principios no negociables

| # | Principio |
|---|-----------|
| 1 | EPIS2 First — experiencia y modelo propios |
| 2 | Home = Centro de Comando (`/comando`); estado inicial = búsqueda/censo; tras paciente = workspace ficha dual | `command-center-home` + dual-chart census-gate |
| 3 | Command-first — texto → intent → formulario → borrador |
| 4 | Información no solicitada permanece **oculta** |
| 5 | IA local **asiste**; no decide, firma ni aprueba |
| 6 | PostgreSQL = fuente de verdad clínica |
| 7 | Borradores ≠ datos clínicos aprobados |
| 8 | Toda modificación clínica: autor, timestamp, versión, auditoría |
| 9 | Interfaz 100 % en **español** (microcopy clínico) |
| 10 | Desarrollo inicial solo con **datos sintéticos** DEMO |
| 11 | La app debe funcionar si **Ollama está caído** |
| 12 | Interoperabilidad futura vía **frontera FHIR**, no como UI |
| 13 | MVP acotado — ver `SCOPE_V1.md` |
| 14 | EPIS = donante de conocimiento, no base de código obligatoria |
| 15 | Una **microfase** termina antes de iniciar la siguiente (ver [`EPIS2_DEV_SYSTEM.md`](product/EPIS2_DEV_SYSTEM.md)) |

---

## Flujo canónico

```text
Login
  → Centro de Comando
  → (opcional) buscar / seleccionar paciente
  → instrucción clínica
  → intent + slots + validación + permiso
  → página clínica generada
  → borrador (+ asistencia IA opcional)
  → revisión humana
  → aprobación → registro versionado
```

---

## Lo que EPIS2 no es (v1)

Ver `NON_GOALS.md`. Resumen: no es OpenMRS visible, no es Carbon, no es dashboard, no es hospital completo, no es escritura automática a producción.

---

## Relación con EPIS

EPIS queda **`LEGACY_REFERENCE`**. Se extrae visión, comandos, blueprints, microcopy, contratos IA, fixtures revisados y tests útiles. Ver `LEGACY_DONOR_MAP.md`.

---

## Referencias internas

- `SCOPE_V1.md` — MVP
- `EPIS2_FORM_SCREEN_TREE.md` — árbol formulario → pantalla (canon)
- `ARCHITECTURE_TARGET.md` — stack
- `CLINICAL_SAFETY_PRINCIPLES.md` — seguridad
- `ROADMAP.md` — hitos bootstrap EPIS2-00 … EPIS2-12
- `product/EPIS2_DEV_SYSTEM.md` — **sistema único de desarrollo** (olas, hilos, tramos, microfases)
- `product/EPIS2_TABLERO.md` — tablero vivo (estado del producto)
