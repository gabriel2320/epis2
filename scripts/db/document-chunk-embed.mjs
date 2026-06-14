/**
 * Demo embeddings para re-index batch (paridad con apps/api/src/clinical/embeddings.ts).
 */

export const DEMO_EMBED_DIM = 128;
export const RAG_EMBED_DIM = 384;

function normalizeVector(vec) {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
}

export function poolEmbedding(values, targetDim) {
  if (values.length === targetDim) return normalizeVector(values);
  const out = new Array(targetDim).fill(0);
  for (let i = 0; i < values.length; i++) {
    out[i % targetDim] += values[i];
  }
  return normalizeVector(out);
}

function demoEmbedTextWithDim(text, dim) {
  const vec = new Array(dim).fill(0);
  const tokens = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^a-z0-9áéíóúñ]+/u)
    .filter((t) => t.length > 2);

  for (const token of tokens) {
    let h = 0;
    for (let i = 0; i < token.length; i++) {
      h = (h * 31 + token.charCodeAt(i)) >>> 0;
    }
    vec[h % dim] += 1;
  }

  return normalizeVector(vec);
}

export function demoEmbedText128(text) {
  return demoEmbedTextWithDim(text, DEMO_EMBED_DIM);
}

export function demoEmbedText384(text) {
  return demoEmbedTextWithDim(text, RAG_EMBED_DIM);
}

export function demoEmbedToPgVectorLiteral(values) {
  return `[${values.join(',')}]`;
}

/** @param {number[] | null | undefined} legacy128 */
export function resolveEmbedding384FromChunkText(chunkText, legacy128) {
  if (Array.isArray(legacy128) && legacy128.length === DEMO_EMBED_DIM) {
    return poolEmbedding(legacy128, RAG_EMBED_DIM);
  }
  return demoEmbedText384(chunkText);
}
