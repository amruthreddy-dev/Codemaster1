import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Participant } from '../types.ts';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  participant: Participant | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isParticipant: boolean;
  login: (identifier: string, password: string) => Promise<{ role: string; participant?: Participant }>;
  register: (payload: any) => Promise<{ participant_id: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      setParticipant(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      setParticipant(data.participant || null);
    } catch (err) {
      console.warn('Session expired or invalid token');
      removeStoredToken();
      setUser(null);
      setParticipant(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (identifier: string, password: string) => {
    const res = await api.login(identifier, password);
    setStoredToken(res.token);
    setUser(res.user);
    setParticipant(res.participant || null);
    return { role: res.role, participant: res.participant };
  };

  const register = async (payload: any) => {
    const res = await api.register(payload);
    setStoredToken(res.token);
    setUser(res.participant ? { id: res.participant.user_id, identifier: res.participant_id, role: 'PARTICIPANT' } : null);
    setParticipant(res.participant);
    return { participant_id: res.participant_id };
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
    setParticipant(null);
  };

  const value = {
    user,
    participant,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isParticipant: user?.role === 'PARTICIPANT',
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
