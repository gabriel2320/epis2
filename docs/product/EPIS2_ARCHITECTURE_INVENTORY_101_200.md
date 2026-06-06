# EPIS2 — Inventario de arquitectura: pantallas y formularios (IDC 101–200)

**Versión:** 1.1 · **Fecha:** 2026-06-04  
**Alcance:** Planificación y trazabilidad — **sin implementación masiva**  
**Índice maestro 1–200:** [`EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md`](./EPIS2_ARCHITECTURE_INVENTORY_MEDICAL_RECORD.md)  
**Bloque anterior:** [`EPIS2_ARCHITECTURE_INVENTORY_001_100.md`](./EPIS2_ARCHITECTURE_INVENTORY_001_100.md)

---

## 1. Reglas de planificación (canon EPIS2)

| Regla | Implicación para IDC 101–200 |
|-------|------------------------------|
| Home = **Centro de Comando** (`/comando`) | Dashboards operativos (101, 141, 178…) son **Modo tablero** o widgets — nunca home |
| Un **Clinical Form Registry** | Cada formulario nuevo = blueprint + `legacy-import-manifest` si aplica |
| Borrador ≠ dato aprobado | Formularios clínicos → draft → aprobación humana → SoT PostgreSQL |
| IA no aprueba ni firma | IDC 191–196 asisten; no sustituyen aprobación |
| Command-first | Toda pantalla clínica debe tener intent o entrada desde ficha/comando |
| UI 100 % español | Copy en `packages/design-system/src/copy/es.ts` |
| Sin OpenMRS / Carbon / dashboard home | Tableros = `/epis2/dashboard?tab=` o shell M3 secundario |

**Patrón de ruta propuesto:** `/espacio/<segmento>` · blueprintId snake_case · intent en `command-registry`.

**Scaffold:** Admin → Formularios (`BlueprintStudioPanel`) + gates `architecture:validate`.

---

## 2. Resumen ejecutivo

| Métrica | Valor |
|---------|-------|
| Ítems inventariados (101–200) | **100** |
| **COMPLETE** (cadena cerrada o pantalla operativa) | **0** |
| **PARTIAL** (solape con MVP / API / tablero) | **14** |
| **MISSING** (planificado, sin UI) | **78** |
| **DEFERRED** (fuera MVP; dominio especializado) | **8** |
| Cobertura estimada del bloque 101–200 | **~6 %** |

**Baseline implementado hoy (fuera del rango 101–200 pero relevante):** 19 blueprints, ficha M3 5 tabs, Modo tablero 6 tabs, Centro de Comando, estudio formularios admin.

---

## 3. Solapes con implementación actual

| IDC | Nombre | EPIS2 hoy | Gap principal |
|-----|--------|-----------|---------------|
| 111 | Entrega de turno (SBAR) | `nursing_note` **PARTIAL** | Estructura SBAR + handover entre turnos |
| 116 | Tarjetón / 5 correctos | `medication_administration` **PARTIAL** | Grilla horaria MAR programado |
| 120 | Plan cuidados NANDA/NIC | `nursing_note` **PARTIAL** | Taxonomías enfermería |
| 130 | Visita domiciliaria | `outpatient_visit` **PARTIAL** | Offline-first, geolocalización |
| 165 | Conciliación medicamentosa | `medication_reconciliation` **COMPLETE** | — |
| 166 | Dispensación recetas | `pharmacy_validation` + tab farmacia **PARTIAL** | Despacho ambulatorio |
| 171 | Eventos adversos | Tab calidad **PARTIAL** | Formulario centinela + workflow |
| 178 | Indicadores acreditación | `QualityDashboardTab` **PARTIAL** | Métricas institucionales |
| 193 | Vibe coding clínico | `BlueprintStudioPanel` **PARTIAL** | Solo scaffold TS; no runtime |
| 195 | Auditoría decisiones IA | `ai_runs` API **PARTIAL** | UI trazabilidad clínica |
| 199 | Visor HL7/FHIR | HL7 quarantine + FHIR export API **PARTIAL** | Consola técnica unificada |
| 200 | Backup / continuidad | Admin ops tab **PARTIAL** | Panel continuidad offline |

---

## 4. Olas de producto propuestas (101–200)

| Ola | IDC | Dominio | Prioridad | Dependencias |
|-----|-----|---------|-----------|--------------|
| **Ola 10** | 101–110 | Urgencias y triage | Alta (hospital) | Encuentros, ingreso, tiempos |
| **Ola 11** | 111–120 | Enfermería ampliada | Alta | MAR V3, ingreso, ficha |
| **Ola 12** | 121–130 | Medicina general / APS | Media | Ambulatorio, programas Chile |
| **Ola 13** | 131–140 | UCI | Baja MVP | Monitorización, órdenes críticas |
| **Ola 14** | 141–150 | IAAS avanzada | Media | Antimicrobianos, cultivo, admin |
| **Ola 15** | 151–160 | Pabellón y anestesia | Baja | Agendamiento, consentimientos |
| **Ola 16** | 161–170 | Farmacia clínica ampliada | Media | Conciliación ✓, TDM, RAM |
| **Ola 17** | 171–180 | Calidad y auditoría | Media | Admin console, auditoría API |
| **Ola 18** | 181–190 | Especialidades | **DEFERRED** | Módulos gráficos (partograma, odontograma) |
| **Ola 19** | 191–196 | IA / hardware local | Media | Ola 7 IA ✓, GPU ops |
| **Ola 20** | 197–200 | IoT e interoperabilidad | Media–baja | HL7 ✓ parcial, wearables **DEFERRED** |

**Secuencia recomendada post-MVP v1:** Ola 10 → 11 → 16 → 17 → 12 → 14 → 19 → 20. UCI (13), Pabellón (15) y Especialidades (18) en programa institucional separado.

---

## 5. Inventario detallado

**Leyenda estado:** `COMPLETE` · `PARTIAL` · `MISSING` · `DEFERRED` · `BLOCKED`

### 5.1 Urgencias y Triage (101–110) — Ola 10

| IDC | Pantalla / formulario | Función | Estado | Blueprint propuesto | Entrada |
|-----|----------------------|---------|--------|---------------------|---------|
| 101 | Dashboard de Urgencias | Pacientes por gravedad y tiempos límite | **MISSING** | — (tablero `urgencias`) | `/epis2/dashboard?tab=urgencias` |
| 102 | Categorización ESI | Triage interactivo N1–N5 | **MISSING** | `esi_triage` | Comando + ingreso urgencia |
| 103 | Reanimación (Clave Azul) | Checklist paro cardiorrespiratorio | **MISSING** | `code_blue_record` | Comando urgente |
| 104 | Trauma / FAST | Evaluación secundaria + ecografía | **MISSING** | `trauma_fast` | Ficha + urgencias |
| 105 | Hoja observación corta | Evolución camilla tránsito | **MISSING** | `ed_observation` | Extensión `ed_observation` |
| 106 | Traslado SAMU | Derivación prehospitalaria | **PARTIAL** | `transfer_note` | Ampliar traslado interinstitucional |
| 107 | Protocolo ACV (Stroke) | Puerta-aguja trombólisis | **MISSING** | `stroke_pathway` | Tablero + timer clínico |
| 108 | Protocolo IAM | Tiempos ECG / enzimas | **MISSING** | `stemi_pathway` | Tablero cardiología |
| 109 | Ingreso toxicológico | Intoxicación, antídotos, exposición | **MISSING** | `toxicology_intake` | Comando + ingreso |
| 110 | Alta urgencia + APS | Cierre + derivación ambulatoria | **PARTIAL** | `discharge_summary` | Alta ambulatoria post-ED |

### 5.2 Enfermería y Cuidados (111–120) — Ola 11

| IDC | Pantalla / formulario | Función | Estado | Blueprint / notas |
|-----|----------------------|---------|--------|-------------------|
| 111 | Entrega de turno (SBAR) | Handover estructurado | **PARTIAL** | `nursing_handover` ← extiende enfermería |
| 112 | Riesgo de caídas | Escala + protocolo | **MISSING** | `fall_risk_assessment` |
| 113 | Riesgo UPP (Braden/Norton) | Escalas UPP | **MISSING** | `pressure_ulcer_risk` |
| 114 | Curaciones / heridas | Mapa corporal interactivo | **MISSING** | `wound_care_map` (widget + form) |
| 115 | Diuresis / deposiciones | Grilla horaria eliminación | **MISSING** | `intake_output_log` |
| 116 | Tarjetón (5 correctos) | Administración medicamentos | **PARTIAL** | `medication_administration` ✓ |
| 117 | Sujeción mecánica | Justificación + revisión | **MISSING** | `restraint_protocol` |
| 118 | Valoración dolor EVA/FLACC | Registro post-analgesia | **MISSING** | `pain_assessment` |
| 119 | Seguimiento dispositivos | VVP, SNG, ostomías | **MISSING** | `device_tracking` |
| 120 | Plan cuidados enfermería | NANDA / NIC / NOC | **PARTIAL** | `nursing_care_plan` |

### 5.3 Medicina General y APS (121–130) — Ola 12

| IDC | Pantalla / formulario | Función | Estado | Notas |
|-----|----------------------|---------|--------|-------|
| 121 | Control salud cardiovascular | Metas HbA1c, PA, colesterol (PSCV) | **MISSING** | Programa ministerial Chile |
| 122 | Calculadora Framingham | Riesgo CV 10 años | **MISSING** | Widget + form read-only |
| 123 | Examen medicina preventiva (EMP) | Tamizaje por edad | **MISSING** | Checklist APS |
| 124 | Pie diabético | Monofilamento + pulsos | **MISSING** | Form + diagrama |
| 125 | Tamizaje salud mental | PHQ-9, GAD-7 | **MISSING** | Cuestionarios auto-puntuados |
| 126 | Control niño sano | Curvas OMS | **MISSING** | Gráficos crecimiento |
| 127 | Calendario inmunizaciones | PNI Chile | **MISSING** | Catálogo + registro |
| 128 | Control prenatal | EG, AU, latidos | **MISSING** | Form obstétrico básico |
| 129 | Derivación programas ministeriales | ERA, IRA, artrosis | **MISSING** | Enrolamiento |
| 130 | Visita domiciliaria integral | Atención extramural offline | **PARTIAL** | Extender `outpatient_visit` |

### 5.4 Cuidados Intensivos (131–140) — Ola 13 · **DEFERRED** MVP

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 131 | Prueba ventilación espontánea | Destete (Tobin, Pimax) | **DEFERRED** |
| 132 | Terapias renales continuas | Hemofiltración / HD continua | **DEFERRED** |
| 133 | Nutrición parenteral total | Calculadora NPT | **DEFERRED** |
| 134 | Nutrición enteral | Débito, residuo, progresión | **DEFERRED** |
| 135 | Monitorización hemodinámica | GC, PVC, PiCCO, Swan | **DEFERRED** |
| 136 | Muerte encefálica | Checklist legal-clínico | **DEFERRED** |
| 137 | Procuramiento órganos | Enlace trasplante | **DEFERRED** |
| 138 | Diario UCI (humanización) | Narrativa post-alta | **DEFERRED** |
| 139 | Seguimiento delirium | CAM-ICU | **DEFERRED** |
| 140 | Protocolo decúbito prono | SDRA, tiempos giro | **DEFERRED** |

### 5.5 Gestión IAAS Avanzada (141–150) — Ola 14

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 141 | Matriz vigilancia activa | Cultivos vigilancia ERC/SAMR | **MISSING** |
| 142 | Alerta MDRO | Colonizados / infectados | **MISSING** |
| 143 | Monitor consumo antimicrobianos | DDD por servicio | **PARTIAL** (métricas demo calidad) |
| 144 | PROA | Auditoría antibióticos empíricos | **MISSING** |
| 145 | Checklist inserción CVC | Prácticas seguras | **MISSING** |
| 146 | Checklist prevención NAV | Paquete VAP | **MISSING** |
| 147 | Adherencia higiene de manos | 5 momentos WHO | **MISSING** |
| 148 | Estudio brote | Panel temporal-espacial | **MISSING** |
| 149 | Mapa aislamientos | Plano clínica + banderas | **MISSING** |
| 150 | Curvas endémicas | Control estadístico tasas | **MISSING** |

### 5.6 Pabellón y Anestesia (151–160) — Ola 15 · **DEFERRED** MVP corto plazo

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 151 | Tabla quirúrgica | Agendamiento quirófanos | **MISSING** |
| 152 | Checklist cirugía segura OMS | Pausas pre-inducción/incisión | **MISSING** |
| 153 | Evaluación preanestésica | ASA, Mallampati, alergias | **MISSING** |
| 154 | Hoja anestesia intraoperatoria | Grilla minuto a minuto | **MISSING** |
| 155 | Protocolo operatorio | Descripción técnica cirujano | **MISSING** |
| 156 | Recuento compresas / insumos | Validación enfermería pabellón | **MISSING** |
| 157 | Biopsia intraoperatoria | Solicitud urgente AP | **MISSING** |
| 158 | Recuperación URPA | Escala Aldrete | **MISSING** |
| 159 | Banco de sangre | Transfusión hemoderivados | **MISSING** |
| 160 | Esterilización / trazabilidad | Lote instrumental | **MISSING** |

### 5.7 Farmacia Clínica (161–170) — Ola 16

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 161 | Compatibilidad Y-Site | Calculadora vía venosa | **MISSING** |
| 162 | Ajuste dosis renal | ClCr → antibióticos | **MISSING** |
| 163 | Monitorización TDM | Vancomicina / aminoglucósidos | **MISSING** |
| 164 | RAM | Reacciones adversas regulatorias | **MISSING** |
| 165 | Conciliación medicamentos | Hogar vs hospital | **COMPLETE** ✓ |
| 166 | Dispensación recetas | Despacho ambulatorio | **PARTIAL** |
| 167 | Carro de paro | Checklist insumos / caducidad | **MISSING** |
| 168 | Estupefacientes | Libro electrónico saldos | **MISSING** |
| 169 | Devolución fármacos | Alta paciente | **MISSING** |
| 170 | Quiebre de stock | Panel compras | **MISSING** |

### 5.8 Calidad y Auditoría (171–180) — Ola 17

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 171 | Eventos adversos / centinela | Reporte incidentes | **PARTIAL** |
| 172 | Análisis causa raíz (ACR) | Investigación post-evento | **MISSING** |
| 173 | Comité mortalidad | Revisión fallecimientos | **MISSING** |
| 174 | Auditoría registros médicos | Completitud fichas | **MISSING** |
| 175 | Reclamos OIRS | Quejas pacientes | **MISSING** |
| 176 | Clima laboral clínico | Encuesta equipos | **MISSING** |
| 177 | Trazabilidad consentimientos | Auditoría firmas | **MISSING** |
| 178 | Indicadores acreditación | Dashboard certificación | **PARTIAL** |
| 179 | Documentos institucionales | Repositorio guías | **MISSING** |
| 180 | Suspensión quirúrgica | Cancelaciones + causas | **MISSING** |

### 5.9 Especialidades (181–190) — Ola 18 · **DEFERRED**

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 181 | Partograma (obstetricia) | Dilatación / descenso fetal | **DEFERRED** |
| 182 | Comité oncológico | Tumor board | **DEFERRED** |
| 183 | Odontograma | Estado dental interactivo | **DEFERRED** |
| 184 | Informe endoscópico | Hallazgos + imágenes | **DEFERRED** |
| 185 | Evaluación oftalmológica | AV, tonometría, fondo | **DEFERRED** |
| 186 | Hemodiálisis ambulatoria | Sesión, UF, FAV | **DEFERRED** |
| 187 | Ficha kinesiológica | Goniometría, plan | **DEFERRED** |
| 188 | Ficha nutricional | Recordatorio 24h, bioimpedancia | **DEFERRED** |
| 189 | Protocolos quimioterapia | Ciclos, m², premedicación | **DEFERRED** |
| 190 | Seguimiento psiquiátrico | Examen mental, ECT | **DEFERRED** |

### 5.10 IA y Hardware Local (191–196) — Ola 19

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 191 | Panel optimización VRAM | Consumo GPU local | **PARTIAL** (`local-ai`, dev) |
| 192 | Gestor agentes autónomos | Coordinación extracción datos | **MISSING** |
| 193 | Vibe coding clínico | Formularios en lenguaje natural | **PARTIAL** (`BlueprintStudioPanel`) |
| 194 | Biblioteca prompts LLM | Plantillas resumen clínico | **MISSING** |
| 195 | Auditoría decisiones IA | Trazabilidad sugerencias | **PARTIAL** (`ai_runs`) |
| 196 | Traducción médica local | Offline multidioma | **MISSING** |

### 5.11 Integración IoT (197–198) — **DEFERRED**

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 197 | Sincronización wearables | Apple Watch / Garmin | **DEFERRED** |
| 198 | Telemetría hospitalaria | Monitor salas comunes | **DEFERRED** |

### 5.12 Interoperabilidad (199–200) — Ola 20

| IDC | Pantalla / formulario | Función | Estado |
|-----|----------------------|---------|--------|
| 199 | Visor HL7 / FHIR | Consola mensajería lab ↔ ficha | **PARTIAL** (API + quarantine) |
| 200 | Backup y continuidad | Servidores locales / offline | **PARTIAL** (admin ops) |

---

## 6. Conexión arquitectónica (plantilla por ítem)

Para cada ítem **MISSING** que pase a implementación:

```text
comando (intent) → permiso RBAC → blueprint → /espacio/<ruta>
  → GeneratedClinicalFormPage | DashboardTab | AdminTab
  → API draft | read model
  → aprobación humana (si clínico)
  → auditoría append-only
```

**Tableros (101, 141, 178…):** no requieren blueprint; requieren tab en `DashboardModeContent` + API agregada + widget registry.

**Checklists urgentes (103, 152):** blueprint `outputKind: CLINICAL_NOTE_DRAFT` con secciones tipo checklist; prioridad UI M3 touch 48dp.

---

## 7. Brechas de documentación corregidas en esta revisión

| Documento | Acción |
|-----------|--------|
| `EPIS2_COMPLETE_SCREEN_CATALOG.md` | §23 — referencia cruzada 101–200 |
| `EPIS2_COMPLETE_FORM_CATALOG.md` | §5 — extensiones blueprint por ola |
| `EPIS2_COMPLETION_ROADMAP.md` | Olas 10–20 |
| `EPIS2_SCREEN_CONNECTION_MAP.md` | Pendiente: cadenas por ola al implementar |
| `reports/epis2-global-screen-form-audit.md` | Enlace a este inventario |

**Desactualización detectada:** `EPIS2_COMPLETE_SCREEN_CATALOG.md` §20 lista 18 rutas; router actual tiene **22+ rutas** (`/espacio/ingreso`, `/alergia`, `/resultados`, `/admin`, `/preferencias-apariencia`, etc.). Actualizar en ola de mantenimiento doc.

---

## 8. Próximos pasos planificados (sin código masivo)

1. **Ola 10 piloto:** IDC 102 (ESI) + 101 (tab urgencias) — un blueprint + un tablero.
2. **Ola 11:** IDC 111 (SBAR handover) + 112–113 (escalas) — extienden enfermería.
3. **Actualizar** `EPIS2_SCREEN_CONNECTION_MAP.md` al cerrar cada blueprint nuevo.
4. **Golden journey** por ola — no declarar cobertura 101–200 sin journey dedicado.

---

## Referencias

- Canon: `docs/PRODUCT_CANON.md` · `docs/product/PRODUCT_INVARIANTS.md`
- Blueprint contract: `docs/clinical/BLUEPRINT_CONTRACT.md`
- Ficha M3: `docs/design/EPIS2_PATIENT_CHART_NAVIGATION_M3.md`
- Auditoría MVP: `reports/epis2-global-screen-form-audit.md`
