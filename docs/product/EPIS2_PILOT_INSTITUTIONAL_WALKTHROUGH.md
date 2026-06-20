# EPIS2 — Walkthrough institucional (signoff A–K → piloto)

**Versión:** 1.0 · **Post:** tag `QUERY-STORYBOOK-FOUNDATION`  
**Duración estimada:** 2–3 h (equipo clínico + QA) · **Datos:** solo sintéticos DEMO

---

## Precondiciones

```bash
npm run stack:dev          # PostgreSQL + API + web
npm run quality:tramos-clinical-signoff-session   # gates técnicos (≈15 min)
```

**Usuarios demo:** [`docs/auth/DEMO_USERS.md`](../auth/DEMO_USERS.md)

| Rol | Usuario | Uso en sesión |
|-----|---------|---------------|
| Médico | `medico.demo` | Tramos A, C–G, journey dorado |
| Enfermería | `enfermeria.demo` | MAR, handover (Tramo C/D) |
| Farmacia | `farmacia.demo` | Tramo J |
| Admin | `admin.demo` | Tabs operativos ampliados |
| Auditor | `auditor.demo` | Tramo K (calidad) |

Ollama **opcional** — el flujo debe completarse con IA desconectada.

---

## Parte 1 — Journey dorado (obligatorio, ~20 min)

Referencia: [`GOLDEN_CLINICAL_JOURNEY.md`](../quality/GOLDEN_CLINICAL_JOURNEY.md) · [`PILOT_DEMO_CHECKLIST.md`](../quality/PILOT_DEMO_CHECKLIST.md)

| # | Paso | Verificar |
|---|------|-----------|
| 1 | Login → `/app/buscar` | Home = CICA, no dashboard |
| 2 | Fijar paciente DEMO-005 (Penicilina) | Badge demo visible |
| 3 | Comando: «evolucionar nota de hoy» | Llega a `/espacio/evolucion` |
| 4 | Guardar borrador | Estado `draft`; **no** nota aprobada |
| 5 | Revisión → enviar a revisión → **aprobar (humano)** | `EpisApprovalGate`; disclosure IA si aplica |
| 6 | Ficha paciente | Nota en historial aprobado |
| 7 | Volver a `/comando` | Contexto coherente |

**Criterio bloqueante:** ningún paso auto-aprueba borrador IA.

---

## Parte 2 — Signoff por tramo (~90 min)

Marcar en [`EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md`](./EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md).

| Tramo | Recorrido demo | Rol sugerido | Criterio humano |
|-------|----------------|--------------|-----------------|
| **A** Clínico demostrable | Comando → evolución → epicrisis → receta → certificado | Médico | Formularios blueprint; copy ES; borrador ≠ aprobado |
| **B** Piloto ambulatorio | `/epis2/dashboard?tab=reception` | Admin | Recepción demo; sin PHI real |
| **C** Hospitalización | `tab=service`, `tab=emergency` | Médico | Censo demo; epicrisis desde tablero |
| **D** Programas UCI | `tab=icu` | Médico / enfermería | Paneles UCI demo; handover enfermería |
| **E** Pabellón | `tab=or` | Médico | Lista quirófano demo |
| **F** APS | `tab=aps` | Médico | Consulta ambulatoria + scrollspy |
| **G** UCI esp. | `tab=icu` (profundizar paneles) | Médico | Coherencia con Tramo D |
| **H** IAAS | `tab=quality` (permiso `audit.read`) | Auditor | Paneles auditoría demo |
| **I** Esp. gráficas | `tab=specialty` | Médico | Especialidades demo |
| **J** Farmacia | `tab=pharmacy` + `/espacio/farmacia` | Farmacia | Validación farmacéutica demo |
| **K** Calidad | `tab=quality` IDC 171–180 | Auditor | Chips `epis2-quality-idc-*`; paneles auditoría |

**Permisos negativos (muestreo):**

- `enfermeria.demo` **no** puede aprobar borrador médico.
- `farmacia.demo` accede farmacia; **no** tab calidad sin permiso.
- Sin sesión → `/login`; forbidden → `/sin-acceso`.

---

## Parte 3 — Piloto institucional (~30 min post-signoff)

Tras marcar **todas** las filas A–K en el checklist:

1. Ejecutar acta ([plantilla](./EPIS2_CLINICAL_SIGNOFF_ACTA_TEMPLATE.md)) — **archivar fuera del repo**.
2. `npm run quality:pilot-trial` en entorno de demostración.
3. Demo guiada a stakeholders (15–20 min): journey dorado + 2 tabs relevantes al público (p. ej. farmacia + calidad).
4. Registrar resultado: **GO PILOT** | **PASS WITH FIXES** | **NO GO**.

---

## E2E opcional (con stack)

```bash
npm run test:e2e:tramo-k
EPIS2_LOCAL_CI_TRAMO_K_E2E=1 npm run quality:local-ci
```

IA live (opcional):

```bash
npm run dev:ai
npm run ai:evals:tramo-k
npm run ai:evals:closure
```

---

## Referencias

- Checklist: `EPIS2_TRAMOS_CLINICAL_SIGNOFF_CHECKLIST.md`
- Plan maestro: `EPIS2_TRAMOS_EXECUTION_MASTER.md`
- Gates sesión: `npm run quality:tramos-clinical-signoff-session`

*Los errores de EPIS no son recuerdos: son gates de EPIS2.*
