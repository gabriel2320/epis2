import type { Meta, StoryObj } from '@storybook/react';
import { PersonOutlineIcon } from '../mui/index.js';
import { EpisChip } from '../primitives/EpisChip.js';
import { EpisDemoBadgeChip } from '../primitives/EpisDemoBadgeChip.js';

const meta = {
  title: 'Primitivos/EpisChip',
  component: EpisChip,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outlined: Story = {
  args: { label: 'DEMO-005', icon: <PersonOutlineIcon />, variant: 'outlined' },
};

export const DemoBadge: StoryObj<typeof EpisDemoBadgeChip> = {
  render: () => <EpisDemoBadgeChip label={copy.demoBadge} />,
};
