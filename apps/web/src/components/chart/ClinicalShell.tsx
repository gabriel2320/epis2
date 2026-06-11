import { Box, epis2ChartContentTransitionSx } from '@epis2/epis2-ui';
import type { ReactNode } from 'react';
import type { ChartModeId } from '../../dev/dualChartModesEnv.js';
import { EpisUniversalCommandBar } from '../command/EpisUniversalCommandBar.js';
import { ClinicalActionBar } from './ClinicalActionBar.js';
import { ClinicalFooterStatus } from './ClinicalFooterStatus.js';
import { ClinicalInstitutionalHeader } from './ClinicalInstitutionalHeader.js';
import { CommandPaletteOverlay } from './CommandPaletteOverlay.js';
import {
  PatientIdentityBand,
  type PatientDocumentStatus,
  type PatientIdentityBandProps,
} from './PatientIdentityBand.js';

export type ClinicalShellProps = {
  chartMode: ChartModeId;
  onChartModeChange: (mode: ChartModeId) => void;
  displayName: string;
  metaLine?: string | undefined;
  nationalId?: string | undefined;
  ageYears?: number | undefined;
  sexLabel?: string | undefined;
  bedLabel?: string | undefined;
  serviceUnit?: string | undefined;
  admissionDate?: string | undefined;
  allergyLabels?: readonly string[] | undefined;
  documentStatus?: PatientDocumentStatus | undefined;
  headerServiceUnit?: string | undefined;
  lastSavedAt?: Date | null | undefined;
  paperPageLabel?: string | undefined;
  children: ReactNode;
  commandQuery: string;
  onCommandQueryChange: (value: string) => void;
  onCommandSubmit: () => void;
  commandSuggestions?: readonly string[] | undefined;
  onCommandSuggestion?: ((label: string) => void) | undefined;
  onNewEvolution?: (() => void) | undefined;
  onNewOrder?: (() => void) | undefined;
  onOpenLab?: (() => void) | undefined;
  onOpenPrescription?: (() => void) | undefined;
  onSaveDraft?: (() => void) | undefined;
  onSign?: (() => void) | undefined;
  onPrint?: (() => void) | undefined;
  userDisplayName?: string | undefined;
  userRoleLabel?: string | undefined;
  testId?: string | undefined;
};

/** Shell clínico unificado — 4 capas fijas + command bar transversal (ADR-002 MF-04). */
export function ClinicalShell({
  chartMode,
  onChartModeChange,
  displayName,
  metaLine,
  nationalId,
  ageYears,
  sexLabel,
  bedLabel,
  serviceUnit,
  admissionDate,
  allergyLabels,
  documentStatus,
  headerServiceUnit,
  lastSavedAt,
  paperPageLabel,
  children,
  commandQuery,
  onCommandQueryChange,
  onCommandSubmit,
  commandSuggestions,
  onCommandSuggestion,
  onNewEvolution,
  onNewOrder,
  onOpenLab,
  onOpenPrescription,
  onSaveDraft,
  onSign,
  onPrint,
  userDisplayName,
  userRoleLabel,
  testId = 'epis2-clinical-shell-v2',
}: ClinicalShellProps) {
  const identityProps: PatientIdentityBandProps = {
    displayName,
    metaLine,
    nationalId,
    ageYears,
    sexLabel,
    bedLabel,
    serviceUnit,
    admissionDate,
    allergyLabels,
    documentStatus,
  };

  const commandBar = (
    <EpisUniversalCommandBar
      variant="clinical-chart"
      embedded
      query={commandQuery}
      onQueryChange={onCommandQueryChange}
      onSubmit={onCommandSubmit}
      {...(commandSuggestions ? { suggestions: commandSuggestions } : {})}
      {...(onCommandSuggestion ? { onSuggestionSelect: onCommandSuggestion } : {})}
      testId="epis2-chart-command-bar"
    />
  );

  return (
    <>
      <Box
        data-testid={testId}
        sx={{
          height: '100dvh',
          maxHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.default',
        }}
      >
        <ClinicalInstitutionalHeader serviceUnit={headerServiceUnit ?? serviceUnit} />
        <PatientIdentityBand {...identityProps} />
        <ClinicalActionBar
          chartMode={chartMode}
          onChartModeChange={onChartModeChange}
          commandBar={commandBar}
          onNewEvolution={onNewEvolution}
          onNewOrder={onNewOrder}
          onOpenLab={onOpenLab}
          onOpenPrescription={onOpenPrescription}
          onSaveDraft={onSaveDraft}
          onSign={onSign}
          onPrint={onPrint}
        />
        <Box
          key={chartMode}
          sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', ...epis2ChartContentTransitionSx() }}
        >
          {children}
        </Box>        <ClinicalFooterStatus
          userDisplayName={userDisplayName}
          userRoleLabel={userRoleLabel}
          documentStatus={documentStatus}
          lastSavedAt={lastSavedAt}
          chartMode={chartMode}
          paperPageLabel={paperPageLabel}
        />
      </Box>
      <CommandPaletteOverlay />
    </>
  );
}

export { ChartModeSwitch } from './ChartModeSwitch.js';
