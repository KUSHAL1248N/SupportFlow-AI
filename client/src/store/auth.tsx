import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { api } from '../api';

export type AppUser = { id: string; name: string; email: string; role: string };
type AuthContextValue = {
  user: AppUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  hydrate: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function saveSession(payload: { accessToken: string; user: AppUser }): AppUser {
  sessionStorage.setItem('accessToken', payload.accessToken);
  return payload.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [ready, setReady] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(saveSession(data));
    setReady(true);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    setUser(saveSession(data));
    setReady(true);
  }, []);

  const hydrate = useCallback(async () => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) { setReady(true); return; }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data);
    } catch {
      sessionStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('accessToken');
    setUser(null);
    setReady(true);
  }, []);

  const value = useMemo(() => ({ user, ready, login, register, hydrate, logout }), [user, ready, login, register, hydrate, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
