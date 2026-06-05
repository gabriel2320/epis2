import Typography from '@mui/material/Typography';
import { EpisCard } from '../primitives/EpisCard.js';

export type EpisMetricProps = {
  label: string;
  value: string | number;
  hint?: string;
  'data-testid'?: string;
};

export function EpisMetric({ label, value, hint, 'data-testid': testId }: EpisMetricProps) {
  return (
    <EpisCard
      variant="outlined"
      sx={{ p: 2, minWidth: 140, flex: '1 1 140px' }}
      data-testid={testId}
    >
      <Typography variant="body2" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="h5" component="p" sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      {hint ? (
        <Typography variant="body2" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
          {hint}
        </Typography>
      ) : null}
    </EpisCard>
  );
}
