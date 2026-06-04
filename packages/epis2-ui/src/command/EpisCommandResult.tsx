import type { ReactNode } from 'react';
import { EpisCard } from '../primitives/EpisCard.js';
import Typography from '@mui/material/Typography';

export type EpisCommandResultProps = {
  title: string;
  children: ReactNode;
};

/** Panel de resultado / vista previa tras resolver un comando. */
export function EpisCommandResult({ title, children }: EpisCommandResultProps) {
  return (
    <EpisCard variant="outlined" sx={{ p: 2, width: '100%' }} data-testid="epis2-command-result">
      <Typography variant="subtitle2" gutterBottom>
        {title}
      </Typography>
      {children}
    </EpisCard>
  );
}
