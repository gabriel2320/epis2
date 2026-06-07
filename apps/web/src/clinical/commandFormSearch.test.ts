import { describe, expect, it } from 'vitest';
import {
  COMMAND_SLOT_SEARCH_KEYS,
  commandSlotsFromFormSearch,
  formSearchFromCommandSlots,
  hasCommandSlotSearchParams,
  stripCommandSlotsFromFormSearch,
} from './commandFormSearch.js';

describe('commandFormSearch (CE-5)', () => {
  it('detecta slots en search', () => {
    expect(hasCommandSlotSearchParams({ patientId: 'pid-1' })).toBe(false);
    expect(hasCommandSlotSearchParams({ studyHint: 'hemograma' })).toBe(true);
  });

  it('stripCommandSlotsFromFormSearch conserva solo patientId', () => {
    expect(
      stripCommandSlotsFromFormSearch({
        patientId: 'pid-1',
        studyHint: 'hemograma',
        urgencyHint: 'urgent',
      }),
    ).toEqual({ patientId: 'pid-1' });
  });

  it('roundtrip slots ↔ search', () => {
    const slots = {
      studyHint: 'hemograma',
      clinicalReasonHint: 'fiebre',
      urgencyHint: 'urgent' as const,
    };
    const search = formSearchFromCommandSlots('pid-1', slots);
    expect(commandSlotsFromFormSearch(search)).toEqual(slots);
    expect(COMMAND_SLOT_SEARCH_KEYS.length).toBe(8);
  });
});
