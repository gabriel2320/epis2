import type { Meta, StoryObj } from '@storybook/react';
import { EpisMetric } from '../dashboard/EpisMetric.js';

const meta = {
  title: 'Dashboard/EpisMetric',
  component: EpisMetric,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisMetric>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BorradoresAbiertos: Story = {
  args: { label: 'Borradores abiertos', value: 3 },
};

export const PendientesRevision: Story = {
  args: { label: 'Pendientes de revisión', value: 1 },
};
