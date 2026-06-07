import { copy } from '@epis2/design-system';
import type { Meta, StoryObj } from '@storybook/react';
import { EpisLoadingState } from '../primitives/EpisLoadingState.js';

const meta = {
  title: 'Feedback/EpisLoadingState',
  component: EpisLoadingState,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisLoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cargando: Story = {
  args: { label: copy.dashboard.loading },
};
