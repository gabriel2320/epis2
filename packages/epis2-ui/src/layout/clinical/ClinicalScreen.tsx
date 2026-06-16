import Box from '@mui/material/Box';
import { EpisM3Text } from '../../primitives/EpisM3Text.js';
import type { ReactNode } from 'react';
import type { ClinicalLayoutAction, ClinicalLayoutProfile } from './clinicalLayoutEngine.js';
import { ClinicalLayoutActionBar } from './ClinicalLayoutActionBar.js';
import { clinicalContentSx, clinicalHeaderSx, clinicalScreenSx } from './clinicalLayoutSx.js';

export type ClinicalScreenProps = {
  profile: ClinicalLayoutProfile;
  title?: string;
  subtitle?: string;
  identityBand?: ReactNode;
  contextStrip?: ReactNode;
  tabs?: ReactNode;
  toolbar?: ReactNode;
  actions?: readonly ClinicalLayoutAction[];
  children: ReactNode;
  /** Oculta action bar inferior (acciones en toolbar externo). */
  hideActionBar?: boolean;
  testId?: string;
};

/**
 * EPIS2 Clinical Layout Engine — shell composicional.
 * La pantalla declara intención y contenido; el motor impone estructura y densidad.
 */
export function ClinicalScreen({
  profile,
  title,
  subtitle,
  identityBand,
  contextStrip,
  tabs,
  toolbar,
  actions = [],
  children,
  hideActionBar = false,
  testId = 'clinical-screen',
}: ClinicalScreenProps) {
  return (
    <Box
      data-testid={testId}
      data-clinical-profile={profile}
      sx={clinicalScreenSx(profile)}
      className="epis2-clinical-screen"
    >
      {identityBand}
      {contextStrip}
      {toolbar}
      {title ? (
        <Box sx={clinicalHeaderSx()}>
          <EpisM3Text role="titleLarge" component="h1">
            {title}
          </EpisM3Text>
          {subtitle ? (
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {subtitle}
            </EpisM3Text>
          ) : null}
        </Box>
      ) : null}
      {tabs}
      <Box component="main" sx={clinicalContentSx(profile)}>
        {children}
      </Box>
      {!hideActionBar && actions.length > 0 ? (
        <ClinicalLayoutActionBar profile={profile} actions={actions} />
      ) : null}
    </Box>
  );
}
