import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const USER_AGENT =
  'EPIS2-clinical-case-intel/0.1 (pipeline casos sinteticos; uso no comercial)';

export interface HttpClientOptions {
  cacheDir: string;
  minDelayMs?: number;
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
  const timeoutMs = options.timeoutMs ?? 30_000;

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
          if (res.status >= 400 && res.status < 500) break;
          continue;
        }
        const body = await res.text();
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
