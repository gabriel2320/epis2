/**
 * @param {string} name
 * @param {{ ok: boolean, message?: string, details?: string[] }} result
 */
export function formatResult(name, result) {
  const icon = result.ok ? 'OK' : 'FAIL';
  const lines = [`[${icon}] ${name}`];
  if (result.message) lines.push(`      ${result.message}`);
  if (result.details?.length) {
    for (const d of result.details.slice(0, 20)) {
      lines.push(`      - ${d}`);
    }
    if (result.details.length > 20) {
      lines.push(`      ... y ${result.details.length - 20} más`);
    }
  }
  return { lines, ok: result.ok };
}
