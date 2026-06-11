import { describe, expect, it } from 'vitest';
import {
  CLINICAL_SUMMARY_TIMELINE_KINDS,
  filterTimelineByKind,
  formatTimelinePreviewLines,
} from './clinicalSummaryTimeline.js';

describe('clinicalSummaryTimeline (MF-TE-05)', () => {
  const events = [
    { id: '1', kind: 'encounter' as const, at: '2026-06-10T10:00:00.000Z', title: 'Consulta' },
    { id: '2', kind: 'draft' as const, at: '2026-06-09T10:00:00.000Z', title: 'Borrador' },
    { id: '3', kind: 'observation' as const, at: '2026-06-08T10:00:00.000Z', title: 'Lab' },
  ];

  it('filtra por kind', () => {
    expect(filterTimelineByKind(events, 'draft')).toHaveLength(1);
    expect(filterTimelineByKind(events, 'all')).toHaveLength(3);
  });

  it('expone kinds canónicos', () => {
    expect(CLINICAL_SUMMARY_TIMELINE_KINDS).toContain('encounter');
    expect(CLINICAL_SUMMARY_TIMELINE_KINDS).toContain('draft');
  });

  it('formatea preview', () => {
    expect(formatTimelinePreviewLines(events, 2)).toContain('Consulta');
  });
});
