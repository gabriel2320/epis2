# EPIS2 — Matriz de ejecución IDC 1–200

**Versión:** 1.0 · **Generado:** 2026-06-07  
**Canon:** [`EPIS2_WAVE_EXECUTION_CANON.md`](./EPIS2_WAVE_EXECUTION_CANON.md)  
**Fuente machine-readable:** [`epis2-idc-execution-matrix.json`](./epis2-idc-execution-matrix.json)

> Cuatro campos obligatorios por ítem: **Estado** · **Prioridad** · **Horizonte** · **Decisión**  
> Regenerar: `node scripts/product/generate-idc-matrix.mjs`

---

## Resumen cuadruple

| Campo | Distribución |
|-------|--------------|
| **Estado** | Planned: 63 · Active: 99 · Blocked: 1 · Done: 37 |
| **Prioridad** | Critical: 9 · High: 78 · Medium: 82 · Low: 31 |
| **Horizonte** | Core: 40 · Post-core: 138 · Future: 22 |
| **Decisión** | Build: 175 · Integrate: 5 · Defer: 18 · Exclude: 2 |

### Leyenda

| Campo | Valores |
|-------|---------|
| Estado | `Planned` · `Active` · `Blocked` · `Done` |
| Prioridad | `Critical` · `High` · `Medium` · `Low` |
| Horizonte | `Core` · `Post-core` · `Future` |
| Decisión | `Build` · `Integrate` · `Defer` · `Exclude` |

**Done (Core):** IDC 1, 37, 52, 55, 64, 91, 165 — más parciales en **Active** (Olas 2–3, 1C).

---

## Recepción y flujo (1–10)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 1 | Login de sistema | 0-1A | command | Done | Critical | Core | Build | COMPLETE | /login |
| 2 | Dashboard recepción | 4 | reception | Done | Medium | Post-core | Build | PARTIAL | MF-TRAMO-B-002 ReceptionDashboardTab + E2E |
| 3 | Agenda diaria profesional | 4 | reception | Done | Medium | Post-core | Build | PARTIAL | MF-TRAMO-B-002 agenda en tablero recepción |
| 4 | Calendario mensual centro | 4 | reception | Done | Medium | Post-core | Build | PARTIAL | MF-TRAMO-B-002 calendario demo recepción |
| 5 | Formulario admisión | 4 | reception | Done | Medium | Post-core | Build | PARTIAL | MF-TRAMO-B-002 admisión admin panel (≠ admission_note) |
| 6 | Biometría / firma | 4 | reception | Active | Medium | Post-core | Build | MISSING | MF-TRAMO-B-002 biometría Tramo B+ |
| 7 | Sala de espera virtual | 4 | reception | Done | Medium | Post-core | Build | PARTIAL | MF-TRAMO-B-002 sala espera virtual demo |
| 8 | Gestión sobrecupos | 4 | reception | Done | Medium | Post-core | Build | PARTIAL | MF-TRAMO-B-002 sobrecupos métrica demo |
| 9 | Registro acompañantes | 4 | reception | Done | Medium | Post-core | Build | PARTIAL | MF-TRAMO-B-002 acompañantes métrica demo |
| 10 | Panel llamado (tótem) | 4 | reception | Active | Medium | Post-core | Integrate | MISSING | MF-TRAMO-B-002 panel llamado demo; IoT Future |

## Facturación y caja (11–20)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 11 | Presupuesto médico | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 12 | Cobro consulta | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 13 | Boleta / factura | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 14 | Integración aseguradoras | 5 | billing | Planned | Low | Future | Integrate | DEFERRED | MF-TRAMO-B-001 Isapre/Fonasa Integrate Future |
| 15 | Conciliación diaria caja | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 16 | Cuentas por cobrar | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 17 | Reembolsos / anulaciones | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 18 | Honorarios médicos | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 19 | Liquidación profesionales | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |
| 20 | Reporte ingresos mensuales | 5 | billing | Planned | Low | Future | Defer | DEFERRED | MF-TRAMO-B-001 facturación Defer Tramo B |

## Resumen clínico (ficha) (21–30)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 21 | Dashboard del paciente | 3 | patient-record | Done | High | Core | Build | PARTIAL | PatientWorkspacePage hub M3 + E2E MF-OLA3-006 |
| 22 | Banner alertas clínicas | 3 | patient-record | Done | High | Core | Build | PARTIAL | ClinicalAlertsPanel ficha + E2E DEMO-005 MF-OLA3-003 |
| 23 | Línea de tiempo | 3 | patient-record | Done | High | Core | Build | PARTIAL | timeline ficha + E2E DEMO-001 MF-OLA3-005 |
| 24 | Medicamentos continuos | 3 | patient-record | Done | High | Core | Build | PARTIAL | medicamentos activos ficha MF-OLA3-005 |
| 25 | Visor últimos exámenes | 3 | patient-record | Done | High | Core | Build | PARTIAL | LabObservationsGrid + CTA resultados MF-OLA3-005 |
| 26 | Curvas signos vitales | 3 | patient-record | Done | Medium | Core | Build | PARTIAL | PatientClinicalCharts DEMO-005 MF-OLA3-005 |
| 27 | Antecedentes mórbidos | 3 | patient-record | Done | High | Core | Build | PARTIAL | allergy_entry + E2E ficha MF-OLA3-004 |
| 28 | Antecedentes familiares | 3 | patient-record | Done | High | Core | Build | PARTIAL | allergy_entry + E2E ficha MF-OLA3-004 |
| 29 | Registro hábitos | 3 | patient-record | Done | Medium | Core | Build | PARTIAL | clinical_problem_entry + E2E ficha MF-OLA3-004 |
| 30 | Antecedentes quirúrgicos | 3 | patient-record | Done | High | Core | Build | PARTIAL | problemCategory + sección Ant.Qx MF-OLA3-007 |

## Consulta ambulatoria (31–40)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 31 | Anamnesis próxima | 2 | ambulatory | Done | Critical | Core | Build | COMPLETE | outpatient_visit anamnesis — MF-OLA2-001 |
| 32 | Signos vitales / antropometría | 2 | ambulatory | Done | High | Core | Build | COMPLETE | vitals section scrollspy |
| 33 | Examen físico general | 2 | ambulatory | Done | High | Core | Build | PARTIAL | physical-general accordion + E2E MF-OLA2-003 |
| 34 | Examen físico segmentario | 2 | ambulatory | Done | Medium | Core | Build | PARTIAL | physical-segment accordion MF-OLA2-003 |
| 35 | Buscador diagnósticos CIE-10 | 2 | ambulatory | Done | High | Core | Build | PARTIAL | icd10Code diagnosis section MF-OLA2-003 |
| 36 | Indicaciones generales | 2 | ambulatory | Done | High | Core | Build | COMPLETE | plan + indicaciones generales |
| 37 | Evolución SOAP | 2 | ambulatory | Done | Critical | Core | Build | COMPLETE | evolution_note |
| 38 | Gestor macros / plantillas | 2 | ambulatory | Planned | Medium | Post-core | Defer | PARTIAL | MF-TRAMO-A-CLOSURE — macros EPIS diferidas; consulta usa textarea libre |
| 39 | Cierre de episodio | 2 | ambulatory | Done | Critical | Core | Build | COMPLETE | closeEncounter + FAB cierre Ola 2 |
| 40 | Resumen para paciente | 2 | ambulatory | Done | High | Core | Build | PARTIAL | PrintA5 + E2E MF-OLA6A-002 — vista documental (no firma auto) |

## UCI (bloque 41–50) (41–50)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 41 | Dashboard monitorización UCI | 13 | icu | Active | High | Post-core | Build | PARTIAL | IcuDashboardTab MF-TRAMO-D-002 |
| 42 | Sábana clínica (flujograma) | 13 | icu | Active | High | Post-core | Build | PARTIAL | Sábana clínica demo MF-TRAMO-D-003 |
| 43 | Balance hídrico estricto | 13 | icu | Active | High | Post-core | Build | PARTIAL | Balance hídrico demo MF-TRAMO-D-005 |
| 44 | Parámetros ventilación | 13 | icu | Active | High | Post-core | Build | PARTIAL | Ventilación demo MF-TRAMO-D-006 |
| 45 | Vías venosas e invasivos | 13 | icu | Active | High | Post-core | Build | PARTIAL | Vías invasivas demo MF-TRAMO-D-007 |
| 46 | Valoración neurológica | 13 | icu | Active | High | Post-core | Build | PARTIAL | Valoración neurológica demo MF-TRAMO-D-009 |
| 47 | Escalas severidad | 13 | icu | Active | High | Post-core | Build | PARTIAL | Escalas severidad demo MF-TRAMO-D-010 |
| 48 | Titulación vasoactivos | 13 | icu | Active | High | Post-core | Build | PARTIAL | Titulación vasoactivos demo MF-TRAMO-D-011 |
| 49 | Sedoanalgesia | 13 | icu | Active | High | Post-core | Build | PARTIAL | Sedoanalgesia demo MF-TRAMO-D-012 |
| 50 | Epicrisis traslado UCI | 13 | icu | Active | High | Post-core | Build | PARTIAL | Epicrisis traslado UCI MF-TRAMO-D-008 |

## Prescripción y órdenes (51–60)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 51 | Buscador fármacos | 1C | ambulatory | Active | High | Core | Build | PARTIAL |  |
| 52 | Receta médica | 1C | ambulatory | Done | Critical | Core | Build | COMPLETE | prescription |
| 53 | Receta retenida / cheque | 1C | ambulatory | Planned | Medium | Core | Build | MISSING |  |
| 54 | Panel interacciones | 1C | ambulatory | Active | High | Core | Build | PARTIAL |  |
| 55 | Solicitud laboratorio | 1C | ambulatory | Done | Critical | Core | Build | COMPLETE | lab_request |
| 56 | Solicitud imagenología | 1C | ambulatory | Done | High | Core | Build | PARTIAL | imaging_request + journey MF-OLA1C-003 |
| 57 | Solicitud procedimientos | 1C | ambulatory | Planned | Medium | Core | Build | MISSING |  |
| 58 | Bandeja resultados lab | 1C | ambulatory | Done | High | Core | Build | COMPLETE | ResultsInboxPage + tendencias MF-TRAMO-C-005 + journey MF-OLA1C-001 |
| 59 | Visor DICOM (PACS) | 1C | ambulatory | Planned | Medium | Post-core | Integrate | MISSING | PACS externo |
| 60 | Historial acumulativo exámenes | 1C | ambulatory | Planned | Medium | Core | Build | MISSING |  |

## Documentos legales (61–70)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 61 | Licencia médica | 6 | ambulatory | Planned | Low | Future | Defer | MISSING | LME Chile |
| 62 | Certificado asistencia | 6 | ambulatory | Done | Medium | Core | Build | COMPLETE | medical_certificate Ola 2 + print A5 |
| 63 | Certificado aptitud / alta | 6 | ambulatory | Planned | Medium | Core | Build | MISSING |  |
| 64 | Derivación / interconsulta | 6 | ambulatory | Done | High | Core | Build | COMPLETE | referral |
| 65 | Consentimiento informado | 6 | ambulatory | Planned | Medium | Post-core | Build | MISSING |  |
| 66 | Notificación GES | 6 | ambulatory | Planned | Low | Future | Defer | DEFERRED | GES Chile |
| 67 | Constatación lesiones | 6 | ambulatory | Planned | Medium | Post-core | Build | MISSING |  |
| 68 | Certificado defunción | 6 | ambulatory | Planned | Low | Future | Defer | DEFERRED |  |
| 69 | Gestor archivos adjuntos | 6 | ambulatory | Active | Medium | Core | Build | PARTIAL |  |
| 70 | Visor fotografías clínicas | 6 | ambulatory | Planned | Low | Post-core | Build | MISSING |  |

## Epidemiología e IAAS (71–80)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 71 | Vigilancia epidemiológica | 7 | quality_iaas | Active | High | Post-core | Build | PARTIAL |  |
| 72 | Notificación ENO | 7 | quality_iaas | Planned | High | Post-core | Build | MISSING |  |
| 73 | Sospecha IAAS | 7 | quality_iaas | Planned | High | Post-core | Build | MISSING |  |
| 74 | Resistencia antimicrobiana | 7 | quality_iaas | Active | Medium | Post-core | Build | PARTIAL |  |
| 75 | Registro antibiogramas | 7 | quality_iaas | Planned | Medium | Post-core | Build | MISSING |  |
| 76 | Receta antimicrobianos | 7 | quality_iaas | Planned | Medium | Post-core | Build | MISSING |  |
| 77 | Precauciones aislamiento | 7 | quality_iaas | Planned | Medium | Post-core | Build | MISSING |  |
| 78 | Tasa infección dispositivos | 7 | quality_iaas | Planned | Medium | Post-core | Build | MISSING |  |
| 79 | Exposiciones laborales | 7 | quality_iaas | Planned | Medium | Post-core | Build | MISSING |  |
| 80 | Reportes autoridad sanitaria | 7 | quality_iaas | Planned | Medium | Post-core | Build | MISSING |  |

## Jefatura y administración (81–90)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 81 | Dashboard producción | 8 | admin_system | Active | High | Post-core | Build | PARTIAL |  |
| 82 | Ocupación y rendimiento | 8 | admin_system | Planned | Medium | Post-core | Build | MISSING |  |
| 83 | Fichas abiertas | 8 | admin_system | Active | Medium | Post-core | Build | PARTIAL |  |
| 84 | Auditoría trazabilidad | 8 | admin_system | Active | High | Post-core | Build | PARTIAL |  |
| 85 | Gestión roles | 8 | admin_system | Active | High | Post-core | Build | PARTIAL |  |
| 86 | Configuración vademécum | 8 | admin_system | Planned | Low | Post-core | Build | MISSING |  |
| 87 | Agenda global | 8 | admin_system | Planned | Low | Post-core | Build | MISSING |  |
| 88 | Tiempos de espera | 8 | admin_system | Planned | Low | Post-core | Build | MISSING |  |
| 89 | Encuestas satisfacción | 8 | admin_system | Planned | Low | Post-core | Build | MISSING |  |
| 90 | Exportación datos | 8 | admin_system | Active | High | Core | Build | PARTIAL | FHIR export |

## IA y herramientas (91–100)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 91 | Asistente redacción local | 9 | command | Done | High | Core | Build | COMPLETE | Assist draft API |
| 92 | Transcripción voz a texto | 9 | command | Planned | Medium | Post-core | Build | MISSING |  |
| 93 | Panel hardware IA local | 9 | command | Active | Low | Core | Build | PARTIAL |  |
| 94 | Resumen automático clínico | 9 | command | Active | High | Core | Build | PARTIAL |  |
| 95 | Sugerencia diagnóstica | 9 | command | Blocked | Low | Future | Exclude | MISSING | No auto-diagnóstico (invariante) |
| 96 | Análisis reingreso | 9 | command | Planned | Low | Future | Build | MISSING |  |
| 97 | Extracción PDF (OCR IA) | 9 | command | Active | Medium | Post-core | Build | PARTIAL |  |
| 98 | Chatbot soporte EMR | 9 | command | Planned | Low | Future | Exclude | MISSING | Fuera alcance clínico MVP |
| 99 | Sala telemedicina | 9 | command | Planned | Low | Future | Defer | DEFERRED |  |
| 100 | Portal paciente (vista admin) | 9 | command | Planned | Low | Future | Integrate | DEFERRED | Portal externo |

## Urgencias y triage (101–110)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 101 | Dashboard de Urgencias | 10 | emergency | Active | Critical | Post-core | Build | PARTIAL | MF-TRAMO-C-002 EmergencyDashboardTab triaje demo |
| 102 | Categorización ESI | 10 | emergency | Active | Critical | Post-core | Build | PARTIAL | MF-TRAMO-C-002 workspace emergency |
| 103 | Reanimación (Clave Azul) | 10 | emergency | Active | High | Post-core | Build | PARTIAL | MF-TRAMO-C-002 panel reanimación demo |
| 104 | Trauma / FAST | 10 | emergency | Active | High | Post-core | Build | PARTIAL | MF-TRAMO-C-002 trauma FAST demo |
| 105 | Hoja observación corta | 10 | emergency | Active | High | Post-core | Build | PARTIAL | MF-TRAMO-C-002 observación corta demo |
| 106 | Traslado SAMU | 10 | emergency | Active | Medium | Post-core | Build | PARTIAL | transfer_note |
| 107 | Protocolo ACV (Stroke) | 10 | emergency | Planned | High | Post-core | Build | MISSING |  |
| 108 | Protocolo IAM | 10 | emergency | Planned | High | Post-core | Build | MISSING |  |
| 109 | Ingreso toxicológico | 10 | emergency | Planned | High | Post-core | Build | MISSING |  |
| 110 | Alta urgencia + APS | 10 | emergency | Active | High | Post-core | Build | PARTIAL | CTA epicrisis tablero urgencias MF-TRAMO-C-006 |

## Enfermería y cuidados (111–120)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 111 | Entrega de turno (SBAR) | 11 | icu | Done | High | Post-core | Build | PARTIAL | nursing_note + CTA ficha MF-TRAMO-C-003 |
| 112 | Riesgo de caídas | 11 | icu | Planned | High | Post-core | Build | MISSING |  |
| 113 | Riesgo UPP (Braden/Norton) | 11 | icu | Planned | High | Post-core | Build | MISSING |  |
| 114 | Curaciones / heridas | 11 | icu | Planned | High | Post-core | Build | MISSING |  |
| 115 | Diuresis / deposiciones | 11 | icu | Planned | High | Post-core | Build | MISSING |  |
| 116 | Tarjetón (5 correctos) | 11 | icu | Done | Critical | Post-core | Build | PARTIAL | MAR tablero + /espacio/mar MF-TRAMO-C-008 |
| 117 | Sujeción mecánica | 11 | icu | Planned | Medium | Post-core | Build | MISSING |  |
| 118 | Valoración dolor EVA/FLACC | 11 | icu | Planned | Medium | Post-core | Build | MISSING |  |
| 119 | Seguimiento dispositivos | 11 | icu | Planned | Medium | Post-core | Build | MISSING |  |
| 120 | Plan cuidados enfermería | 11 | icu | Active | Medium | Post-core | Build | PARTIAL |  |

## Medicina general y APS (121–130)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 121 | Control salud cardiovascular | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | Control cardiovascular PSCV demo MF-TRAMO-F-002 |
| 122 | Calculadora Framingham | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | Framingham demo MF-TRAMO-F-003 |
| 123 | Examen medicina preventiva (EMP) | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | EMP tamizaje demo MF-TRAMO-F-004 |
| 124 | Pie diabético | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | Pie diabético demo MF-TRAMO-F-005 |
| 125 | Tamizaje salud mental | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | Salud mental demo MF-TRAMO-F-006 |
| 126 | Control niño sano | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | Niño sano demo MF-TRAMO-F-007 |
| 127 | Calendario inmunizaciones | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | PNI demo MF-TRAMO-F-008 |
| 128 | Control prenatal | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | Control prenatal demo MF-TRAMO-F-009 |
| 129 | Derivación programas ministeriales | 12 | ambulatory | Active | Medium | Post-core | Build | MISSING | Derivación ministerial demo MF-TRAMO-F-010 |
| 130 | Visita domiciliaria integral | 12 | ambulatory | Active | Medium | Post-core | Build | PARTIAL | Visita domiciliaria demo MF-TRAMO-F-011 |

## UCI avanzada (131–140)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 131 | Prueba ventilación espontánea | 13 | icu | Active | High | Post-core | Build | PARTIAL | SBT demo MF-TRAMO-G-002 |
| 132 | Terapias renales continuas | 13 | icu | Active | High | Post-core | Build | PARTIAL | Terapias renales demo MF-TRAMO-G-003 |
| 133 | Nutrición parenteral total | 13 | icu | Active | High | Post-core | Build | PARTIAL | NPT demo MF-TRAMO-G-004 |
| 134 | Nutrición enteral | 13 | icu | Active | High | Post-core | Build | PARTIAL | Nutrición enteral demo MF-TRAMO-G-005 |
| 135 | Monitorización hemodinámica | 13 | icu | Active | High | Post-core | Build | PARTIAL | Hemodinámica demo MF-TRAMO-D-004 · specialized MF-TRAMO-G |
| 136 | Muerte encefálica | 13 | icu | Active | High | Post-core | Build | PARTIAL | Muerte encefálica demo MF-TRAMO-G-006 |
| 137 | Procuramiento órganos | 13 | icu | Active | High | Post-core | Build | PARTIAL | Procuramiento órganos demo MF-TRAMO-G-007 |
| 138 | Diario UCI (humanización) | 13 | icu | Active | Medium | Post-core | Build | PARTIAL | Diario UCI demo MF-TRAMO-G-008 |
| 139 | Seguimiento delirium | 13 | icu | Active | Medium | Post-core | Build | PARTIAL | Delirium CAM-ICU demo MF-TRAMO-G-009 |
| 140 | Protocolo decúbito prono | 13 | icu | Active | High | Post-core | Build | PARTIAL | Decúbito prono demo MF-TRAMO-G-010 |

## IAAS avanzada (141–150)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 141 | Matriz vigilancia activa | 14 | quality_iaas | Active | High | Post-core | Build | PARTIAL | Matriz vigilancia demo MF-TRAMO-H-002 |
| 142 | Alerta MDRO | 14 | quality_iaas | Active | High | Post-core | Build | PARTIAL | Alerta MDRO demo MF-TRAMO-H-003 |
| 143 | Monitor consumo antimicrobianos | 14 | quality_iaas | Active | High | Post-core | Build | PARTIAL | Consumo ATB demo MF-TRAMO-H-004 |
| 144 | PROA | 14 | quality_iaas | Active | High | Post-core | Build | PARTIAL | PROA demo MF-TRAMO-H-005 |
| 145 | Checklist inserción CVC | 14 | quality_iaas | Active | High | Post-core | Build | PARTIAL | Checklist CVC demo MF-TRAMO-H-006 |
| 146 | Checklist prevención NAV | 14 | quality_iaas | Active | High | Post-core | Build | PARTIAL | Prevención NAV demo MF-TRAMO-H-007 |
| 147 | Adherencia higiene de manos | 14 | quality_iaas | Active | Medium | Post-core | Build | PARTIAL | Higiene manos demo MF-TRAMO-H-008 |
| 148 | Estudio brote | 14 | quality_iaas | Active | High | Post-core | Build | PARTIAL | Estudio brote demo MF-TRAMO-H-009 |
| 149 | Mapa aislamientos | 14 | quality_iaas | Active | Medium | Post-core | Build | PARTIAL | Mapa aislamientos demo MF-TRAMO-H-010 |
| 150 | Curvas endémicas | 14 | quality_iaas | Active | Medium | Post-core | Build | PARTIAL | Curvas endémicas demo MF-TRAMO-H-011 |

## Pabellón y anestesia (151–160)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 151 | Tabla quirúrgica | 15 | or | Active | High | Post-core | Build | PARTIAL | OrDashboardTab MF-TRAMO-E-002 |
| 152 | Checklist cirugía segura OMS | 15 | or | Active | High | Post-core | Build | PARTIAL | Checklist OMS demo MF-TRAMO-E-003 |
| 153 | Evaluación preanestésica | 15 | or | Active | High | Post-core | Build | PARTIAL | Preanestesia demo MF-TRAMO-E-004 |
| 154 | Hoja anestesia intraoperatoria | 15 | or | Active | High | Post-core | Build | PARTIAL | Anestesia intraop demo MF-TRAMO-E-005 |
| 155 | Protocolo operatorio | 15 | or | Active | High | Post-core | Build | PARTIAL | Protocolo operatorio demo MF-TRAMO-E-006 |
| 156 | Recuento compresas / insumos | 15 | or | Active | High | Post-core | Build | PARTIAL | Recuento compresas demo MF-TRAMO-E-007 |
| 157 | Biopsia intraoperatoria | 15 | or | Active | High | Post-core | Build | PARTIAL | Biopsia intraop demo MF-TRAMO-E-008 |
| 158 | Recuperación URPA | 15 | or | Active | High | Post-core | Build | PARTIAL | URPA Aldrete demo MF-TRAMO-E-009 |
| 159 | Banco de sangre | 15 | or | Active | High | Post-core | Build | PARTIAL | Banco sangre demo MF-TRAMO-E-010 |
| 160 | Esterilización / trazabilidad | 15 | or | Active | High | Post-core | Build | PARTIAL | Esterilización demo MF-TRAMO-E-011 |

## Farmacia clínica (161–170)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 161 | Compatibilidad Y-Site | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | Y-Site demo MF-TRAMO-J-002 |
| 162 | Ajuste dosis renal | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | Dosis renal demo MF-TRAMO-J-003 |
| 163 | Monitorización TDM | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | TDM demo MF-TRAMO-J-004 |
| 164 | RAM | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | RAM demo MF-TRAMO-J-005 |
| 165 | Conciliación medicamentos | 16 | pharmacy | Done | High | Core | Build | COMPLETE | Conciliación COMPLETE · panel MF-TRAMO-J-006 |
| 166 | Dispensación recetas | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | Dispensación demo MF-TRAMO-J-007 |
| 167 | Carro de paro | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | Carro paro demo MF-TRAMO-J-008 |
| 168 | Estupefacientes | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | Estupefacientes demo MF-TRAMO-J-009 |
| 169 | Devolución fármacos | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | Devolución demo MF-TRAMO-J-010 |
| 170 | Quiebre de stock | 16 | pharmacy | Active | Medium | Post-core | Build | PARTIAL | Quiebre stock demo MF-TRAMO-J-011 |

## Calidad y auditoría (171–180)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 171 | Eventos adversos / centinela | 17 | admin_system | Active | Medium | Post-core | Build | PARTIAL |  |
| 172 | Análisis causa raíz (ACR) | 17 | admin_system | Planned | Medium | Post-core | Build | MISSING |  |
| 173 | Comité mortalidad | 17 | admin_system | Planned | Medium | Post-core | Build | MISSING |  |
| 174 | Auditoría registros médicos | 17 | admin_system | Planned | Medium | Post-core | Build | MISSING |  |
| 175 | Reclamos OIRS | 17 | admin_system | Planned | Medium | Post-core | Build | MISSING |  |
| 176 | Clima laboral clínico | 17 | admin_system | Planned | Medium | Post-core | Build | MISSING |  |
| 177 | Trazabilidad consentimientos | 17 | admin_system | Planned | Medium | Post-core | Build | MISSING |  |
| 178 | Indicadores acreditación | 17 | admin_system | Active | Medium | Post-core | Build | PARTIAL |  |
| 179 | Documentos institucionales | 17 | admin_system | Planned | Low | Post-core | Build | MISSING |  |
| 180 | Suspensión quirúrgica | 17 | admin_system | Planned | Low | Post-core | Build | MISSING |  |

## Especialidades (181–190)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 181 | Partograma (obstetricia) | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Partograma demo MF-TRAMO-I-002 |
| 182 | Comité oncológico | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Comité oncológico demo MF-TRAMO-I-003 |
| 183 | Odontograma | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Odontograma demo MF-TRAMO-I-004 |
| 184 | Informe endoscópico | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Endoscopia demo MF-TRAMO-I-005 |
| 185 | Evaluación oftalmológica | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Oftalmología demo MF-TRAMO-I-006 |
| 186 | Hemodiálisis ambulatoria | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Hemodiálisis demo MF-TRAMO-I-007 |
| 187 | Ficha kinesiológica | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Kinesiología demo MF-TRAMO-I-008 |
| 188 | Ficha nutricional | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Nutrición demo MF-TRAMO-I-009 |
| 189 | Protocolos quimioterapia | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Quimioterapia demo MF-TRAMO-I-010 |
| 190 | Seguimiento psiquiátrico | 18 | specialty | Active | Medium | Post-core | Build | PARTIAL | Psiquiatría demo MF-TRAMO-I-011 |

## IA y hardware local (191–196)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 191 | Panel optimización VRAM | 19 | command | Active | Low | Post-core | Build | PARTIAL |  |
| 192 | Gestor agentes autónomos | 19 | command | Planned | Low | Future | Defer | MISSING |  |
| 193 | Vibe coding clínico | 19 | command | Active | Medium | Post-core | Build | PARTIAL | BlueprintStudioPanel |
| 194 | Biblioteca prompts LLM | 19 | command | Planned | Medium | Post-core | Build | MISSING |  |
| 195 | Auditoría decisiones IA | 19 | command | Active | High | Core | Build | PARTIAL | ai_runs |
| 196 | Traducción médica local | 19 | command | Planned | Low | Future | Defer | MISSING |  |

## Integración IoT (197–198)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 197 | Sincronización wearables | IoT | iot | Planned | Low | Future | Defer | DEFERRED |  |
| 198 | Telemetría hospitalaria | IoT | iot | Planned | Low | Future | Defer | DEFERRED |  |

## Interoperabilidad (199–200)

| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |
|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|
| 199 | Visor HL7 / FHIR | 20 | admin_system | Active | High | Core | Integrate | PARTIAL | API + quarantine |
| 200 | Backup y continuidad | 20 | admin_system | Active | High | Post-core | Build | PARTIAL |  |

---

## Referencias

- Inventario 1–100: `EPIS2_ARCHITECTURE_INVENTORY_001_100.md`
- Inventario 101–200: `EPIS2_ARCHITECTURE_INVENTORY_101_200.md`
- Workspaces: `EPIS2_INVENTORY_WORKSPACE_MATRIX.md`
