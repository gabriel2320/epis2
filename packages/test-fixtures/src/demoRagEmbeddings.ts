import { RAG_EMBED_DIM } from '@epis2/contracts';

function normalizeVector(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
}

/** Embedding determinístico demo 384d (paridad con apps/api embeddings.ts). */
export function demoEmbedText384(text: string): number[] {
  const vec = new Array<number>(RAG_EMBED_DIM).fill(0);
  const tokens = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .split(/[^a-z0-9áéíóúñ]+/u)
    .filter((token) => token.length > 2);

  for (const token of tokens) {
    let h = 0;
    for (let i = 0; i < token.length; i += 1) {
      h = (h * 31 + token.charCodeAt(i)) >>> 0;
    }
    vec[h % RAG_EMBED_DIM]! += 1;
  }

  return normalizeVector(vec);
}
