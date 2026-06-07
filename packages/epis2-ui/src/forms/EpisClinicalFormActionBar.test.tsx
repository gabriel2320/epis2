/**
 * @vitest-environment jsdom
 */
import { copy } from '@epis2/design-system';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisClinicalFormActionBar } from './EpisClinicalFormActionBar.js';

describe('EpisClinicalFormActionBar', () => {
  it('muestra Guardar, Firmar y menú overflow (UX-G03)', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const onSign = vi.fn();
    const onOverflow = vi.fn();

    render(
      <Epis2ThemeProvider>
        <EpisClinicalFormActionBar
          saveLabel={copy.forms.save}
          onSave={onSave}
          signLabel={copy.forms.sign}
          onSign={onSign}
          overflow={[{ id: 'ai', label: copy.forms.suggestAi, onClick: onOverflow }]}
          overflowAriaLabel={copy.forms.moreActions}
        />
      </Epis2ThemeProvider>,
    );

    await user.click(screen.getByTestId('epis2-form-save'));
    expect(onSave).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId('epis2-form-sign'));
    expect(onSign).toHaveBeenCalledTimes(1);

    await user.click(screen.getByTestId('epis2-form-more-actions'));
    await user.click(screen.getByText(copy.forms.suggestAi));
    expect(onOverflow).toHaveBeenCalledTimes(1);
  });
});
