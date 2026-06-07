import type { Meta, StoryObj } from '@storybook/react';
import { EpisDraftStatus } from '../clinical/EpisDraftStatus.js';

const meta = {
  title: 'Clínico/EpisDraftStatus',
  component: EpisDraftStatus,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisDraftStatus>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Borrador: Story = { args: { status: 'draft' } };
export const ListoRevision: Story = { args: { status: 'ready_for_review' } };
export const Aprobado: Story = { args: { status: 'approved' } };
