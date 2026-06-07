import type { Meta, StoryObj } from '@storybook/react';
import { PrintA5Document, PrintField } from '../print/PrintA5Document.js';

const meta = {
  title: 'Impresión/PrintA5Document',
  component: PrintA5Document,
  tags: ['autodocs'],
} satisfies Meta<typeof PrintA5Document>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CertificadoDemo: Story = {
  args: {
    title: 'Certificado médico',
    subtitle: 'Documento clínico — vista A5 (demo)',
    children: (
      <>
        <PrintField label="Paciente" value="Paciente Demo — HTA" />
        <PrintField label="Diagnóstico" value="Hipertensión arterial controlada (demo)" />
        <PrintField label="Indicaciones" value="Reposo relativo 48 h. Control ambulatorio." />
      </>
    ),
    footer: 'Generado en EPIS2 — datos sintéticos',
  },
};
