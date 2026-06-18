import { CicaBlueprintBody, CicaLetterPageShell, type CicaScreenBlueprint } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';

type CicaLetterBlueprintPageProps = {
  blueprint: CicaScreenBlueprint;
  title: string;
  subtitle?: string;
  statusLabel?: string;
  onBack: () => void;
  backLabel?: string;
  slots?: Partial<Record<string, ReactNode>>;
  testId?: string;
};

/** Página carta CICA — LetterPageShell + grilla blueprint. */
export function CicaLetterBlueprintPage({
  blueprint,
  title,
  subtitle,
  statusLabel,
  onBack,
  backLabel,
  slots = {},
  testId,
}: CicaLetterBlueprintPageProps) {
  return (
    <CicaLetterPageShell
      title={title}
      {...(subtitle ? { subtitle } : {})}
      {...(statusLabel ? { statusLabel } : {})}
      onBack={onBack}
      {...(backLabel ? { backLabel } : {})}
      hideActionBar
      testId={testId ?? `cica-letter-${blueprint.screenId}`}
    >
      <CicaBlueprintBody blueprint={blueprint} slots={slots} />
    </CicaLetterPageShell>
  );
}
