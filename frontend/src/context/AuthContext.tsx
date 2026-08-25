import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/authService';
import { getAccessToken, setAccessToken } from '../services/api';
import { getErrorMessage } from '../services/api';
import type { AuthContextType, RegisterData, User } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setTokenState] = useState<string | null>(getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }
    try {
      const { data } = await authApi.getProfile();
      setUser(data.data?.user || null);
    } catch {
      setAccessToken(null);
      setTokenState(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const login = async (email: string, password: string, rememberMe = false) => {
    const { data } = await authApi.login(email, password, rememberMe);
    const token = data.data?.accessToken;
    if (token) {
      setAccessToken(token);
      setTokenState(token);
    }
    setUser(data.data?.user || null);
  };

  const register = async (registerData: RegisterData) => {
    await authApi.register(registerData);
    await login(registerData.email, registerData.password);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      setTokenState(null);
      setUser(null);
    }
  };

  const updateUser = (updated: User) => setUser(updated);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export { getErrorMessage };
