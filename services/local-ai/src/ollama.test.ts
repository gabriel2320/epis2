import { describe, expect, it } from 'vitest';
import { pingOllama } from './ollama.js';

describe('pingOllama', () => {
  it('devuelve boolean sin lanzar', async () => {
    const result = await pingOllama('http://127.0.0.1:11434');
    expect(typeof result).toBe('boolean');
  });
});
