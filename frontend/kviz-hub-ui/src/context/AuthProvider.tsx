import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useServices } from '../hooks/useServices';
import type { AuthContextType, LoginRequest, RegisterRequest, FrontendUser } from '../models/auth';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { auth } = useServices();
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [loading, setLoading] = useState(false);

  // učitaj iz localStorage pri startu
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const login = async (dto: LoginRequest) => {
    setLoading(true);
    try {
      const data = await auth.login(dto);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } finally {
      setLoading(false);
    }
  };

  const register = async (dto: RegisterRequest) => {
    setLoading(true);
    try {
      const data = await auth.register(dto);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value: AuthContextType = { user, login, register, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
