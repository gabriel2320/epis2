import { createHash } from 'node:crypto';
import type { Database } from '../db/client.js';
import { searchPatientDocuments } from '../clinical/documents.js';
import { fetchLocalAiStatus, pingOllama } from './client.js';
import { recordAiRun } from './store.js';
import type { AppConfig } from '../config.js';

function hashClinicalAiInput(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 16);
}

export async function queryPatientRag(
  db: Database,
  config: AppConfig,
  actorId: string,
  patientId: string,
  question: string,
) {
  const search = await searchPatientDocuments(db, patientId, question);
  const retrievalMode = search.searchMode;
  const citations = search.hits.map((h) => ({
    documentId: h.id,
    title: h.title,
    excerpt: h.snippet,
    storageRef: h.storageRef,
  }));

  const localAiUp = await fetchLocalAiStatus(config.LOCAL_AI_BASE_URL);
  const ollamaUp = localAiUp && (await pingOllama(config.OLLAMA_BASE_URL));
  const aiAvailable = ollamaUp;

  let answer: string;
  let mode: 'retrieval' | 'synthesis' = 'retrieval';

  if (citations.length === 0) {
    answer = `No hay documentos indexados que coincidan con «${question}». Usa la búsqueda manual o carga documentos (demo).`;
  } else if (aiAvailable) {
    mode = 'synthesis';
    const cited = citations.map((c, i) => `[${i + 1}] ${c.title}: ${c.excerpt}`).join('\n');
    answer = `Respuesta demo basada en fuentes citadas (síntesis local):\n${cited}\n\nPregunta: ${question}\nRevise las fuentes antes de actuar clínicamente.`;
  } else {
    answer = `Según ${citations.length} documento(s) encontrado(s): ${citations.map((c) => c.title).join('; ')}. Fragmento: ${citations[0]?.excerpt ?? ''}`;
  }

  const row = await recordAiRun(db, {
    actorId,
    blueprintId: 'rag_query',
    patientId,
    promptHash: `rag:${hashClinicalAiInput(question)}`,
    model: aiAvailable ? 'ollama-demo' : 'retrieval-only',
    latencyMs: 0,
    status: 'success',
    inputPayload: { questionHash: hashClinicalAiInput(question), questionLength: question.length },
    outputPayload: { answer, citationCount: citations.length, mode, retrievalMode },
  });

  return {
    readOnly: true as const,
    requiresHumanReview: true as const,
    mode,
    question,
    answer,
    citations,
    runId: row?.id,
    aiAvailable,
  };
}
