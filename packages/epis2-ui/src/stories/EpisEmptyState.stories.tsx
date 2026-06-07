import { copy } from '@epis2/design-system';
import type { Meta, StoryObj } from '@storybook/react';
import { EpisEmptyState } from '../primitives/EpisEmptyState.js';

const meta = {
  title: 'Feedback/EpisEmptyState',
  component: EpisEmptyState,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisEmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SinDatos: Story = {
  args: { title: copy.dashboard.emptyRecent, message: copy.longitudinal.emptySection },
};
