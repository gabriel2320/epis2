/**
 * @vitest-environment jsdom
 */
import type { CommandChip } from '@epis2/command-registry';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ClinicalProbableActionsPanel } from './ClinicalProbableActionsPanel.js';

vi.mock('@epis2/epis2-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@epis2/epis2-ui')>();
  return {
    ...actual,
    EpisCommandSuggestionCards: ({
      cards,
      onSelect,
    }: {
      cards: CommandChip[];
      onSelect: (s: string) => void;
    }) => (
      <div data-testid="epis2-command-suggestion-cards">
        {cards.map((c) => (
          <button key={c.id} type="button" onClick={() => onSelect(c.sampleEs)}>
            {c.labelEs}
          </button>
        ))}
      </div>
    ),
  };
});

const sampleChips: CommandChip[] = [
  {
    id: 'probable-create_evolution_draft',
    labelEs: 'Evolución médica',
    sampleEs: 'control diabetes',
    intent: 'create_evolution_draft',
  },
  {
    id: 'probable-prepare_prescription',
    labelEs: 'Receta médica',
    sampleEs: 'renovar receta cronica',
    intent: 'prepare_prescription',
  },
];

describe('ClinicalProbableActionsPanel (MF-DI-05)', () => {
  afterEach(() => cleanup());

  it('renderiza tarjetas de sugerencia', () => {
    render(<ClinicalProbableActionsPanel chips={sampleChips} onSelect={() => {}} />);
    expect(screen.getByTestId('epis2-clinical-probable-actions')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-command-suggestion-cards')).toBeInTheDocument();
    expect(screen.getByText('Evolución médica')).toBeInTheDocument();
  });

  it('propaga onSelect al hacer clic', () => {
    const onSelect = vi.fn();
    render(<ClinicalProbableActionsPanel chips={sampleChips} onSelect={onSelect} />);
    screen.getByText('Receta médica').click();
    expect(onSelect).toHaveBeenCalledWith('renovar receta cronica');
  });
});
