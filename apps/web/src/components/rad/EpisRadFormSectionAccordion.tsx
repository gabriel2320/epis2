import type { ReactNode } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  EpisM3Text,
  ExpandMoreIcon,
} from '@epis2/epis2-ui';
import { useRadTabIndex } from '../../design/useRadTabIndex.js';

export type EpisRadFormSectionAccordionProps = {
  id: string;
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
  testId?: string;
};

/** Sección plegable RAD — sin lógica clínica. */
export function EpisRadFormSectionAccordion({
  id,
  title,
  defaultExpanded = false,
  children,
  testId,
}: EpisRadFormSectionAccordionProps) {
  const { next } = useRadTabIndex('formFields');

  return (
    <Accordion
      id={id}
      defaultExpanded={defaultExpanded}
      disableGutters
      elevation={0}
      data-testid={testId ?? `epis2-rad-accordion-${id}`}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'transparent',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />} tabIndex={next()}>
        <EpisM3Text role="labelLarge">{title}</EpisM3Text>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}
