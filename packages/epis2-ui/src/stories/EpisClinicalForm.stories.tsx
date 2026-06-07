import { getBlueprintById, initialFormValues } from '@epis2/clinical-forms';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { EpisClinicalForm } from '../forms/EpisClinicalForm.js';

const blueprint = getBlueprintById('evolution_note');
if (!blueprint) {
  throw new Error('evolution_note blueprint missing for Storybook');
}

function ClinicalFormDemo() {
  const [values, setValues] = useState(() => initialFormValues(blueprint));
  return (
    <EpisClinicalForm
      blueprint={blueprint}
      values={values}
      clinicalProse
      onChange={(fieldId, value) => setValues((prev) => ({ ...prev, [fieldId]: value }))}
    />
  );
}

const meta = {
  title: 'Formularios/EpisClinicalForm',
  component: ClinicalFormDemo,
  tags: ['autodocs'],
} satisfies Meta<typeof ClinicalFormDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EvolucionNota: Story = {
  render: () => <ClinicalFormDemo />,
};
