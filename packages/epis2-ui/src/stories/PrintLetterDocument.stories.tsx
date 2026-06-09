import type { Meta, StoryObj } from '@storybook/react';
import { PrintLetterDocument, PrintSection } from '../print/PrintLetterDocument.js';
import { PrintField } from '../print/PrintA5Document.js';

const meta = {
  title: 'Impresión/PrintLetterDocument',
  component: PrintLetterDocument,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Vista documental Carta vertical (216×279 mm) para documentos longitudinales — norma `EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM.md` §2.1/§19. Documento plano: sin superficies M3, sin tarjetas.',
      },
    },
  },
} satisfies Meta<typeof PrintLetterDocument>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EpicrisisDemo: Story = {
  args: {
    title: 'Epicrisis — Resumen de egreso',
    subtitle: 'Paciente Demo · 54 años · Episodio hospitalario (datos sintéticos)',
    status: 'BORRADOR',
    children: (
      <>
        <PrintSection title="Motivo de ingreso">
          <PrintField label="Motivo" value="Dolor torácico opresivo de 2 horas de evolución." />
        </PrintSection>
        <PrintSection title="Evolución hospitalaria">
          <PrintField
            label="Resumen"
            value={
              'Ingresa estable. Se descarta síndrome coronario agudo con seriado enzimático negativo.\nEvolución favorable, sin complicaciones.'
            }
          />
        </PrintSection>
        <PrintSection title="Indicaciones al alta">
          <PrintField label="Medicamentos" value="Atorvastatina 20 mg/noche (demo)." />
          <PrintField label="Control" value="Control ambulatorio en 7 días con resultados." />
        </PrintSection>
      </>
    ),
    footer: 'Generado en EPIS2 — datos sintéticos · Documento sin validez clínica',
  },
};

export const SinEstadoNiPie: Story = {
  args: {
    title: 'Nota de evolución',
    subtitle: 'Paciente Demo — episodio ambulatorio (demo)',
    children: (
      <PrintSection title="Evolución">
        <PrintField label="Subjetivo" value="Paciente refiere mejoría del dolor." />
        <PrintField label="Plan" value="Mantener esquema actual. Reevaluar en 48 h." />
      </PrintSection>
    ),
  },
};
