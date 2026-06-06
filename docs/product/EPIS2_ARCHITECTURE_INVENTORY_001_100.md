# EPIS2 — Inventario de arquitectura: pantallas y formularios (IDC 1–100)

**Versión:** 1.0 · **Fecha:** 2026-06-04  
**Alcance:** Planificación y trazabilidad — **sin implementación masiva**  
**Continúa en:** [`EPIS2_ARCHITECTURE_INVENTORY_101_200.md`](./EPIS2_ARCHITECTURE_INVENTORY_101_200.md) · Índice maestro [`EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`](./EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md)

---

## 1. Reglas de planificación (canon EPIS2)

| Regla | Implicación para IDC 1–100 |
|-------|----------------------------|
| Home = **Centro de Comando** | IDC 2 (recepción), 81 (producción) → Modo tablero o módulo admin — **no home** |
| Command-first clínico | IDC 31–40, 52–57 entran por comando o ficha; recepción (2–10) es flujo paralelo pre-clínico |
| Un **Clinical Form Registry** | Formularios = blueprint + intent; recepción/facturación pueden ser **read models** sin blueprint |
| Borrador ≠ aprobado | SOAP, receta, órdenes → draft → aprobación |
| IA no aprueba (91–100) | Asistencia redacción, resumen, OCR — sin firma automática |
| Facturación Chile (11–20) | **DEFERRED** hasta catálogo FONASA/Isapre/LME en producto |
| UI 100 % español | `packages/design-system/src/copy/es.ts` |

---

## 2. Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| Ítems inventariados (1–100) | **100** |
| **COMPLETE** | **6** |
| **PARTIAL** | **38** |
| **MISSING** | **44** |
| **DEFERRED** | **12** |
| Cobertura estimada bloque 1–100 | **~22 %** |

### COMPLETE hoy (cadena o pantalla operativa)

| IDC | Nombre | EPIS2 |
|-----|--------|-------|
| 1 | Login de sistema | `LoginPage` `/login` |
| 37 | Evolución SOAP | `evolution_note` `/espacio/evolucion` |
| 52 | Receta médica | `prescription` `/espacio/receta` |
| 55 | Solicitud laboratorio | `lab_request` `/espacio/laboratorio` |
| 64 | Derivación / interconsulta | `referral` `/espacio/interconsulta` |
| — | *(extra MVP)* Epicrisis | `discharge_summary` `/espacio/epicrisis` |

---

## 3. Solapes principales con MVP

| IDC | Nombre | EPIS2 hoy | Gap |
|-----|--------|-----------|-----|
| 21 | Dashboard del paciente | Ficha M3 + `patient_summary` | CRUD demografía; widgets incompletos |
| 22 | Banner alertas | `ClinicalAlertsPanel` | No bloquea aprobación (by design) |
| 23 | Timeline | `EpisClinicalContextPane` | Sin ruta dedicada full-screen |
| 24 | Medicamentos continuos | Contexto demo + MAR | Sin pantalla terapias crónicas |
| 25 | Últimos exámenes | `/espacio/resultados` | Sin visor lab integrado completo |
| 26 | Curvas signos vitales | Widgets / charts demo | Sin serie histórica SoT |
| 31–36 | Consulta ambulatoria | `outpatient_visit` **PARTIAL** | Anamnesis/examen físico/Cierre |
| 38 | Macros / plantillas | Inserción contexto clínico | Sin biblioteca institucional |
| 54 | Interacciones | CDS `clinical-alerts` | No panel cruce receta en tiempo real |
| 56 | Imagenología | `imaging_request` **PARTIAL** | Sin PACS (59) |
| 58 | Bandeja resultados | `ResultsInboxPage` **PARTIAL** | Flags críticos demo |
| 65 | Consentimiento | — | **MISSING** |
| 71–80 | Epidemiología / IAAS | Tab calidad + API demo | Sin ENO/IAAS formal |
| 81–90 | Jefatura | Dashboard + `/espacio/admin` | KPIs limitados |
| 91 | Asistente redacción | `POST /api/ai/assist/draft` | **COMPLETE** API |
| 93 | Panel hardware IA | `local-ai` + dev | Sin UI productiva |
| 94 | Resumen automático | `PatientClinicalAiPanel` | RAG parcial |
| 97 | OCR PDF | API intake demo | Sin UI documentos |

---

## 4. Olas de producto (IDC 1–100)

| Ola EPIS2 | IDC | Dominio | Prioridad |
|-----------|-----|---------|-----------|
| **0–1** (actual) | 1, 21–26, 37, 52, 55, 58, 91, 94 | Núcleo clínico + IA asistida | ✓ en curso |
| **2** | 31–40 | Consulta ambulatoria completa | Alta |
| **3** | 27–30, 21–26 | Antecedentes + longitudinal | Alta |
| **4** | 2–10 | Recepción y flujo | Media — módulo operativo |
| **5** | 11–20 | Facturación y caja | **DEFERRED** (Chile) |
| **6** | 61–70 | Documentos legales | Media |
| **7** | 71–80 | Epidemiología e IAAS base | Media |
| **8** | 81–90 | Jefatura y administración | Media |
| **9** | 92–93, 95–100 | IA ampliada + telemedicina | Baja MVP |

**Nota:** IDC **41–50** (UCI) solapan con **131–140** en inventario 101–200 — implementar una sola vez en **Ola 13** (programa UCI).

---

## 5. Inventario detallado

**Leyenda:** `COMPLETE` · `PARTIAL` · `MISSING` · `DEFERRED` · `BLOCKED`

### 5.1 Recepción y Flujo (1–10) — Ola 4

| IDC | Pantalla / formulario | Función | Estado | Notas EPIS2 |
|-----|----------------------|---------|--------|-------------|
| 1 | Login de sistema | Autenticación segura | **COMPLETE** | `/login` · OIDC Ola 8 |
| 2 | Dashboard recepción | Pacientes en espera / box | **MISSING** | Tablero `recepcion` futuro |
| 3 | Agenda diaria profesional | Turnos y bloqueos | **MISSING** | Spike `/dev/scheduler-spike` |
| 4 | Calendario mensual centro | Disponibilidad macro | **MISSING** | — |
| 5 | Formulario admisión | Demografía y previsional | **MISSING** | ≠ `admission_note` clínico |
| 6 | Biometría / firma | Foto + consentimientos | **MISSING** | — |
| 7 | Sala de espera virtual | Tiempos de espera | **MISSING** | — |
| 8 | Gestión sobrecupos | Pacientes sin hora | **MISSING** | — |
| 9 | Registro acompañantes | Tutores / familiares | **MISSING** | — |
| 10 | Panel llamado (tótem) | Pantallas sala espera | **MISSING** | IoT/display externo |

### 5.2 Facturación y Caja (11–20) — Ola 5 · **DEFERRED**

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 11 | Presupuesto médico | Cotización procedimientos | **DEFERRED** |
| 12 | Cobro consulta | Pagos y copagos | **DEFERRED** |
| 13 | Boleta / factura | DTE tributario | **DEFERRED** |
| 14 | Integración aseguradoras | Bonos Isapre/Fonasa | **DEFERRED** |
| 15 | Conciliación diaria caja | Cierre turno | **DEFERRED** |
| 16 | Cuentas por cobrar | Pagos pendientes | **DEFERRED** |
| 17 | Reembolsos / anulaciones | Devoluciones | **DEFERRED** |
| 18 | Honorarios médicos | Ingresos del médico | **DEFERRED** |
| 19 | Liquidación profesionales | Pago sociedades | **DEFERRED** |
| 20 | Reporte ingresos mensuales | Gráficos facturación | **DEFERRED** |

### 5.3 Resumen Clínico (21–30) — Ola 1 / 3

| IDC | Pantalla / formulario | Función | Estado | EPIS2 |
|-----|----------------------|---------|--------|-------|
| 21 | Dashboard del paciente | Alergias, problemas, fármacos | **PARTIAL** | Ficha + resumen |
| 22 | Banner alertas clínicas | Riesgos vitales | **PARTIAL** | `ClinicalAlertsPanel` |
| 23 | Línea de tiempo | Episodios cronológicos | **PARTIAL** | Context pane + API |
| 24 | Medicamentos continuos | Terapias crónicas | **PARTIAL** | Demo context |
| 25 | Visor últimos exámenes | Lab alterado reciente | **PARTIAL** | Resultados inbox |
| 26 | Curvas signos vitales | PA, peso histórico | **PARTIAL** | Charts demo |
| 27 | Antecedentes mórbidos | Patologías previas | **MISSING** | Blueprint futuro |
| 28 | Antecedentes familiares | Riesgo genético | **MISSING** | — |
| 29 | Registro hábitos | Tabaco, alcohol, dieta | **MISSING** | — |
| 30 | Antecedentes quirúrgicos | Cirugías previas | **MISSING** | — |

### 5.4 Consulta Ambulatoria (31–40) — Ola 2

| IDC | Pantalla / formulario | Función | Estado | EPIS2 |
|-----|----------------------|---------|--------|-------|
| 31 | Anamnesis próxima | Motivo consulta | **PARTIAL** | `outpatient_visit` |
| 32 | Signos vitales / antropometría | Ingreso numérico | **PARTIAL** | Enfermería / evolución |
| 33 | Examen físico general | Plantillas normalidad | **MISSING** | — |
| 34 | Examen físico segmentario | Por aparatos | **MISSING** | — |
| 35 | Buscador diagnósticos | CIE-10 / SNOMED | **MISSING** | Catálogo staging |
| 36 | Indicaciones generales | Reposo, dieta | **PARTIAL** | Plan en SOAP |
| 37 | Evolución SOAP | S-O-A-P continuo | **COMPLETE** | `evolution_note` |
| 38 | Gestor macros / plantillas | Textos frecuentes | **PARTIAL** | Context insert |
| 39 | Cierre de episodio | Firma y bloqueo | **MISSING** | — |
| 40 | Resumen para paciente | Vista imprimible | **MISSING** | PDF resumen API ◐ |

### 5.5 Cuidados Intensivos (41–50) — Ola 13 · ver también IDC 131–140

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 41 | Dashboard monitorización UCI | Camas y gravedad | **DEFERRED** |
| 42 | Sábana clínica (flujograma) | Matriz 24 h | **DEFERRED** |
| 43 | Balance hídrico estricto | Ingresos / egresos | **DEFERRED** |
| 44 | Parámetros ventilación | PEEP, FiO2, modos | **DEFERRED** |
| 45 | Vías venosas e invasivos | Días CVC, arterial | **DEFERRED** |
| 46 | Valoración neurológica | Glasgow, RASS, CAM-ICU | **DEFERRED** |
| 47 | Escalas severidad | APACHE, SOFA, SAPS | **DEFERRED** |
| 48 | Titulación vasoactivos | µg/kg/min | **DEFERRED** |
| 49 | Sedoanalgesia | Infusiones / bolos | **DEFERRED** |
| 50 | Epicrisis traslado UCI | Alta crítico | **DEFERRED** |

### 5.6 Prescripción y Órdenes (51–60) — Ola 1 / 2

| IDC | Pantalla / formulario | Función | Estado | EPIS2 |
|-----|----------------------|---------|--------|-------|
| 51 | Buscador fármacos | Vademécum + dosis | **PARTIAL** | Receta blueprint |
| 52 | Receta médica | Dosis, vía, duración | **COMPLETE** | `prescription` |
| 53 | Receta retenida / cheque | Estupefacientes | **MISSING** | — |
| 54 | Panel interacciones | Alerta cruzada | **PARTIAL** | CDS alerts |
| 55 | Solicitud laboratorio | Paneles, cultivos | **COMPLETE** | `lab_request` |
| 56 | Solicitud imagenología | RX, TAC, RM | **PARTIAL** | `imaging_request` |
| 57 | Solicitud procedimientos | Endoscopias, biopsias | **MISSING** | — |
| 58 | Bandeja resultados lab | Valores críticos | **PARTIAL** | `ResultsInboxPage` |
| 59 | Visor DICOM (PACS) | Imágenes radiológicas | **MISSING** | — |
| 60 | Historial acumulativo | Últimos 5 exámenes | **MISSING** | — |

### 5.7 Documentos Legales (61–70) — Ola 6

| IDC | Pantalla / formulario | Función | Estado | EPIS2 |
|-----|----------------------|---------|--------|-------|
| 61 | Licencia médica | Reposo causal | **MISSING** | Chile LME DEFERRED |
| 62 | Certificado asistencia | Comprobante laboral | **MISSING** | — |
| 63 | Certificado aptitud / alta | Deportiva / laboral | **MISSING** | — |
| 64 | Derivación / interconsulta | Traslado especialista | **COMPLETE** | `referral` |
| 65 | Consentimiento informado | PDF + firma digital | **MISSING** | — |
| 66 | Notificación GES | Garantías explícitas | **DEFERRED** | Chile |
| 67 | Constatación lesiones | Médico-legal urgencias | **MISSING** | — |
| 68 | Certificado defunción | Causas de muerte | **DEFERRED** | — |
| 69 | Gestor archivos adjuntos | PDF externos | **PARTIAL** | API documentos |
| 70 | Visor fotografías clínicas | Heridas / dermatología | **MISSING** | — |

### 5.8 Epidemiología e IAAS (71–80) — Ola 7

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 71 | Vigilancia epidemiológica | Brotes y aislamientos | **PARTIAL** |
| 72 | Notificación ENO | Enfermedades obligatorias | **MISSING** |
| 73 | Sospecha IAAS | Infección asociada atención | **MISSING** |
| 74 | Resistencia antimicrobiana | Perfiles flora | **PARTIAL** |
| 75 | Registro antibiogramas | Sensibilidad cultivos | **MISSING** |
| 76 | Receta antimicrobianos | Justificación restringidos | **MISSING** |
| 77 | Precauciones aislamiento | Contacto, aéreo | **MISSING** |
| 78 | Tasa infección dispositivos | CVC, VM | **MISSING** |
| 79 | Exposiciones laborales | Cortopunzantes | **MISSING** |
| 80 | Reportes autoridad sanitaria | Informes mensuales | **MISSING** |

### 5.9 Jefatura y Administración (81–90) — Ola 8

| IDC | Pantalla / formulario | Función | Estado | EPIS2 |
|-----|----------------------|---------|--------|-------|
| 81 | Dashboard producción | KPI por servicio | **PARTIAL** | Dashboard tabs |
| 82 | Ocupación y rendimiento | Tiempos vs agendados | **MISSING** | — |
| 83 | Fichas abiertas | Episodios sin cerrar | **PARTIAL** | Borradores abiertos |
| 84 | Auditoría trazabilidad | Log inalterable | **PARTIAL** | API audit + admin tab |
| 85 | Gestión roles | Perfiles RBAC | **PARTIAL** | Demo users + admin |
| 86 | Configuración vademécum | Stock institucional | **MISSING** | — |
| 87 | Agenda global | Reprogramaciones masivas | **MISSING** | — |
| 88 | Tiempos de espera | Cuellos de botella | **MISSING** | — |
| 89 | Encuestas satisfacción | Feedback post-atención | **MISSING** | — |
| 90 | Exportación datos | Investigación masiva | **PARTIAL** | FHIR export API |

### 5.10 IA y Herramientas (91–100) — Ola 9

| IDC | Pantalla / formulario | Función | Estado | EPIS2 |
|-----|----------------------|---------|--------|-------|
| 91 | Asistente redacción local | Limpieza notas | **COMPLETE** | Assist draft API |
| 92 | Transcripción voz a texto | Dictado SOAP | **MISSING** | — |
| 93 | Panel hardware IA local | VRAM / GPU | **PARTIAL** | `local-ai` dev |
| 94 | Resumen automático clínico | Historias largas | **PARTIAL** | RAG panel |
| 95 | Sugerencia diagnóstica | Síntomas + lab | **MISSING** | No auto-diagnóstico |
| 96 | Análisis reingreso | Score riesgo | **MISSING** | — |
| 97 | Extracción PDF (OCR IA) | Exámenes externos | **PARTIAL** | API OCR demo |
| 98 | Chatbot soporte EMR | Ayuda software | **MISSING** | — |
| 99 | Sala telemedicina | Video + ficha lateral | **DEFERRED** | — |
| 100 | Portal paciente (vista admin) | App usuario final | **DEFERRED** | Fuera MVP clínico |

---

## 6. Cadena arquitectónica (formularios clínicos)

```text
comando → intent → permiso → blueprint → /espacio/<ruta>
  → GeneratedClinicalFormPage (two-pane M3)
  → borrador → aprobación humana → PostgreSQL SoT → auditoría
```

**Recepción (2–10) y facturación (11–20):** flujos operativos — pueden usar pantallas CRUD sin blueprint clínico; no sustituyen Comando como home clínico.

---

## 7. Próximos pasos planificados

1. **Ola 2:** IDC **31–40** — extender `outpatient_visit` + cierre episodio (39).
2. **Ola 3:** IDC **27–30** — blueprints antecedentes + enriquecer ficha (21–26).
3. **Ola 4:** IDC **5** demografía recepción (distinto de ingreso clínico `admission_note`).
4. Sincronizar con **Ola 10** (101–110 urgencias) en roadmap unificado.

---

## Referencias

- Índice 1–200: `EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`
- Bloque 101–200: `EPIS2_ARCHITECTURE_INVENTORY_101_200.md`
- Blueprints: `packages/clinical-forms/src/registry.ts`
- Ficha M3: `docs/design/EPIS2_PATIENT_CHART_NAVIGATION_M3.md`
