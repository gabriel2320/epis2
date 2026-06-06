import { describe, expect, it } from 'vitest';
import { mapHl7Message } from './hl7Mapping.js';

describe('mapHl7Message', () => {
  it('mapea ORU^R01 a lab_request preview', () => {
    const msg = [
      'MSH|^~\\&|LAB|HOSP|EPIS2|20260101120000||ORU^R01|1|P|2.5',
      'PID|1||DEMO-004||Vega^Roberto',
      'OBR|1|||CBC^Hemograma',
      'OBX|1|NM|WBC^Leucocitos||9.2|10*3/uL',
    ].join('\r');
    const preview = mapHl7Message(msg);
    expect(preview.messageType).toBe('ORU^R01');
    expect(preview.suggestedDraftType).toBe('lab_request');
    expect(preview.fields.labTests).toContain('Hemograma');
  });

  it('mapea ADT^A01 a admission_note preview', () => {
    const msg = 'MSH|^~\\&|EPIS2|LAB|20260101120000||ADT^A01|1|P|2.5\rPID|1||DEMO-002';
    const preview = mapHl7Message(msg);
    expect(preview.suggestedDraftType).toBe('admission_note');
  });
});
