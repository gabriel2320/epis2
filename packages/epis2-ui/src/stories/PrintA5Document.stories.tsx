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

export const RecetaDemo: Story = {
  args: {
    title: 'Receta médica',
    subtitle: 'Paciente Demo · 54 años — vista A5 (demo)',
    children: (
      <>
        <PrintField label="Medicamento" value="Losartán 50 mg — 1 comprimido cada 24 h, vía oral" />
        <PrintField label="Duración" value="30 días" />
        <PrintField
          label="Indicaciones"
          value="Tomar en la mañana. No suspender sin control médico."
        />
      </>
    ),
    footer: 'Dr./Dra. Demo — Generado en EPIS2 · datos sintéticos',
  },
};

export const OrdenLaboratorioUrgente: Story = {
  args: {
    title: 'Orden de laboratorio',
    subtitle: 'Paciente Demo · Episodio ambulatorio (demo)',
    children: (
      <>
        <PrintField label="Exámenes" value="Hemograma completo · Perfil lipídico · Creatinina" />
        {/* Prioridad como texto explícito — norma §16.2: nunca solo color. */}
        <PrintField label="Prioridad" value="URGENTE" />
        <PrintField label="Justificación" value="Control post-ajuste de terapia (demo)" />
      </>
    ),
    footer: 'Generado en EPIS2 — datos sintéticos',
  },
};
