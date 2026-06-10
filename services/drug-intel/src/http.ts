import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Fetch con cache en disco, reintentos y rate-limit secuencial.
 * Todas las fuentes son públicas; el User-Agent identifica el pipeline.
 */

const USER_AGENT = 'EPIS2-drug-intel/0.1 (pipeline de catalogo clinico; uso no comercial)';

export interface HttpClientOptions {
  cacheDir: string;
  /** Milisegundos mínimos entre requests al mismo host. */
  minDelayMs?: number;
  /** TTL del cache en milisegundos (default 24h). */
  cacheTtlMs?: number;
  retries?: number;
  timeoutMs?: number;
}

export type HttpResult =
  | { ok: true; body: string; fromCache: boolean }
  | { ok: false; reason: string };

const lastRequestByHost = new Map<string, number>();

function cacheKey(url: string, init?: { method?: string; body?: string }): string {
  return createHash('sha256')
    .update(`${init?.method ?? 'GET'} ${url} ${init?.body ?? ''}`)
    .digest('hex');
}

async function readCache(dir: string, key: string, ttlMs: number): Promise<string | null> {
  try {
    const raw = await readFile(join(dir, `${key}.json`), 'utf8');
    const entry = JSON.parse(raw) as { storedAt: number; body: string };
    if (Date.now() - entry.storedAt > ttlMs) return null;
    return entry.body;
  } catch {
    return null;
  }
}

async function writeCache(dir: string, key: string, body: string): Promise<void> {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${key}.json`), JSON.stringify({ storedAt: Date.now(), body }), 'utf8');
}

/**
 * Decodifica UTF-8 y, si el cuerpo trae caracteres de reemplazo (fuentes
 * públicas chilenas suelen declarar utf-8 pero servir Windows-1252),
 * reintenta como windows-1252.
 */
export function decodeBody(buffer: ArrayBuffer): string {
  const utf8 = new TextDecoder('utf-8').decode(buffer);
  if (!utf8.includes('\uFFFD')) return utf8;
  try {
    return new TextDecoder('windows-1252').decode(buffer);
  } catch {
    return utf8;
  }
}

async function respectRateLimit(url: string, minDelayMs: number): Promise<void> {
  const host = new URL(url).host;
  const last = lastRequestByHost.get(host) ?? 0;
  const waitMs = last + minDelayMs - Date.now();
  if (waitMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  lastRequestByHost.set(host, Date.now());
}

export function createHttpClient(options: HttpClientOptions) {
  const minDelayMs = options.minDelayMs ?? 1_000;
  const cacheTtlMs = options.cacheTtlMs ?? 24 * 60 * 60 * 1000;
  const retries = options.retries ?? 2;
  const timeoutMs = options.timeoutMs ?? 20_000;

  async function fetchText(
    url: string,
    init?: { method?: string; body?: string; headers?: Record<string, string> },
  ): Promise<HttpResult> {
    const key = cacheKey(url, init);
    const cached = await readCache(options.cacheDir, key, cacheTtlMs);
    if (cached !== null) {
      return { ok: true, body: cached, fromCache: true };
    }

    let lastReason = 'sin intentos';
    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        await respectRateLimit(url, minDelayMs);
        const res = await fetch(url, {
          method: init?.method ?? 'GET',
          headers: { 'User-Agent': USER_AGENT, ...init?.headers },
          ...(init?.body !== undefined ? { body: init.body } : {}),
          signal: AbortSignal.timeout(timeoutMs),
        });
        if (!res.ok) {
          lastReason = `HTTP ${res.status} en ${url}`;
          // 4xx no se reintenta: el recurso no existe o el request es inválido.
          if (res.status >= 400 && res.status < 500) break;
          continue;
        }
        const body = decodeBody(await res.arrayBuffer());
        await writeCache(options.cacheDir, key, body);
        return { ok: true, body, fromCache: false };
      } catch (err) {
        lastReason = err instanceof Error ? err.message : String(err);
      }
    }
    return { ok: false, reason: lastReason };
  }

  return { fetchText };
}

export type HttpClient = ReturnType<typeof createHttpClient>;
