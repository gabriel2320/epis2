import type { DemoRole } from '@epis2/design-system';

export type DemoSession = {
  userName: string;
  role: DemoRole;
};

const STORAGE_KEY = 'epis2-demo-session';

export function loadDemoSession(): DemoSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoSession;
  } catch {
    return null;
  }
}

export function saveDemoSession(session: DemoSession): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
