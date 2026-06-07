#!/usr/bin/env node
/**
 * Generates EPIS2 IDC execution matrix (1–200) with four canonical fields.
 * Output: docs/product/epis2-idc-execution-matrix.json
 *         docs/product/EPIS2_IDC_EXECUTION_MATRIX.md
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '../..');
const outJson = join(root, 'docs/product/epis2-idc-execution-matrix.json');
const outMd = join(root, 'docs/product/EPIS2_IDC_EXECUTION_MATRIX.md');

const ESTADOS = ['Planned', 'Active', 'Blocked', 'Done'];
const PRIORIDADES = ['Critical', 'High', 'Medium', 'Low'];
const HORIZONTES = ['Core', 'Post-core', 'Future'];
const DECISIONES = ['Build', 'Integrate', 'Defer', 'Exclude'];

/** @type {Record<number, string>} */
const NAMES = {
  1: 'Login de sistema',
  2: 'Dashboard recepción',
  3: 'Agenda diaria profesional',
  4: 'Calendario mensual centro',
  5: 'Formulario admisión',
  6: 'Biometría / firma',
  7: 'Sala de espera virtual',
  8: 'Gestión sobrecupos',
  9: 'Registro acompañantes',
  10: 'Panel llamado (tótem)',
  11: 'Presupuesto médico',
  12: 'Cobro consulta',
  13: 'Boleta / factura',
  14: 'Integración aseguradoras',
  15: 'Conciliación diaria caja',
  16: 'Cuentas por cobrar',
  17: 'Reembolsos / anulaciones',
  18: 'Honorarios médicos',
  19: 'Liquidación profesionales',
  20: 'Reporte ingresos mensuales',
  21: 'Dashboard del paciente',
  22: 'Banner alertas clínicas',
  23: 'Línea de tiempo',
  24: 'Medicamentos continuos',
  25: 'Visor últimos exámenes',
  26: 'Curvas signos vitales',
  27: 'Antecedentes mórbidos',
  28: 'Antecedentes familiares',
  29: 'Registro hábitos',
  30: 'Antecedentes quirúrgicos',
  31: 'Anamnesis próxima',
  32: 'Signos vitales / antropometría',
  33: 'Examen físico general',
  34: 'Examen físico segmentario',
  35: 'Buscador diagnósticos CIE-10',
  36: 'Indicaciones generales',
  37: 'Evolución SOAP',
  38: 'Gestor macros / plantillas',
  39: 'Cierre de episodio',
  40: 'Resumen para paciente',
  41: 'Dashboard monitorización UCI',
  42: 'Sábana clínica (flujograma)',
  43: 'Balance hídrico estricto',
  44: 'Parámetros ventilación',
  45: 'Vías venosas e invasivos',
  46: 'Valoración neurológica',
  47: 'Escalas severidad',
  48: 'Titulación vasoactivos',
  49: 'Sedoanalgesia',
  50: 'Epicrisis traslado UCI',
  51: 'Buscador fármacos',
  52: 'Receta médica',
  53: 'Receta retenida / cheque',
  54: 'Panel interacciones',
  55: 'Solicitud laboratorio',
  56: 'Solicitud imagenología',
  57: 'Solicitud procedimientos',
  58: 'Bandeja resultados lab',
  59: 'Visor DICOM (PACS)',
  60: 'Historial acumulativo exámenes',
  61: 'Licencia médica',
  62: 'Certificado asistencia',
  63: 'Certificado aptitud / alta',
  64: 'Derivación / interconsulta',
  65: 'Consentimiento informado',
  66: 'Notificación GES',
  67: 'Constatación lesiones',
  68: 'Certificado defunción',
  69: 'Gestor archivos adjuntos',
  70: 'Visor fotografías clínicas',
  71: 'Vigilancia epidemiológica',
  72: 'Notificación ENO',
  73: 'Sospecha IAAS',
  74: 'Resistencia antimicrobiana',
  75: 'Registro antibiogramas',
  76: 'Receta antimicrobianos',
  77: 'Precauciones aislamiento',
  78: 'Tasa infección dispositivos',
  79: 'Exposiciones laborales',
  80: 'Reportes autoridad sanitaria',
  81: 'Dashboard producción',
  82: 'Ocupación y rendimiento',
  83: 'Fichas abiertas',
  84: 'Auditoría trazabilidad',
  85: 'Gestión roles',
  86: 'Configuración vademécum',
  87: 'Agenda global',
  88: 'Tiempos de espera',
  89: 'Encuestas satisfacción',
  90: 'Exportación datos',
  91: 'Asistente redacción local',
  92: 'Transcripción voz a texto',
  93: 'Panel hardware IA local',
  94: 'Resumen automático clínico',
  95: 'Sugerencia diagnóstica',
  96: 'Análisis reingreso',
  97: 'Extracción PDF (OCR IA)',
  98: 'Chatbot soporte EMR',
  99: 'Sala telemedicina',
  100: 'Portal paciente (vista admin)',
  101: 'Dashboard de Urgencias',
  102: 'Categorización ESI',
  103: 'Reanimación (Clave Azul)',
  104: 'Trauma / FAST',
  105: 'Hoja observación corta',
  106: 'Traslado SAMU',
  107: 'Protocolo ACV (Stroke)',
  108: 'Protocolo IAM',
  109: 'Ingreso toxicológico',
  110: 'Alta urgencia + APS',
  111: 'Entrega de turno (SBAR)',
  112: 'Riesgo de caídas',
  113: 'Riesgo UPP (Braden/Norton)',
  114: 'Curaciones / heridas',
  115: 'Diuresis / deposiciones',
  116: 'Tarjetón (5 correctos)',
  117: 'Sujeción mecánica',
  118: 'Valoración dolor EVA/FLACC',
  119: 'Seguimiento dispositivos',
  120: 'Plan cuidados enfermería',
  121: 'Control salud cardiovascular',
  122: 'Calculadora Framingham',
  123: 'Examen medicina preventiva (EMP)',
  124: 'Pie diabético',
  125: 'Tamizaje salud mental',
  126: 'Control niño sano',
  127: 'Calendario inmunizaciones',
  128: 'Control prenatal',
  129: 'Derivación programas ministeriales',
  130: 'Visita domiciliaria integral',
  131: 'Prueba ventilación espontánea',
  132: 'Terapias renales continuas',
  133: 'Nutrición parenteral total',
  134: 'Nutrición enteral',
  135: 'Monitorización hemodinámica',
  136: 'Muerte encefálica',
  137: 'Procuramiento órganos',
  138: 'Diario UCI (humanización)',
  139: 'Seguimiento delirium',
  140: 'Protocolo decúbito prono',
  141: 'Matriz vigilancia activa',
  142: 'Alerta MDRO',
  143: 'Monitor consumo antimicrobianos',
  144: 'PROA',
  145: 'Checklist inserción CVC',
  146: 'Checklist prevención NAV',
  147: 'Adherencia higiene de manos',
  148: 'Estudio brote',
  149: 'Mapa aislamientos',
  150: 'Curvas endémicas',
  151: 'Tabla quirúrgica',
  152: 'Checklist cirugía segura OMS',
  153: 'Evaluación preanestésica',
  154: 'Hoja anestesia intraoperatoria',
  155: 'Protocolo operatorio',
  156: 'Recuento compresas / insumos',
  157: 'Biopsia intraoperatoria',
  158: 'Recuperación URPA',
  159: 'Banco de sangre',
  160: 'Esterilización / trazabilidad',
  161: 'Compatibilidad Y-Site',
  162: 'Ajuste dosis renal',
  163: 'Monitorización TDM',
  164: 'RAM',
  165: 'Conciliación medicamentos',
  166: 'Dispensación recetas',
  167: 'Carro de paro',
  168: 'Estupefacientes',
  169: 'Devolución fármacos',
  170: 'Quiebre de stock',
  171: 'Eventos adversos / centinela',
  172: 'Análisis causa raíz (ACR)',
  173: 'Comité mortalidad',
  174: 'Auditoría registros médicos',
  175: 'Reclamos OIRS',
  176: 'Clima laboral clínico',
  177: 'Trazabilidad consentimientos',
  178: 'Indicadores acreditación',
  179: 'Documentos institucionales',
  180: 'Suspensión quirúrgica',
  181: 'Partograma (obstetricia)',
  182: 'Comité oncológico',
  183: 'Odontograma',
  184: 'Informe endoscópico',
  185: 'Evaluación oftalmológica',
  186: 'Hemodiálisis ambulatoria',
  187: 'Ficha kinesiológica',
  188: 'Ficha nutricional',
  189: 'Protocolos quimioterapia',
  190: 'Seguimiento psiquiátrico',
  191: 'Panel optimización VRAM',
  192: 'Gestor agentes autónomos',
  193: 'Vibe coding clínico',
  194: 'Biblioteca prompts LLM',
  195: 'Auditoría decisiones IA',
  196: 'Traducción médica local',
  197: 'Sincronización wearables',
  198: 'Telemetría hospitalaria',
  199: 'Visor HL7 / FHIR',
  200: 'Backup y continuidad',
};

/** @type {Record<number, string>} */
const OLAS = {};
for (let i = 1; i <= 10; i++) OLAS[i] = '4';
for (let i = 11; i <= 20; i++) OLAS[i] = '5';
for (let i = 21; i <= 30; i++) OLAS[i] = '3';
for (let i = 31; i <= 40; i++) OLAS[i] = '2';
for (let i = 41; i <= 50; i++) OLAS[i] = '13';
for (let i = 51; i <= 60; i++) OLAS[i] = '1C';
for (let i = 61; i <= 70; i++) OLAS[i] = '6';
for (let i = 71; i <= 80; i++) OLAS[i] = '7';
for (let i = 81; i <= 90; i++) OLAS[i] = '8';
for (let i = 91; i <= 100; i++) OLAS[i] = '9';
for (let i = 101; i <= 110; i++) OLAS[i] = '10';
for (let i = 111; i <= 120; i++) OLAS[i] = '11';
for (let i = 121; i <= 130; i++) OLAS[i] = '12';
for (let i = 131; i <= 140; i++) OLAS[i] = '13';
for (let i = 141; i <= 150; i++) OLAS[i] = '14';
for (let i = 151; i <= 160; i++) OLAS[i] = '15';
for (let i = 161; i <= 170; i++) OLAS[i] = '16';
for (let i = 171; i <= 180; i++) OLAS[i] = '17';
for (let i = 181; i <= 190; i++) OLAS[i] = '18';
for (let i = 191; i <= 196; i++) OLAS[i] = '19';
for (let i = 197; i <= 198; i++) OLAS[i] = 'IoT';
for (let i = 199; i <= 200; i++) OLAS[i] = '20';
OLAS[1] = '0-1A';

/** @type {Record<number, string>} */
const WORKSPACES = {};
const ws = (from, to, w) => {
  for (let i = from; i <= to; i++) WORKSPACES[i] = w;
};
ws(1, 1, 'command');
ws(2, 10, 'reception');
ws(11, 20, 'billing');
ws(21, 30, 'patient-record');
ws(31, 40, 'ambulatory');
ws(41, 50, 'icu');
ws(51, 60, 'ambulatory');
ws(61, 64, 'ambulatory');
ws(65, 70, 'ambulatory');
ws(71, 80, 'quality_iaas');
ws(81, 90, 'admin_system');
ws(91, 100, 'command');
ws(101, 110, 'emergency');
ws(111, 120, 'icu');
ws(121, 130, 'ambulatory');
ws(131, 140, 'icu');
ws(141, 150, 'quality_iaas');
ws(151, 160, 'or');
ws(161, 170, 'pharmacy');
ws(171, 180, 'admin_system');
ws(181, 190, 'specialty');
ws(191, 196, 'command');
ws(197, 198, 'iot');
ws(199, 200, 'admin_system');

/**
 * @typedef {{ estado: string, prioridad: string, horizonte: string, decision: string, legacy?: string, nota?: string }} RowFields
 */

/** @type {Record<number, RowFields>} */
const OVERRIDES = {
  1: { estado: 'Done', prioridad: 'Critical', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: '/login' },
  2: { estado: 'Done', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-B-002 ReceptionDashboardTab + E2E' },
  3: { estado: 'Done', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-B-002 agenda en tablero recepción' },
  4: { estado: 'Done', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-B-002 calendario demo recepción' },
  5: { estado: 'Done', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-B-002 admisión admin panel (≠ admission_note)' },
  6: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING', nota: 'MF-TRAMO-B-002 biometría Tramo B+' },
  7: { estado: 'Done', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-B-002 sala espera virtual demo' },
  8: { estado: 'Done', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-B-002 sobrecupos métrica demo' },
  9: { estado: 'Done', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-B-002 acompañantes métrica demo' },
  10: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Integrate', legacy: 'MISSING', nota: 'MF-TRAMO-B-002 panel llamado demo; IoT Future' },
  11: { nota: 'MF-TRAMO-B-001 facturación Defer Tramo B' },
  20: { nota: 'MF-TRAMO-B-001 facturación Defer Tramo B' },
  101: { estado: 'Active', prioridad: 'Critical', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-C-002 EmergencyDashboardTab triaje demo' },
  102: { estado: 'Active', prioridad: 'Critical', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-C-002 workspace emergency' },
  103: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-C-002 panel reanimación demo' },
  104: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-C-002 trauma FAST demo' },
  105: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'MF-TRAMO-C-002 observación corta demo' },
  21: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'PatientWorkspacePage hub M3 + E2E MF-OLA3-006' },
  22: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'ClinicalAlertsPanel ficha + E2E DEMO-005 MF-OLA3-003' },
  23: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'timeline ficha + E2E DEMO-001 MF-OLA3-005' },
  24: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'medicamentos activos ficha MF-OLA3-005' },
  25: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'LabObservationsGrid + CTA resultados MF-OLA3-005' },
  26: { estado: 'Done', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'PatientClinicalCharts DEMO-005 MF-OLA3-005' },
  27: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'allergy_entry + E2E ficha MF-OLA3-004' },
  28: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'allergy_entry + E2E ficha MF-OLA3-004' },
  29: { estado: 'Done', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'clinical_problem_entry + E2E ficha MF-OLA3-004' },
  30: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'problemCategory + sección Ant.Qx MF-OLA3-007' },
  31: { estado: 'Done', prioridad: 'Critical', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'outpatient_visit anamnesis — MF-OLA2-001' },
  32: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'vitals section scrollspy' },
  33: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'physical-general accordion + E2E MF-OLA2-003' },
  34: { estado: 'Done', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'physical-segment accordion MF-OLA2-003' },
  35: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'icd10Code diagnosis section MF-OLA2-003' },
  36: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'plan + indicaciones generales' },
  37: { estado: 'Done', prioridad: 'Critical', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'evolution_note' },
  38: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Defer', legacy: 'PARTIAL', nota: 'MF-TRAMO-A-CLOSURE — macros EPIS diferidas; consulta usa textarea libre' },
  39: { estado: 'Done', prioridad: 'Critical', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'closeEncounter + FAB cierre Ola 2' },
  40: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'PrintA5 + E2E MF-OLA6A-002 — vista documental (no firma auto)' },
  51: { estado: 'Active', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL' },
  52: { estado: 'Done', prioridad: 'Critical', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'prescription' },
  54: { estado: 'Active', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL' },
  55: { estado: 'Done', prioridad: 'Critical', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'lab_request' },
  56: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'imaging_request + journey MF-OLA1C-003' },
  58: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'ResultsInboxPage + tendencias MF-TRAMO-C-005 + journey MF-OLA1C-001' },
  59: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Integrate', legacy: 'MISSING', nota: 'PACS externo' },
  64: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'referral' },
  62: { estado: 'Done', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'medical_certificate Ola 2 + print A5' },
  69: { estado: 'Active', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL' },
  71: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  74: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  81: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  83: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  84: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  85: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  90: { estado: 'Active', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'FHIR export' },
  91: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE', nota: 'Assist draft API' },
  93: { estado: 'Active', prioridad: 'Low', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL' },
  94: { estado: 'Active', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL' },
  95: { estado: 'Blocked', prioridad: 'Low', horizonte: 'Future', decision: 'Exclude', legacy: 'MISSING', nota: 'No auto-diagnóstico (invariante)' },
  97: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  99: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED' },
  100: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Integrate', legacy: 'DEFERRED', nota: 'Portal externo' },
  106: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'transfer_note' },
  110: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'CTA epicrisis tablero urgencias MF-TRAMO-C-006' },
  111: { estado: 'Done', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'nursing_note + CTA ficha MF-TRAMO-C-003' },
  116: { estado: 'Active', prioridad: 'Critical', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'medication_administration' },
  120: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  130: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  143: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  165: { estado: 'Done', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'COMPLETE' },
  166: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  171: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  178: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  191: { estado: 'Active', prioridad: 'Low', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  193: { estado: 'Active', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL', nota: 'BlueprintStudioPanel' },
  195: { estado: 'Active', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'PARTIAL', nota: 'ai_runs' },
  199: { estado: 'Active', prioridad: 'High', horizonte: 'Core', decision: 'Integrate', legacy: 'PARTIAL', nota: 'API + quarantine' },
  200: { estado: 'Active', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'PARTIAL' },
  14: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Integrate', legacy: 'DEFERRED', nota: 'Isapre/Fonasa' },
  66: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED', nota: 'GES Chile' },
  61: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'MISSING', nota: 'LME Chile' },
  68: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED' },
  98: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Exclude', legacy: 'MISSING', nota: 'Fuera alcance clínico MVP' },
};

/** MF-TRAMO-B-001 — facturación IDC 11–20 (Defer; 14 Integrate). */
for (let id = 11; id <= 20; id++) {
  if (id === 14) continue;
  const nota = OVERRIDES[id]?.nota ?? 'MF-TRAMO-B-001 facturación Defer Tramo B';
  OVERRIDES[id] = {
    estado: 'Planned',
    prioridad: 'Low',
    horizonte: 'Future',
    decision: 'Defer',
    legacy: 'DEFERRED',
    nota,
  };
}
OVERRIDES[14] = {
  estado: 'Planned',
  prioridad: 'Low',
  horizonte: 'Future',
  decision: 'Integrate',
  legacy: 'DEFERRED',
  nota: 'MF-TRAMO-B-001 Isapre/Fonasa Integrate Future',
};

/** @type {Array<{ from: number, to: number, fields: RowFields }>} */
const RANGE_DEFAULTS = [
  { from: 2, to: 10, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 11, to: 20, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED' } },
  { from: 41, to: 50, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED', nota: 'UCI Tramo D; duplica 131–140' } },
  { from: 53, to: 53, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' } },
  { from: 57, to: 57, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' } },
  { from: 60, to: 60, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' } },
  { from: 63, to: 63, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' } },
  { from: 65, to: 67, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 70, to: 70, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 72, to: 73, fields: { estado: 'Planned', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 75, to: 80, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 82, to: 82, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 86, to: 89, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 92, to: 92, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 96, to: 96, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Build', legacy: 'MISSING' } },
  { from: 101, to: 105, fields: { estado: 'Planned', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING', nota: 'Workspace emergency Tramo C' } },
  { from: 107, to: 109, fields: { estado: 'Planned', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 112, to: 115, fields: { estado: 'Planned', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 117, to: 119, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 121, to: 129, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Future', decision: 'Defer', legacy: 'MISSING', nota: 'Programas APS ministeriales' } },
  { from: 131, to: 140, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED', nota: 'UCI especializada Tramo D' } },
  { from: 141, to: 142, fields: { estado: 'Planned', prioridad: 'High', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 144, to: 150, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 151, to: 160, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'MISSING', nota: 'Pabellón Ola 15' } },
  { from: 161, to: 164, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 167, to: 170, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 172, to: 177, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 179, to: 180, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 181, to: 190, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED', nota: 'Especialidades Ola 18' } },
  { from: 192, to: 192, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'MISSING' } },
  { from: 194, to: 194, fields: { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' } },
  { from: 196, to: 196, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'MISSING' } },
  { from: 197, to: 198, fields: { estado: 'Planned', prioridad: 'Low', horizonte: 'Future', decision: 'Defer', legacy: 'DEFERRED' } },
];

/** @returns {RowFields} */
function defaultFields(id) {
  if (id >= 21 && id <= 30 && !OVERRIDES[id]) {
    return { estado: 'Planned', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' };
  }
  if (id >= 31 && id <= 40 && !OVERRIDES[id]) {
    return { estado: 'Planned', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' };
  }
  if (id >= 51 && id <= 60 && !OVERRIDES[id]) {
    return { estado: 'Planned', prioridad: 'High', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' };
  }
  if (id >= 91 && id <= 97 && !OVERRIDES[id]) {
    return { estado: 'Planned', prioridad: 'Medium', horizonte: 'Core', decision: 'Build', legacy: 'MISSING' };
  }
  return { estado: 'Planned', prioridad: 'Medium', horizonte: 'Post-core', decision: 'Build', legacy: 'MISSING' };
}

/** @type {Map<number, RowFields>} */
const resolved = new Map();

for (let id = 1; id <= 200; id++) {
  resolved.set(id, { ...defaultFields(id) });
}

for (const range of RANGE_DEFAULTS) {
  for (let id = range.from; id <= range.to; id++) {
    if (!OVERRIDES[id]) resolved.set(id, { ...range.fields });
  }
}

for (const [idStr, fields] of Object.entries(OVERRIDES)) {
  resolved.set(Number(idStr), { ...resolved.get(Number(idStr)), ...fields });
}

/** @type {Array<object>} */
const matrix = [];
for (let id = 1; id <= 200; id++) {
  const f = resolved.get(id);
  matrix.push({
    idc: id,
    nombre: NAMES[id],
    ola: OLAS[id],
    workspace: WORKSPACES[id],
    estado: f.estado,
    prioridad: f.prioridad,
    horizonte: f.horizonte,
    decision: f.decision,
    legacyEstado: f.legacy ?? 'MISSING',
    nota: f.nota ?? '',
  });
}

// Validation
if (matrix.length !== 200) throw new Error(`Expected 200 rows, got ${matrix.length}`);
const ids = new Set(matrix.map((r) => r.idc));
if (ids.size !== 200) throw new Error('Duplicate IDC ids');

for (const row of matrix) {
  if (!ESTADOS.includes(row.estado)) throw new Error(`IDC ${row.idc} invalid estado`);
  if (!PRIORIDADES.includes(row.prioridad)) throw new Error(`IDC ${row.idc} invalid prioridad`);
  if (!HORIZONTES.includes(row.horizonte)) throw new Error(`IDC ${row.idc} invalid horizonte`);
  if (!DECISIONES.includes(row.decision)) throw new Error(`IDC ${row.idc} invalid decision`);
}

const stats = {
  generatedAt: new Date().toISOString().slice(0, 10),
  version: '1.0',
  canon: 'EPIS2_WAVE_EXECUTION_CANON.md',
  totals: {
    estado: Object.fromEntries(ESTADOS.map((k) => [k, matrix.filter((r) => r.estado === k).length])),
    prioridad: Object.fromEntries(PRIORIDADES.map((k) => [k, matrix.filter((r) => r.prioridad === k).length])),
    horizonte: Object.fromEntries(HORIZONTES.map((k) => [k, matrix.filter((r) => r.horizonte === k).length])),
    decision: Object.fromEntries(DECISIONES.map((k) => [k, matrix.filter((r) => r.decision === k).length])),
  },
};

const payload = { meta: stats, items: matrix };
writeFileSync(outJson, JSON.stringify(payload, null, 2) + '\n', 'utf8');

const sections = [
  [1, 10, 'Recepción y flujo'],
  [11, 20, 'Facturación y caja'],
  [21, 30, 'Resumen clínico (ficha)'],
  [31, 40, 'Consulta ambulatoria'],
  [41, 50, 'UCI (bloque 41–50)'],
  [51, 60, 'Prescripción y órdenes'],
  [61, 70, 'Documentos legales'],
  [71, 80, 'Epidemiología e IAAS'],
  [81, 90, 'Jefatura y administración'],
  [91, 100, 'IA y herramientas'],
  [101, 110, 'Urgencias y triage'],
  [111, 120, 'Enfermería y cuidados'],
  [121, 130, 'Medicina general y APS'],
  [131, 140, 'UCI avanzada'],
  [141, 150, 'IAAS avanzada'],
  [151, 160, 'Pabellón y anestesia'],
  [161, 170, 'Farmacia clínica'],
  [171, 180, 'Calidad y auditoría'],
  [181, 190, 'Especialidades'],
  [191, 196, 'IA y hardware local'],
  [197, 198, 'Integración IoT'],
  [199, 200, 'Interoperabilidad'],
];

let md = `# EPIS2 — Matriz de ejecución IDC 1–200

**Versión:** 1.0 · **Generado:** ${stats.generatedAt}  
**Canon:** [\`EPIS2_WAVE_EXECUTION_CANON.md\`](./EPIS2_WAVE_EXECUTION_CANON.md)  
**Fuente machine-readable:** [\`epis2-idc-execution-matrix.json\`](./epis2-idc-execution-matrix.json)

> Cuatro campos obligatorios por ítem: **Estado** · **Prioridad** · **Horizonte** · **Decisión**  
> Regenerar: \`node scripts/product/generate-idc-matrix.mjs\`

---

## Resumen cuadruple

| Campo | Distribución |
|-------|--------------|
| **Estado** | ${ESTADOS.map((k) => `${k}: ${stats.totals.estado[k]}`).join(' · ')} |
| **Prioridad** | ${PRIORIDADES.map((k) => `${k}: ${stats.totals.prioridad[k]}`).join(' · ')} |
| **Horizonte** | ${HORIZONTES.map((k) => `${k}: ${stats.totals.horizonte[k]}`).join(' · ')} |
| **Decisión** | ${DECISIONES.map((k) => `${k}: ${stats.totals.decision[k]}`).join(' · ')} |

### Leyenda

| Campo | Valores |
|-------|---------|
| Estado | \`Planned\` · \`Active\` · \`Blocked\` · \`Done\` |
| Prioridad | \`Critical\` · \`High\` · \`Medium\` · \`Low\` |
| Horizonte | \`Core\` · \`Post-core\` · \`Future\` |
| Decisión | \`Build\` · \`Integrate\` · \`Defer\` · \`Exclude\` |

**Done (Core):** IDC 1, 37, 52, 55, 64, 91, 165 — más parciales en **Active** (Olas 2–3, 1C).

---

`;

for (const [from, to, title] of sections) {
  md += `## ${title} (${from}–${to})\n\n`;
  md += '| IDC | Nombre | Ola | Workspace | Estado | Prioridad | Horizonte | Decisión | Legacy | Nota |\n';
  md += '|-----|--------|-----|-----------|--------|-----------|-----------|----------|--------|------|\n';
  for (const row of matrix.filter((r) => r.idc >= from && r.idc <= to)) {
    md += `| ${row.idc} | ${row.nombre} | ${row.ola} | ${row.workspace} | ${row.estado} | ${row.prioridad} | ${row.horizonte} | ${row.decision} | ${row.legacyEstado} | ${row.nota.replace(/\|/g, '\\|')} |\n`;
  }
  md += '\n';
}

md += `---

## Referencias

- Inventario 1–100: \`EPIS2_ARCHITECTURE_INVENTORY_001_100.md\`
- Inventario 101–200: \`EPIS2_ARCHITECTURE_INVENTORY_101_200.md\`
- Workspaces: \`EPIS2_INVENTORY_WORKSPACE_MATRIX.md\`
`;

writeFileSync(outMd, md, 'utf8');

console.log(`Wrote ${outJson}`);
console.log(`Wrote ${outMd}`);
console.log('Stats:', JSON.stringify(stats.totals, null, 2));
