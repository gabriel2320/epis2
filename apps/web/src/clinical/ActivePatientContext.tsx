import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { PatientListRow } from '../api/clinicalApi.js';

const STORAGE_KEY = 'epis2_active_patient';

type ActivePatientContextValue = {
  patient: PatientListRow | null;
  setPatient: (patient: PatientListRow | null) => void;
  clearPatient: () => void;
};

const ActivePatientContext = createContext<ActivePatientContextValue | null>(null);

function readStored(): PatientListRow | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PatientListRow;
  } catch {
    return null;
  }
}

function writeStored(patient: PatientListRow | null) {
  if (!patient) {
    sessionStorage.removeItem(STORAGE_KEY);
    return;
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(patient));
}

export function ActivePatientProvider({ children }: { children: ReactNode }) {
  const [patient, setPatientState] = useState<PatientListRow | null>(() => readStored());

  const setPatient = useCallback((next: PatientListRow | null) => {
    setPatientState(next);
    writeStored(next);
  }, []);

  const clearPatient = useCallback(() => setPatient(null), [setPatient]);

  const value = useMemo(
    () => ({ patient, setPatient, clearPatient }),
    [patient, setPatient, clearPatient],
  );

  return (
    <ActivePatientContext.Provider value={value}>{children}</ActivePatientContext.Provider>
  );
}

export function useActivePatient() {
  const ctx = useContext(ActivePatientContext);
  if (!ctx) {
    throw new Error('useActivePatient debe usarse dentro de ActivePatientProvider');
  }
  return ctx;
}
