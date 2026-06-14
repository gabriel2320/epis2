import {
  embedDocumentResponseSchema,
  poolEmbeddingVector,
  RAG_EMBED_DIM,
  type EmbedDocumentRequest,
  type EmbedDocumentResponse,
} from '@epis2/contracts';
import type { AiConfig } from './config.js';
import { fetchOllamaEmbedding, pingOllama } from './ollama.js';

export async function runEmbedDocument(
  config: AiConfig,
  request: EmbedDocumentRequest,
): Promise<EmbedDocumentResponse> {
  const started = Date.now();
  const ollamaUp = await pingOllama(config.OLLAMA_BASE_URL);
  if (!ollamaUp) {
    return {
      status: 'unavailable',
      message: 'Ollama no disponible — use embeddings demo determinísticos.',
      provider: 'ollama',
    };
  }

  const model = request.model ?? config.OLLAMA_EMBED_MODEL;
  const result = await fetchOllamaEmbedding(config.OLLAMA_BASE_URL, model, request.text);
  if (!result.ok) {
    return {
      status: 'unavailable',
      message: result.reason,
      provider: 'ollama',
    };
  }

  const embedding = poolEmbeddingVector(result.embedding, RAG_EMBED_DIM);
  const response = embedDocumentResponseSchema.parse({
    status: 'success',
    embedding,
    dim: RAG_EMBED_DIM,
    model: result.model,
    provider: 'ollama',
    latencyMs: Date.now() - started,
  });
  return response;
}
