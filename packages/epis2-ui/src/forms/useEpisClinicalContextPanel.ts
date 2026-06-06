import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../theme/motion.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';

type FocusSnapshot = {
  element: HTMLElement;
  start: number;
  end: number;
};

export type UseEpisClinicalContextPanelOptions = {
  /** Clave sessionStorage para persistir apertura del split (p. ej. patientId+blueprintId). */
  storageKey?: string;
};

function readStoredContextOpen(storageKey: string | undefined, splitScreenDefault: boolean): boolean {
  if (storageKey && typeof sessionStorage !== 'undefined') {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored === '1') return true;
      if (stored === '0') return false;
    } catch {
      // sessionStorage puede fallar en modo privado estricto
    }
  }
  return splitScreenDefault;
}

function writeStoredContextOpen(storageKey: string | undefined, open: boolean): void {
  if (!storageKey || typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(storageKey, open ? '1' : '0');
  } catch {
    // sessionStorage puede fallar en modo privado estricto
  }
}

/** Estado del panel de contexto clínico con preservación de foco en el formulario. */
export function useEpisClinicalContextPanel(options?: UseEpisClinicalContextPanelOptions) {
  const storageKey = options?.storageKey;
  const { preferences } = useEpis2ThemePreferences();
  const splitDefault = preferences.clinicalSplitScreen === 'split';
  const [contextOpen, setContextOpenState] = useState(() =>
    readStoredContextOpen(storageKey, splitDefault),
  );
  const focusSnapshot = useRef<FocusSnapshot | null>(null);
  const reducedMotion = preferences.motion === 'reduced' || prefersReducedMotion();

  useEffect(() => {
    if (!storageKey) return;
    const stored =
      typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(storageKey) : null;
    if (stored === null && splitDefault) {
      setContextOpenState(true);
      writeStoredContextOpen(storageKey, true);
    }
  }, [splitDefault, storageKey]);

  const captureFocus = useCallback(() => {
    const el = document.activeElement;
    if (el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement) {
      focusSnapshot.current = {
        element: el,
        start: el.selectionStart ?? 0,
        end: el.selectionEnd ?? 0,
      };
    }
  }, []);

  const restoreFocus = useCallback(() => {
    const snap = focusSnapshot.current;
    if (!snap?.element || !document.contains(snap.element)) return;
    snap.element.focus();
    if (
      snap.element instanceof HTMLTextAreaElement ||
      (snap.element instanceof HTMLInputElement &&
        ['text', 'search', 'url', 'tel', 'password'].includes(snap.element.type))
    ) {
      snap.element.setSelectionRange(snap.start, snap.end);
    }
  }, []);

  const setContextOpen = useCallback(
    (open: boolean) => {
      if (open) captureFocus();
      setContextOpenState(open);
      writeStoredContextOpen(storageKey, open);
    },
    [captureFocus, storageKey],
  );

  useEffect(() => {
    if (!focusSnapshot.current) return;
    const id = window.setTimeout(restoreFocus, reducedMotion ? 0 : 280);
    return () => window.clearTimeout(id);
  }, [contextOpen, reducedMotion, restoreFocus]);

  return { contextOpen, setContextOpen };
}
