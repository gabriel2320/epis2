import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../theme/motion.js';
import { useEpis2ThemePreferences } from '../providers/EpisThemePreferences.js';

type FocusSnapshot = {
  element: HTMLElement;
  start: number;
  end: number;
};

/** Estado del panel de contexto clínico con preservación de foco en el formulario. */
export function useEpisClinicalContextPanel(initialOpen = false) {
  const [contextOpen, setContextOpenState] = useState(initialOpen);
  const focusSnapshot = useRef<FocusSnapshot | null>(null);
  const { preferences } = useEpis2ThemePreferences();
  const reducedMotion = preferences.motion === 'reduced' || prefersReducedMotion();

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
    },
    [captureFocus],
  );

  useEffect(() => {
    if (!focusSnapshot.current) return;
    const id = window.setTimeout(restoreFocus, reducedMotion ? 0 : 280);
    return () => window.clearTimeout(id);
  }, [contextOpen, reducedMotion, restoreFocus]);

  return { contextOpen, setContextOpen };
}
