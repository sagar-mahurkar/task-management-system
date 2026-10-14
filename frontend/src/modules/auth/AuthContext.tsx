import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { STORAGE_KEYS } from '@/shared/constants/storage';
import type { User } from '@/shared/types/user';
import { authApi } from './authApi';
import { AuthContext } from './authContext';

function getStoredAuth(): { token: string | null; user: User | null } {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
  if (!token || !storedUser) {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { token: null, user: null };
  }
  try {
    const user = JSON.parse(storedUser) as User;
    if (!user.id || !user.email) throw new Error('Invalid stored user');
    return { token, user };
  } catch {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    return { token: null, user: null };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [initialAuth] = useState(getStoredAuth);
  const [token, setToken] = useState<string | null>(initialAuth.token);
  const [user, setUser] = useState<User | null>(initialAuth.user);
  const [loading, setLoading] = useState(Boolean(initialAuth.token));

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
    setLoading(false);
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    window.addEventListener('auth:unauthorized', logout);
    return () => window.removeEventListener('auth:unauthorized', logout);
  }, [logout]);

  useEffect(() => {
    if (!initialAuth.token) return;
    let active = true;
    authApi.getCurrentUser()
      .then((currentUser) => {
        if (!active) return;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
        setUser(currentUser);
      })
      .catch(() => {
        // A 401 clears the session through the API interceptor. Preserve it on network/server failures.
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [initialAuth.token, logout]);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    logout,
  }), [token, user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
