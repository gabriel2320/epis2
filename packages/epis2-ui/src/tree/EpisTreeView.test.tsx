/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Epis2ThemeProvider } from '../providers/Epis2ThemeProvider.js';
import { EpisTreeView } from './EpisTreeViewCore.js';

describe('EpisTreeView', () => {
  it('muestra mensaje vacío', () => {
    render(
      <Epis2ThemeProvider>
        <EpisTreeView items={[]} emptyMessage="Sin documentos." data-testid="epis2-tree-empty" />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByText('Sin documentos.')).toBeInTheDocument();
  });

  it('renderiza nodos anidados', () => {
    render(
      <Epis2ThemeProvider>
        <EpisTreeView
          items={[
            {
              id: 'type-lab',
              label: 'Laboratorio (1)',
              children: [{ id: 'doc-1', label: 'Hemograma demo' }],
            },
          ]}
          defaultExpandedItems={['type-lab']}
          onItemClick={vi.fn()}
          data-testid="epis2-tree-docs"
        />
      </Epis2ThemeProvider>,
    );
    expect(screen.getByTestId('epis2-tree-docs')).toBeInTheDocument();
    expect(screen.getByText('Hemograma demo')).toBeInTheDocument();
  });
});
