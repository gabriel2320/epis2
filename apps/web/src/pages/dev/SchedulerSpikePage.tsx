import { copy } from '@epis2/design-system';
import {
  EpisAlert,
  EpisButton,
  EpisCard,
  EpisLoadingState,
  Stack,
  Typography,
} from '@epis2/epis2-ui';
import { lazy, Suspense } from 'react';

const LazyEpisEventCalendarSpike = lazy(async () => {
  const mod = await import('@epis2/epis2-ui/scheduler');
  return { default: mod.EpisEventCalendarSpike };
});

export function SchedulerSpikePage() {
  return (
    <Stack
      spacing={3}
      sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}
      data-testid="epis2-scheduler-spike-page"
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
        gap={2}
        flexWrap="wrap"
      >
        <div>
          <Typography variant="h4" component="h1" gutterBottom>
            {copy.schedulerSpike.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {copy.schedulerSpike.subtitle}
          </Typography>
        </div>
        <EpisButton
          href="/comando"
          component="a"
          variant="outlined"
          data-testid="epis2-scheduler-spike-back"
        >
          {copy.layout.backToCommand}
        </EpisButton>
      </Stack>

      <EpisAlert severity="warning" data-testid="epis2-scheduler-spike-eval-banner">
        {copy.schedulerSpike.evalBanner}
      </EpisAlert>

      <EpisCard sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {copy.schedulerSpike.calendarTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {copy.schedulerSpike.calendarHint}
        </Typography>
        <Suspense fallback={<EpisLoadingState label={copy.schedulerSpike.loading} />}>
          <LazyEpisEventCalendarSpike data-testid="epis2-scheduler-spike-calendar" readOnly />
        </Suspense>
      </EpisCard>

      <EpisCard sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {copy.schedulerSpike.findingsTitle}
        </Typography>
        <Stack component="ul" spacing={1} sx={{ m: 0, pl: 2.5 }}>
          {copy.schedulerSpike.findings.map((item) => (
            <Typography key={item} component="li" variant="body2">
              {item}
            </Typography>
          ))}
        </Stack>
      </EpisCard>
    </Stack>
  );
}
