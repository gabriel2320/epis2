import { walkSourceFiles } from './lib/scan-sources.mjs';

const AUTO_APPROVAL_PATTERNS = [
  /autoApprove\s*[:=]\s*true/i,
  /auto_approve/i,
  /skipHumanReview/i,
  /bypassApproval/i,
  /status:\s*['"]approved['"].*\/\/\s*ai/i,
  /approveDraftAutomatically/i,
];

export async function validate() {
  const details = [];

  for await (const { rel, content } of walkSourceFiles()) {
    if (rel.includes('architecture/human-approval')) continue;
    if (rel.includes('docs/') || rel.includes('tests/golden')) continue;
    for (const pattern of AUTO_APPROVAL_PATTERNS) {
      if (pattern.test(content)) {
        details.push(`${rel} → aprobación automática prohibida`);
        break;
      }
    }
  }

  return {
    ok: details.length === 0,
    message:
      details.length === 0
        ? 'Sin patrones de aprobación automática'
        : 'Toda aprobación debe ser humana y auditada',
    details,
  };
}
