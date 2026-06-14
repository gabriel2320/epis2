import { Box, Stack, epis2PaperStatusCaptionSx, epis2PaperToolbarControlSx } from '@epis2/epis2-ui';

export type PaperPlannerCommandHintsProps = {
  phrases: readonly string[];
  onRunPhrase: (text: string) => void;
  enabled?: boolean | undefined;
  testId?: string | undefined;
};

function phraseTestId(phrase: string): string {
  return phrase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

/** Chips de comandos NL contextuales en superficie agenda (MF-PA-07). */
export function PaperPlannerCommandHints({
  phrases,
  onRunPhrase,
  enabled = true,
  testId = 'epis2-paper-planner-command-hints',
}: PaperPlannerCommandHintsProps) {
  if (!enabled || phrases.length === 0) return null;

  return (
    <Stack
      spacing={0.75}
      className="epis2-paper-chart-no-print"
      data-testid={testId}
      sx={{ px: 2, py: 1, flexShrink: 0 }}
    >
      <Box component="span" sx={epis2PaperStatusCaptionSx()}>
        Comandos agenda
      </Box>
      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
        {phrases.map((phrase) => (
          <Box
            key={phrase}
            component="button"
            type="button"
            data-testid={`epis2-paper-planner-cmd-${phraseTestId(phrase)}`}
            disabled={!enabled}
            onClick={() => onRunPhrase(phrase)}
            sx={{
              ...epis2PaperToolbarControlSx(false),
              textTransform: 'none',
              letterSpacing: '0.02em',
              fontSize: '11px',
            }}
          >
            {phrase}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
