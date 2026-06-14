import { describeIntegration } from '@epis2/test-fixtures/integration';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const DEMO002 = 'a0000001-0000-4000-8000-000000000002';

describeIntegration('document chunk search MF-IM-01 (integration)', () => {
  it('búsqueda semántica encuentra chunk demo (128d legacy o 384d reindex)', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'GET',
      url: `/api/patients/${DEMO002}/documents/search?q=hemoglobina`,
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      searchMode: string;
      hits: { id: string; snippet: string; embedDim?: number }[];
    };
    expect(body.searchMode).toBe('semantic');
    expect(body.hits.length).toBeGreaterThan(0);
    expect(body.hits[0]!.snippet.toLowerCase()).toContain('hemoglobina');

    await app.close();
  });
});
