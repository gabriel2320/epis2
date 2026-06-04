import { copy, type DemoRole } from '@epis2/design-system';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  clearDemoSession,
  loadDemoSession,
  saveDemoSession,
  type DemoSession,
} from './demoSession.js';

type DemoSessionContextValue = {
  session: DemoSession | null;
  login: (role: DemoRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(() => loadDemoSession());

  const login = useCallback((role: DemoRole) => {
    const next: DemoSession = {
      role,
      userName: `Usuario ${copy.roles[role]} (demo)`,
    };
    saveDemoSession(next);
    setSession(next);
  }, []);

  const logout = useCallback(() => {
    clearDemoSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      login,
      logout,
      isAuthenticated: session !== null,
    }),
    [session, login, logout],
  );

  return (
    <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>
  );
}

export function useDemoSession(): DemoSessionContextValue {
  const ctx = useContext(DemoSessionContext);
  if (!ctx) {
    throw new Error('useDemoSession debe usarse dentro de DemoSessionProvider');
  }
  return ctx;
}
