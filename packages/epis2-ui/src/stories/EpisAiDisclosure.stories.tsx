import type { Meta, StoryObj } from '@storybook/react';
import { EpisAiDisclosure } from '../clinical/EpisAiDisclosure.js';

const meta = {
  title: 'Clínico/EpisAiDisclosure',
  component: EpisAiDisclosure,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisAiDisclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
