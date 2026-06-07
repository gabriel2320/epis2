import type { Meta, StoryObj } from '@storybook/react';
import { EpisDataGrid, type GridColDef } from '../data/EpisDataGridCore.js';

const columns: GridColDef[] = [
  { field: 'paciente', headerName: 'Paciente', flex: 1, minWidth: 160 },
  { field: 'estado', headerName: 'Estado', width: 120 },
  { field: 'valor', headerName: 'Valor', width: 100, type: 'number' },
];

const rows = [
  { id: '1', paciente: 'Paciente Demo — HTA', estado: 'Pendiente', valor: 142 },
  { id: '2', paciente: 'Paciente Demo — DM2', estado: 'Revisado', valor: 98 },
];

const meta = {
  title: 'Datos/EpisDataGrid',
  component: EpisDataGrid,
  tags: ['autodocs'],
} satisfies Meta<typeof EpisDataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    rows,
    columns,
    height: 280,
    'data-testid': 'epis2-storybook-grid',
  },
};
