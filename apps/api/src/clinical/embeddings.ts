/** Embedding determinístico demo (128d) — sin sidecar; apto para pgvector sintético. */
export const DEMO_EMBED_DIM = 128;

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

  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => Number((v / norm).toFixed(6)));
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
