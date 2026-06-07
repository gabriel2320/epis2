import type { Meta, StoryObj } from '@storybook/react';
import { EpisApprovalGate } from '../clinical/EpisApprovalGate.js';

const meta = {
  title: 'Clínico/EpisApprovalGate',
  component: EpisApprovalGate,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisApprovalGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Editable: Story = {
  args: {
    status: 'draft',
    canEdit: true,
    canApprove: true,
    showSendToReview: true,
  },
};

export const ListoParaAprobar: Story = {
  args: {
    status: 'ready_for_review',
    canEdit: false,
    canApprove: true,
    showSendToReview: false,
    message: 'Borrador enviado a revisión (demo)',
  },
};
