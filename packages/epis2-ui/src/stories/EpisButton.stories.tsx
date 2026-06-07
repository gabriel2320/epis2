import type { Meta, StoryObj } from '@storybook/react';
import { EpisButton } from '../primitives/EpisButton.js';

const meta = {
  title: 'Primitivos/EpisButton',
  component: EpisButton,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: { appearance: 'filled', children: 'Acción principal' },
};

export const Tonal: Story = {
  args: { appearance: 'tonal', children: 'Acción secundaria' },
};

export const Outlined: Story = {
  args: { appearance: 'outlined', children: 'Alternativa' },
};

export const Text: Story = {
  args: { appearance: 'text', children: 'Enlace de acción' },
};
