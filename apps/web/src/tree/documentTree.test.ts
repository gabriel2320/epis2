import { describe, expect, it } from 'vitest';
import { buildDocumentTreeByType, formatDocumentType } from './documentTree.js';

describe('documentTree', () => {
  it('agrupa por tipo de documento', () => {
    const tree = buildDocumentTreeByType([
      { id: '1', title: 'Epicrisis', documentType: 'pdf' },
      { id: '2', title: 'Hemograma', documentType: 'lab_report' },
    ]);
    expect(tree).toHaveLength(2);
    expect(tree[0]?.children).toHaveLength(1);
    expect(formatDocumentType('lab_report')).toBeTruthy();
  });
});
