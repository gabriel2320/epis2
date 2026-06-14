import { pingOllama } from '../ai/client.js';

/** Embedding determinístico demo legacy (128d). */
export const DEMO_EMBED_DIM = 128;

/** Dimensión objetivo RAG (MF-IM-01). */
export const RAG_EMBED_DIM = 384;

export function poolEmbedding(values: number[], targetDim: number): number[] {
  if (values.length === targetDim) return normalizeVector(values);
  const out = new Array<number>(targetDim).fill(0);
  for (let i = 0; i < values.length; i++) {
    out[i % targetDim]! += values[i]!;
  }
  return normalizeVector(out);
}

function normalizeVector(vec: number[]): number[] {
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
}

export async function fetchOllamaEmbedding(
  baseUrl: string,
  text: string,
): Promise<number[] | null> {
  try {
    const up = await pingOllama(baseUrl);
    if (!up) return null;
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(8000),
      body: JSON.stringify({ model: 'nomic-embed-text', prompt: text }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { embedding?: number[] };
    return Array.isArray(body.embedding) ? body.embedding : null;
  } catch {
    return null;
  }
}

export async function resolveEmbedding(text: string, ollamaBaseUrl?: string): Promise<number[]> {
  if (ollamaBaseUrl) {
    const remote = await fetchOllamaEmbedding(ollamaBaseUrl, text);
    if (remote) return poolEmbedding(remote, DEMO_EMBED_DIM);
  }
  return demoEmbedText(text);
}

export async function resolveEmbedding384(text: string, ollamaBaseUrl?: string): Promise<number[]> {
  if (ollamaBaseUrl) {
    const remote = await fetchOllamaEmbedding(ollamaBaseUrl, text);
    if (remote) return poolEmbedding(remote, RAG_EMBED_DIM);
  }
  return demoEmbedText384(text);
}

export async function resolveChunkEmbeddings(
  text: string,
  ollamaBaseUrl?: string,
): Promise<{ dim128: number[]; dim384: number[] }> {
  if (ollamaBaseUrl) {
    const remote = await fetchOllamaEmbedding(ollamaBaseUrl, text);
    if (remote) {
      return {
        dim128: poolEmbedding(remote, DEMO_EMBED_DIM),
        dim384: poolEmbedding(remote, RAG_EMBED_DIM),
      };
    }
  }
  return {
    dim128: demoEmbedText(text),
    dim384: demoEmbedText384(text),
  };
}

export function demoEmbedText384(text: string): number[] {
  const vec = new Array<number>(RAG_EMBED_DIM).fill(0);
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
    vec[h % RAG_EMBED_DIM]! += 1;
  }

  return normalizeVector(vec);
}

export function demoEmbedText(text: string): number[] {
  const vec = new Array<number>(DEMO_EMBED_DIM).fill(0);
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
    vec[h % DEMO_EMBED_DIM]! += 1;
  }

  return normalizeVector(vec);
}

export function demoEmbedToPgVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`;
}

export function chunkText(text: string, maxLen = 480): string[] {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return [];
  if (normalized.length <= maxLen) return [normalized];

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length) {
    chunks.push(normalized.slice(start, start + maxLen));
    start += maxLen;
  }
  return chunks;
}
