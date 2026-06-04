import { walkSourceFiles } from './lib/scan-sources.mjs';

const DIRECT_MUI = /from\s+['"]@mui\//;

/** apps/web no importa MUI directo; usar @epis2/epis2-ui (EPIS2-MUI-01). */
export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles({ roots: ['apps/web'] })) {
    if (!DIRECT_MUI.test(content)) continue;
    const lines = content.split('\n').filter((l) => DIRECT_MUI.test(l));
    for (const line of lines.slice(0, 3)) {
      details.push(`${rel} → ${line.trim()}`);
    }
    if (lines.length > 3) {
      details.push(`${rel} → … y ${lines.length - 3} import(s) @mui más`);
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'apps/web sin imports directos @mui/*'
        : 'Imports MUI directos en apps/web',
    details,
  };
}
