import type { SessionResponse } from '@epis2/contracts';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as authApi from './authApi.js';

type AuthContextValue = {
  session: SessionResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, demoAuthKey: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<SessionResponse | null>;
  hasPermission: (permission: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const next = await authApi.fetchSession();
      setSession(next);
      return next;
    } catch {
      setSession(null);
      return null;
    }
  }, []);

  useEffect(() => {
    void refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  const login = useCallback(async (username: string, demoAuthKey: string) => {
    const next = await authApi.login({ username, demoAuthKey });
    setSession(next);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setSession(null);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: string) => session?.permissions.includes(permission) ?? false,
    [session],
  );

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: session !== null,
      isLoading,
      login,
      logout,
      refreshSession,
      hasPermission,
    }),
    [session, isLoading, login, logout, refreshSession, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return ctx;
}

export async function loadSessionForRouter(): Promise<SessionResponse | null> {
  try {
    return await authApi.fetchSession();
  } catch {
    return null;
  }
}
