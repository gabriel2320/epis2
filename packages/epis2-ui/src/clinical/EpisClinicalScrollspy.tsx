import { useEffect, useRef, useState } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { epis2ClinicalScrollspyNavSx } from './patient-chart-tokens.js';

export type EpisClinicalScrollspySection = {
  id: string;
  label: string;
};

export type EpisClinicalScrollspyProps = {
  sections: EpisClinicalScrollspySection[];
  /** Prefijo del id DOM de sección (default epis2-section-). */
  sectionDomIdPrefix?: string;
  testId?: string;
};

function sectionElementId(prefix: string, sectionId: string): string {
  return `${prefix}${sectionId}`;
}

/** Nivel 3 — índice lateral con scrollspy (salto a sección del formulario). */
export function EpisClinicalScrollspy({
  sections,
  sectionDomIdPrefix = 'epis2-section-',
  testId = 'epis2-clinical-scrollspy',
}: EpisClinicalScrollspyProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (sections.length === 0 || typeof IntersectionObserver === 'undefined') return;

    observerRef.current?.disconnect();
    const visible = new Map<string, number>();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id.replace(sectionDomIdPrefix, '');
          if (entry.isIntersecting) {
            visible.set(id, entry.intersectionRatio);
          } else {
            visible.delete(id);
          }
        }
        if (visible.size === 0) return;
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        if (best) setActiveId(best[0]);
      },
      { root: null, rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    for (const section of sections) {
      const el = document.getElementById(sectionElementId(sectionDomIdPrefix, section.id));
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [sections, sectionDomIdPrefix]);

  const scrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionElementId(sectionDomIdPrefix, sectionId));
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(sectionId);
  };

  if (sections.length < 2) return null;

  return (
    <Box
      component="nav"
      aria-label="Índice del formulario"
      sx={epis2ClinicalScrollspyNavSx}
      data-testid={testId}
    >
      <List dense disablePadding>
        {sections.map((section) => (
          <ListItemButton
            key={section.id}
            selected={activeId === section.id}
            onClick={() => scrollTo(section.id)}
            data-testid={`epis2-scrollspy-${section.id}`}
            sx={{ borderRadius: 1, mb: 0.5 }}
          >
            <ListItemText
              primary={section.label}
              primaryTypographyProps={{ fontSize: '0.875rem' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
