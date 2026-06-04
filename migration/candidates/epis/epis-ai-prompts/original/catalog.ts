import {
  CHECKLIST_SCHEMA,
  HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  JSON_PROBLEMS_SCHEMA,
  RAG_PLAIN_TEXT_SCHEMA,
  SOAP_SCHEMA,
  checklistFormatInstructions,
  hechosInferenciasSugerenciasInstructions,
  soapFormatInstructions,
} from "./schemas.js";
import {
  buildClinicalAssistantPreamble,
  contextBlock,
  DEFAULT_CLINICAL_SECURITY,
  optionalClinicianIntentBlock,
} from "./safety.js";
import type { ClinicalPromptDefinition } from "./types.js";

const CONTEXT_VAR = {
  name: "contextSummaryText",
  required: true,
  description: "Resumen estructurado del contexto clínico OpenMRS",
};

const OPTIONAL_INTENT_VAR = {
  name: "clinicianIntent",
  required: false,
  description: "Orientación opcional del clínico (no ejecutable)",
};

function requireContext(variables: Record<string, string>): string {
  const value = variables.contextSummaryText?.trim();
  if (!value) {
    throw new Error("contextSummaryText is required");
  }
  return value;
}

function userPromptLines(
  task: string,
  variables: Record<string, string>,
  extraLines: string[] = [],
): string {
  const context = requireContext(variables);
  return [
    task,
    "Si falta información clínica, indícalo explícitamente.",
    ...extraLines,
    optionalClinicianIntentBlock(variables.clinicianIntent),
    contextBlock(context),
  ]
    .filter(Boolean)
    .join("\n");
}

export const patientSummaryPrompt: ClinicalPromptDefinition = {
  id: "patient-summary-v1",
  name: "Resumen clínico del paciente",
  version: "1.0.0",
  description: "Resumen longitudinal breve a partir del contexto EMR.",
  variables: [CONTEXT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Redactar un resumen clínico longitudinal breve (máximo 250 palabras en total).",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Genera un resumen clínico longitudinal del paciente usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const draftNoteSoapPrompt: ClinicalPromptDefinition = {
  id: "draft-note-soap-v1",
  name: "Evolución clínica SOAP",
  version: "1.0.0",
  description: "Borrador de nota de progreso en formato SOAP.",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: SOAP_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      soapFormatInstructions(),
      "",
      "TAREA: Redactar borrador de EVOLUCIÓN CLÍNICA (nota de progreso) del encuentro/atención actual.",
      "Enfócate en el motivo de consulta y los datos del contexto; no repitas un resumen longitudinal completo.",
      "Si faltan estudios (imagen, cultivo, laboratorio) en contexto, decláralo explícitamente en ANÁLISIS o PLAN.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Genera una evolución clínica (nota de progreso) en formato SOAP usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const draftNoteStructuredPrompt: ClinicalPromptDefinition = {
  id: "draft-note-structured-v1",
  name: "Evolución clínica estructurada",
  version: "1.0.0",
  description: "Borrador de nota de progreso en formato HECHOS/INFERENCIAS/SUGERENCIAS.",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Redactar borrador de EVOLUCIÓN CLÍNICA (nota de progreso) del encuentro/atención actual.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Genera una evolución clínica (nota de progreso) usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const dischargeSummaryPrompt: ClinicalPromptDefinition = {
  id: "discharge-summary-v1",
  name: "Epicrisis / resumen de alta",
  version: "1.0.0",
  description: "Borrador de epicrisis hospitalaria o resumen de alta.",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Redactar borrador de EPICRISIS incluyendo motivo de hospitalización, evolución, diagnósticos principales y plan al alta.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines("Genera una epicrisis clínica usando SOLO el contexto siguiente.", variables),
};

export const explainLabsPrompt: ClinicalPromptDefinition = {
  id: "explain-labs-v1",
  name: "Explicar laboratorio",
  version: "1.0.0",
  description: "Interpretación pedagógica de resultados de laboratorio/imagenología presentes en contexto.",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Explicar resultados de laboratorio/exámenes presentes en el contexto, sin ampliar más allá de los datos disponibles.",
      "Si hay valores contradictorios o de laboratorios distintos el mismo día, explícitalo y declara que no es posible concluir sin verificación.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Explica los resultados de laboratorio y exámenes relevantes usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const extractProblemsPrompt: ClinicalPromptDefinition = {
  id: "extract-problems-v1",
  name: "Extraer problemas clínicos",
  version: "1.0.0",
  description: "Lista estructurada de problemas activos/sospechados con evidencia.",
  variables: [CONTEXT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: JSON_PROBLEMS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      "",
      "TAREA: Extraer problemas clínicos del contexto.",
      "Devuelve SOLO JSON válido según el schema indicado en el mensaje del usuario.",
      "No inventes problemas sin evidencia en el contexto.",
    ].join("\n"),
  buildUser: (variables) =>
    [
      "Extrae problemas clínicos usando SOLO el contexto siguiente.",
      `Devuelve SOLO un JSON array con schema: ${JSON_PROBLEMS_SCHEMA.jsonSchema}`,
      contextBlock(requireContext(variables)),
    ].join("\n\n"),
};

export const ragQueryPrompt: ClinicalPromptDefinition = {
  id: "rag-query-v1",
  name: "Consulta RAG documental",
  version: "1.0.0",
  description: "Respuesta con citas sobre fragmentos recuperados de documentos importados.",
  variables: [
    { name: "query", required: true, description: "Consulta clínica del usuario" },
    { name: "ragContext", required: true, description: "Fragmentos recuperados formateados" },
  ],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: RAG_PLAIN_TEXT_SCHEMA,
  buildSystem: () =>
    [
      "Eres un asistente clínico para médicos en Chile.",
      "Responde SOLO con información presente en los fragmentos citados.",
      "Cita fuentes como [1], [2] según el número del fragmento.",
      "Si no hay datos suficientes en los fragmentos, indícalo explícitamente (sin inventar).",
      "Responde en español, texto plano estructurado.",
      "IMPORTANTE: BORRADOR — requiere revisión médica. No inventes datos.",
    ].join(" "),
  buildUser: (variables) => {
    const query = variables.query?.trim();
    const ragContext = variables.ragContext?.trim();
    if (!query || !ragContext) {
      throw new Error("query and ragContext are required");
    }
    return [
      `Consulta clínica: ${query}`,
      "",
      "Fragmentos recuperados de documentos importados:",
      ragContext,
      "",
      "Entregue un resumen clínico breve con citas [n] a los fragmentos usados.",
    ].join("\n");
  },
};

export const detectInconsistenciesPrompt: ClinicalPromptDefinition = {
  id: "detect-inconsistencies-v1",
  name: "Detectar inconsistencias",
  version: "1.0.0",
  description: "Identifica contradicciones o lagunas relevantes en la ficha.",
  variables: [CONTEXT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Detectar inconsistencias, contradicciones o vacíos clínicos relevantes en el contexto.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Identifica inconsistencias clínicas o lagunas de información usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const inpatientChecklistPrompt: ClinicalPromptDefinition = {
  id: "inpatient-checklist-v1",
  name: "Checklist paciente hospitalizado",
  version: "1.0.0",
  description: "Checklist de seguridad y seguimiento para paciente hospitalizado.",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: CHECKLIST_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      checklistFormatInstructions("CHECKLIST HOSPITALIZADO"),
      "",
      "TAREA: Generar checklist de seguimiento (adherencia, riesgo, pendientes) basado en el contexto.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Genera un checklist clínico para paciente hospitalizado usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const icuSummaryPrompt: ClinicalPromptDefinition = {
  id: "icu-summary-v1",
  name: "Resumen UCO/UCI",
  version: "1.0.0",
  description: "Resumen breve orientado a cuidados críticos.",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Redactar resumen UCO/UCI (estado actual, soporte, riesgos inmediatos, pendientes).",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines("Genera un resumen UCO/UCI usando SOLO el contexto siguiente.", variables),
};

export const infectologyPrompt: ClinicalPromptDefinition = {
  id: "infectology-v1",
  name: "Consulta infectología",
  version: "1.0.0",
  description: "Impresión infectológica y conducta sugerida (borrador).",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Borrador de impresión infectológica (focus, antimicrobianos si constan, cultivos, riesgo).",
      "En HECHOS incluye signos vitales y laboratorio del contexto con cifras (p. ej. temperatura, leucocitos, PCR) cuando estén disponibles.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Genera un borrador de evaluación infectológica usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const internalMedicinePrompt: ClinicalPromptDefinition = {
  id: "internal-medicine-v1",
  name: "Medicina interna",
  version: "1.0.0",
  description: "Evaluación general de medicina interna a partir del contexto.",
  variables: [CONTEXT_VAR, OPTIONAL_INTENT_VAR],
  security: DEFAULT_CLINICAL_SECURITY,
  outputSchema: HECHOS_INFERENCIAS_SUGERENCIAS_SCHEMA,
  buildSystem: () =>
    [
      buildClinicalAssistantPreamble(),
      hechosInferenciasSugerenciasInstructions(),
      "",
      "TAREA: Evaluación de medicina interna (problemas activos, comorbilidades, riesgo global, plan sugerido).",
      "Anticoagulación, sangrado o embarazo: adviértelo si consta; en SUGERENCIAS usa evaluar/considerar, nunca indico/prescribo/iniciar fármaco.",
    ].join("\n"),
  buildUser: (variables) =>
    userPromptLines(
      "Genera una evaluación de medicina interna usando SOLO el contexto siguiente.",
      variables,
    ),
};

export const CLINICAL_PROMPT_CATALOG: ClinicalPromptDefinition[] = [
  patientSummaryPrompt,
  draftNoteSoapPrompt,
  draftNoteStructuredPrompt,
  dischargeSummaryPrompt,
  explainLabsPrompt,
  extractProblemsPrompt,
  ragQueryPrompt,
  detectInconsistenciesPrompt,
  inpatientChecklistPrompt,
  icuSummaryPrompt,
  infectologyPrompt,
  internalMedicinePrompt,
];

export const ROADMAP_PROMPT_IDS = [
  "patient-summary-v1",
  "draft-note-soap-v1",
  "discharge-summary-v1",
  "explain-labs-v1",
  "extract-problems-v1",
  "rag-query-v1",
  "detect-inconsistencies-v1",
  "inpatient-checklist-v1",
  "icu-summary-v1",
  "infectology-v1",
  "internal-medicine-v1",
] as const;
