import { describe, expect, it, vi, beforeEach } from 'vitest';
import { navigateResolvedWithAssistDraft } from './useClinicalCommandSubmit.js';

const {
  fetchAiStatus,
  requestDraftAssist,
  stashCommandAssistDraft,
  navigateClinicalCommandResult,
} = vi.hoisted(() => ({
  fetchAiStatus: vi.fn(),
  requestDraftAssist: vi.fn(),
  stashCommandAssistDraft: vi.fn(),
  navigateClinicalCommandResult: vi.fn(),
}));

vi.mock('../api/aiApi.js', () => ({
  fetchAiStatus,
  requestDraftAssist,
}));

vi.mock('@epis2/ai-client/commandAssistDraft', () => ({
  resolveAssistBlueprintForIntent: (intent: string) =>
    intent === 'create_evolution_draft' ? 'evolution_note' : undefined,
  shouldInvokeCommandAssistDraft: (intent: string, aiAvailable: boolean) =>
    aiAvailable && intent === 'create_evolution_draft',
  stashCommandAssistDraft,
}));

vi.mock('./navigateClinicalCommandResult.js', () => ({
  navigateClinicalCommandResult,
}));

describe('navigateResolvedWithAssistDraft MF-CM-06', () => {
  const navigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('invoca assist y navega con assistDraft cuando IA disponible', async () => {
    fetchAiStatus.mockResolvedValue({ available: true });
    requestDraftAssist.mockResolvedValue({
      status: 'success',
      suggestedFields: { subjective: 'demo' },
      requiresHumanReview: true,
      runId: '00000000-0000-4000-8000-000000000001',
    });

    await navigateResolvedWithAssistDraft(
      navigate,
      {
        status: 'resolved',
        intent: 'create_evolution_draft',
        labelEs: 'Evolución',
        routePath: '/espacio/evolucion',
        slots: {},
      },
      'a0000001-0000-4000-8000-000000000005',
      'evolucionar paciente',
    );

    expect(requestDraftAssist).toHaveBeenCalledWith(
      expect.objectContaining({
        blueprintId: 'evolution_note',
        context: { source: 'command_bar', commandText: 'evolucionar paciente' },
      }),
    );
    expect(stashCommandAssistDraft).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(
      expect.objectContaining({
        to: '/espacio/evolucion',
        search: expect.objectContaining({ assistDraft: true }),
      }),
    );
    expect(navigateClinicalCommandResult).not.toHaveBeenCalled();
  });

  it('degrada sin assist cuando IA no disponible', async () => {
    fetchAiStatus.mockResolvedValue({ available: false });

    await navigateResolvedWithAssistDraft(
      navigate,
      {
        status: 'resolved',
        intent: 'create_evolution_draft',
        labelEs: 'Evolución',
        routePath: '/espacio/evolucion',
        slots: {},
      },
      'a0000001-0000-4000-8000-000000000005',
      'evolucionar paciente',
    );

    expect(requestDraftAssist).not.toHaveBeenCalled();
    expect(navigateClinicalCommandResult).toHaveBeenCalled();
  });
});
