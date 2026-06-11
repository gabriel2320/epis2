import {
  ClinicalCommandPalette,
  useClinicalCommandPaletteShortcut,
} from '@epis2/clinical-productivity';
import { useCallback, useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext.js';
import { useActivePatient } from '../clinical/ActivePatientContext.js';
import { buildClinicalCommandPaletteItems } from '../clinical/buildClinicalCommandPaletteItems.js';
import { useClinicalCommandSubmit } from '../clinical/useClinicalCommandSubmit.js';
import { useCommandResolveContext } from '../clinical/useCommandResolveContext.js';
import { CommandConfirmationDialog } from './CommandConfirmationDialog.js';

const PALETTE_MAX_VISIBLE = 8;

/** Fase B — paleta global Ctrl+K; refuerza `/comando` sin reemplazarlo. */
export function ClinicalShellCommandPalette() {
  const { session } = useAuth();
  const { patient } = useActivePatient();
  const [open, setOpen] = useState(false);
  const commandContext = useCommandResolveContext('patient_chart');

  const { submit, pendingConfirmation, confirmPending, cancelPending } = useClinicalCommandSubmit({
    patientId: patient?.id,
    commandContext,
    onResolved: () => setOpen(false),
  });

  const runCommand = useCallback(
    (text: string) => {
      void submit(text);
    },
    [submit],
  );

  const role = session?.user.role ?? 'physician';
  const permissions = session?.permissions ?? [];

  const items = useMemo(
    () => buildClinicalCommandPaletteItems(role, permissions, runCommand),
    [permissions, role, runCommand],
  );

  useClinicalCommandPaletteShortcut(() => setOpen(true), Boolean(session));

  if (!session) return null;

  return (
    <>
      <ClinicalCommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        maxVisible={PALETTE_MAX_VISIBLE}
        onSubmitNaturalLanguage={runCommand}
      />
      <CommandConfirmationDialog
        pending={pendingConfirmation}
        onConfirm={() => void confirmPending()}
        onCancel={cancelPending}
      />
    </>
  );
}
