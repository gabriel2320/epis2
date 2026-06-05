import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

export type EpisTrendSeries = {
  label: string;
  data: number[];
};

export type EpisTrendChartProps = {
  title?: string;
  variant?: 'line' | 'bar';
  xAxisLabels: string[];
  series: EpisTrendSeries[];
  height?: number;
  emptyMessage?: string;
  'data-testid'?: string;
};

function hasChartData(series: EpisTrendSeries[]) {
  return series.some((s) => s.data.length > 0 && s.data.some((v) => Number.isFinite(v)));
}

function EmptyChart({ message, height, testId }: { message: string; height: number; testId?: string }) {
  return (
    <Box
      data-testid={testId}
      sx={{
        minHeight: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}

export function EpisTrendChart({
  title,
  variant = 'line',
  xAxisLabels,
  series,
  height = 280,
  emptyMessage = 'Sin datos para graficar.',
  'data-testid': testId,
}: EpisTrendChartProps) {
  if (!hasChartData(series) || xAxisLabels.length === 0) {
    return (
      <EmptyChart
        message={emptyMessage}
        height={height}
        {...(testId ? { testId } : {})}
      />
    );
  }

  const chartSeries = series.map((s) => ({
    data: s.data,
    label: s.label,
  }));

  const chart = (
    <Box data-testid={testId} sx={{ width: '100%' }}>
      {variant === 'bar' ? (
        <BarChart
          height={height}
          xAxis={[{ data: xAxisLabels, scaleType: 'band' }]}
          series={chartSeries}
          margin={{ left: 48, right: 16, top: 32, bottom: 40 }}
        />
      ) : (
        <LineChart
          height={height}
          xAxis={[{ data: xAxisLabels, scaleType: 'point' }]}
          series={chartSeries}
          margin={{ left: 48, right: 16, top: 32, bottom: 40 }}
        />
      )}
    </Box>
  );

  if (!title) return chart;

  return (
    <Stack spacing={1}>
      <Typography variant="subtitle2">{title}</Typography>
      {chart}
    </Stack>
  );
}
