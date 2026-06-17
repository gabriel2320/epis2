import Box from '@mui/material/Box';
import { EpisM3Text } from '../primitives/EpisM3Text.js';
import {
  ClinicalFieldCell,
  ClinicalFieldGrid,
  ClinicalSection,
} from '../layout/clinical/index.js';
import { CicaScreenFrame } from './CicaScreenFrame.js';
import type { CicaGeneratedScreenProps } from './cicaScreenBlueprint.js';

/** Grilla MD3 desde blueprint — sin shell (para anidar en ficha). */
export function CicaBlueprintBody({
  blueprint,
  slots = {},
}: Pick<CicaGeneratedScreenProps, 'blueprint' | 'slots'>) {
  return (
    <ClinicalFieldGrid columns={12} testId={`cica-blueprint-grid-${blueprint.screenId}`}>
      {blueprint.sections.map((section) => {
        const content = slots[section.id] ?? (
          section.placeholder ? (
            <EpisM3Text role="bodyMedium" color="text.secondary">
              {section.placeholder}
            </EpisM3Text>
          ) : null
        );

        return (
          <ClinicalFieldCell
            key={section.id}
            span={section.span ?? 12}
            testId={`cica-blueprint-section-${section.id}`}
          >
            <ClinicalSection
              {...(section.title ? { title: section.title } : {})}
              {...(section.subtitle ? { subtitle: section.subtitle } : {})}
              testId={`cica-blueprint-block-${section.id}`}
            >
              <Box sx={{ minWidth: 0 }}>{content}</Box>
            </ClinicalSection>
          </ClinicalFieldCell>
        );
      })}
    </ClinicalFieldGrid>
  );
}

/** Pantalla CICA generada desde blueprint — MD3 grilla simétrica. */
export function CicaGeneratedScreen({
  blueprint,
  title,
  subtitle,
  slots = {},
  actions = [],
  testId,
}: CicaGeneratedScreenProps) {
  return (
    <CicaScreenFrame
      screenId={blueprint.screenId}
      {...(title ? { title } : {})}
      {...(subtitle ? { subtitle } : {})}
      actions={actions}
      hideActionBar={blueprint.hideActionBar ?? actions.length === 0}
      testId={testId ?? `cica-generated-${blueprint.screenId}`}
    >
      <CicaBlueprintBody blueprint={blueprint} slots={slots} />
    </CicaScreenFrame>
  );
}
