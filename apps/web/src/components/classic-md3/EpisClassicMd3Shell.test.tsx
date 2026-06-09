/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../modes/EpisModeSwitcher.js', () => ({
  EpisModeSwitcher: () => null,
}));
import { EpisClassicMd3CommandBar } from './EpisClassicMd3CommandBar.js';
import { EpisClassicMd3PatientHeader } from './EpisClassicMd3PatientHeader.js';
import { EpisClassicMd3Shell } from './EpisClassicMd3Shell.js';
import { EpisClassicMd3StatusBar } from './EpisClassicMd3StatusBar.js';
import { EpisClassicMd3SupportingPane } from './EpisClassicMd3SupportingPane.js';
import { EpisClassicMd3TopAppBar } from './EpisClassicMd3TopAppBar.js';

describe('EpisClassicMd3Shell', () => {
  it('renderiza scaffold con paciente, nav, supporting, rail, command y status', () => {
    render(
      <EpisClassicMd3Shell
        topAppBar={<div data-testid="top">top</div>}
        patientHeader={<div data-testid="header">header</div>}
        leftNavigation={<div data-testid="nav">nav</div>}
        mainPane={<div data-testid="main">main</div>}
        supportingPane={<div data-testid="support">support</div>}
        actionRail={<div data-testid="rail">rail</div>}
        commandBar={<div data-testid="command">command</div>}
        statusBar={<div data-testid="status">status</div>}
      />,
    );

    expect(screen.getByTestId('epis2-classic-md3-shell')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('support')).toBeInTheDocument();
    expect(screen.getByTestId('rail')).toBeInTheDocument();
    expect(screen.getByTestId('command')).toBeInTheDocument();
    expect(screen.getByTestId('status')).toBeInTheDocument();
  });

  it('no reserva slot duplicado de ActionBar clínica global', () => {
    render(
      <EpisClassicMd3Shell
        topAppBar={<span />}
        patientHeader={<span />}
        leftNavigation={<span />}
        mainPane={<span />}
        actionRail={
          <button type="button" data-testid="rail-btn" onClick={() => undefined}>
            labs
          </button>
        }
        statusBar={<span>{copy.classicMd3.modeLabel}</span>}
      />,
    );
    expect(screen.queryByTestId('epis2-classic-md3-action-bar-slot')).not.toBeInTheDocument();
  });
});

describe('EpisClassicMd3PatientHeader', () => {
  it('muestra nombre y chips de alergias', () => {
    render(
      <EpisClassicMd3PatientHeader
        displayName="Ana Demo"
        metaLine="DEMO-01"
        allergyLabels={['Penicilina']}
      />,
    );
    expect(screen.getByText('Ana Demo')).toBeInTheDocument();
    expect(screen.getByText('Penicilina')).toBeInTheDocument();
  });
});

describe('EpisClassicMd3TopAppBar', () => {
  it('muestra médico y rol sin acciones clínicas irreversibles', () => {
    render(
      <EpisClassicMd3TopAppBar
        patientLabel="Ana"
        clinicianLabel="Dr. Pérez"
        roleLabel="Médico"
        serviceLabel="Medicina"
        timestampLabel="2026-06-07"
        onBackToCommand={() => undefined}
      />,
    );
    expect(screen.getByText('Dr. Pérez')).toBeInTheDocument();
    expect(screen.getByText('Médico')).toBeInTheDocument();
    expect(screen.queryByText(/Firmar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Guardar/i)).not.toBeInTheDocument();
  });
});

describe('EpisClassicMd3SupportingPane', () => {
  it('colapsa supporting pane al pulsar toggle', () => {
    const onToggle = vi.fn();
    const { rerender } = render(
      <EpisClassicMd3SupportingPane open onToggle={onToggle}>
        contexto
      </EpisClassicMd3SupportingPane>,
    );
    fireEvent.click(screen.getByText(copy.classicMd3.collapseSupporting));
    expect(onToggle).toHaveBeenCalled();
    rerender(
      <EpisClassicMd3SupportingPane open={false} onToggle={onToggle}>
        contexto
      </EpisClassicMd3SupportingPane>,
    );
    expect(screen.queryByTestId('epis2-classic-md3-supporting-pane')).not.toBeInTheDocument();
  });
});

describe('EpisClassicMd3CommandBar', () => {
  it('dispara callback al enviar comando', () => {
    const onSubmit = vi.fn();
    render(
      <EpisClassicMd3CommandBar query="" onQueryChange={() => undefined} onSubmit={onSubmit} />,
    );
    fireEvent.click(screen.getByText(copy.classicMd3.commandSubmit));
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe('EpisClassicMd3StatusBar', () => {
  it('muestra modo clásico y estado', () => {
    render(
      <EpisClassicMd3StatusBar
        draftStatusLabel="Borrador"
        userLabel="Dr. Pérez"
        roleLabel="Médico"
        aiStatusLabel={copy.classicMd3.aiOk}
        dbStatusLabel={copy.classicMd3.dbOk}
        environmentLabel={copy.classicMd3.statusDemo}
      />,
    );
    expect(screen.getByTestId('epis2-classic-md3-status-bar')).toHaveTextContent(
      copy.classicMd3.modeLabel,
    );
    expect(screen.getByTestId('epis2-classic-md3-status-bar')).toHaveTextContent('Borrador');
  });
});
