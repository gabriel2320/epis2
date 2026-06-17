import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { cicaTokens } from './cicaTokens.js';

export type CicaContextStripProps = {
  items: readonly { label: string; value: string }[];
  testId?: string;
};

/** Franja contextual densa bajo identidad paciente. */
export function CicaContextStrip({ items, testId = 'cica-context-strip' }: CicaContextStripProps) {
  if (items.length === 0) return null;

  return (
    <Box
      data-testid={testId}
      sx={{
        flexShrink: 0,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        px: cicaTokens.shellPaddingX,
        py: 1,
        borderBottom: 1,
        borderColor: cicaTokens.borderColor,
        bgcolor: 'action.hover',
      }}
    >
      {items.map((item) => (
        <Box key={item.label} sx={{ minWidth: 120 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            {item.label}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
