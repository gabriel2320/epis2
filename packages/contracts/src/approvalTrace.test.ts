import { describe, expect, it } from 'vitest';
import {
  EPIS2_DRAFT_ASSIST_TRACE_KEY,
  mergeAssistTraceIntoDraftBody,
  readAssistTraceFromDraftBody,
  stripAssistTraceFromDraftBody,
} from './approvalTrace.js';

const RUN_ID = '00000000-0000-4000-8000-000000000099';

describe('approvalTrace', () => {
  it('round-trip aiRunId en body de borrador', () => {
    const body = mergeAssistTraceIntoDraftBody({ subjective: 'x' }, { aiRunId: RUN_ID });
    expect(readAssistTraceFromDraftBody(body)?.aiRunId).toBe(RUN_ID);
    const clinical = stripAssistTraceFromDraftBody(body);
    expect(clinical).toEqual({ subjective: 'x' });
    expect(clinical[EPIS2_DRAFT_ASSIST_TRACE_KEY]).toBeUndefined();
  });
});
