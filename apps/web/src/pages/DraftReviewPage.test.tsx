/**
 * @vitest-environment jsdom
 * DraftReviewPage (gap auditoría 4.4): render de borrador, gate de aprobación humana.
 */
import { copy } from '@epis2/design-system';
import { cleanup, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderWithEpisApp } from '../test/renderWithEpisApp.js';
import { DraftReviewPage } from './DraftReviewPage.js';

const { draftDetailState } = vi.hoisted(() => ({
  draftDetailState: {
    data: undefined as unknown,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  },
}));

vi.mock('@tanstack/react-router', () => ({
  useParams: () => ({ draftId: 'draft-1' }),
  useSearch: () => ({}),
  useRouterState: ({
    select,
  }: {
    select: (s: { location: { pathname: string; searchStr?: string } }) => unknown;
  }) => select({ location: { pathname: '/espacio/borrador/draft-1', searchStr: '' } }),
  Link: ({ children, to, ...rest }: { children?: unknown; to: string }) => (
    <a href={to} {...rest}>
      {children as string}
    </a>
  ),
}));

vi.mock('../routes/clinicalNavigate.js', () => ({
  useClinicalNavigate: () => vi.fn(),
}));

vi.mock('../query/hooks/useDraftDetailQuery.js', () => ({
  useDraftDetailQuery: () => draftDetailState,
}));

vi.mock('../query/hooks/useDraftMutations.js', () => ({
  useApproveDraftMutation: () => ({ mutate: vi.fn() }),
  useUpdateDraftMutation: () => ({ mutate: vi.fn() }),
}));

vi.mock('../query/hooks/usePatientDetailQuery.js', () => ({
  usePatientDetailQuery: () => ({ data: undefined }),
}));

vi.mock('../clinical/usePatientClinicalAlerts.js', () => ({
  usePatientClinicalAlerts: () => ({ alerts: [], loading: false }),
}));

vi.mock('../auth/AuthContext.js', () => ({
  useAuth: () => ({
    session: {
      user: { id: 'usr-physician-01', displayName: 'Dra. Ana Demo', role: 'physician' },
      permissions: ['draft.write', 'draft.approve'],
      expiresAt: new Date().toISOString(),
    },
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
    refreshSession: vi.fn(),
    hasPermission: (p: string) => ['draft.write', 'draft.approve'].includes(p),
  }),
}));

function setDraft(status: string) {
  draftDetailState.data = {
    draft: {
      id: 'draft-1',
      patientId: 'a0000001-0000-4000-8000-000000000001',
      encounterId: null,
      draftType: 'evolution_note',
      status,
      title: 'Evolución demo',
      body: { subjective: 'Paciente estable' },
    },
    versions: [
      {
        versionNo: 1,
        status,
        createdAt: new Date().toISOString(),
      },
    ],
  };
}

afterEach(() => cleanup());

describe('DraftReviewPage', () => {
  it('muestra título, disclaimer de aprobación y botón aprobar para ready_for_review', () => {
    setDraft('ready_for_review');
    renderWithEpisApp(<DraftReviewPage />);

    expect(screen.getByText(copy.drafts.reviewTitle)).toBeInTheDocument();
    expect(screen.getByText(copy.drafts.approvalDisclaimer)).toBeInTheDocument();
    expect(screen.getByTestId('epis2-draft-status-ready_for_review')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-draft-approve')).toBeInTheDocument();
    expect(screen.getByTestId('epis2-draft-versions')).toBeInTheDocument();
  });

  it('borrador aprobado: sin botón de aprobación ni envío a revisión', () => {
    setDraft('approved');
    renderWithEpisApp(<DraftReviewPage />);

    expect(screen.getByTestId('epis2-draft-status-approved')).toBeInTheDocument();
    expect(screen.queryByTestId('epis2-draft-approve')).not.toBeInTheDocument();
    expect(screen.queryByText(copy.drafts.sendToReview)).not.toBeInTheDocument();
  });
});
