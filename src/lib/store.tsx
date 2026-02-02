"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Locale, dictionaries, Dictionary } from '@/lib/i18n';
import { UserRole } from '@/lib/data';

type Scope = 'household' | 'entity' | 'portfolio' | 'account';

interface User {
  name: string;
  role: UserRole;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  user: User | null;
  clientSafe: boolean;
  // Locale
  locale: Locale;
  t: Dictionary;
  // Scope
  scope: Scope;
  asOfDate: string;
  // UI
  copilotOpen: boolean;
  createModalOpen: boolean;
}

interface AppContextType extends AppState {
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
  setLocale: (locale: Locale) => void;
  setScope: (scope: Scope) => void;
  setAsOfDate: (date: string) => void;
  toggleClientSafe: () => void;
  openCopilot: () => void;
  closeCopilot: () => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
}

const roleNames: Record<UserRole, string> = {
  admin: 'Администратор',
  cio: 'CIO',
  cfo: 'CFO',
  operations: 'Operations Manager',
  compliance: 'Compliance Officer',
  rm: 'Relationship Manager',
  advisor: 'Advisor',
  client: 'Клиент',
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const today = new Date().toISOString().split('T')[0];
  
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    userRole: 'client',
    userName: '',
    user: null,
    clientSafe: false,
    locale: 'ru',
    t: dictionaries.ru,
    scope: 'household',
    asOfDate: today,
    copilotOpen: false,
    createModalOpen: false,
  });

  const login = useCallback((role: UserRole, name?: string) => {
    const userName = name || roleNames[role];
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      userRole: role,
      userName,
      user: { name: userName, role },
      clientSafe: role === 'client',
    }));
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      userRole: 'client',
      userName: '',
      user: null,
      clientSafe: false,
    }));
  }, []);

  const setLocale = useCallback((locale: Locale) => {
    setState(prev => ({
      ...prev,
      locale,
      t: dictionaries[locale],
    }));
  }, []);

  const setScope = useCallback((scope: Scope) => {
    setState(prev => ({ ...prev, scope }));
  }, []);

  const setAsOfDate = useCallback((asOfDate: string) => {
    setState(prev => ({ ...prev, asOfDate }));
  }, []);

  const toggleClientSafe = useCallback(() => {
    setState(prev => ({ ...prev, clientSafe: !prev.clientSafe }));
  }, []);

  const openCopilot = useCallback(() => {
    setState(prev => ({ ...prev, copilotOpen: true }));
  }, []);

  const closeCopilot = useCallback(() => {
    setState(prev => ({ ...prev, copilotOpen: false }));
  }, []);

  const openCreateModal = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: true }));
  }, []);

  const closeCreateModal = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: false }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setLocale,
        setScope,
        setAsOfDate,
        toggleClientSafe,
        openCopilot,
        closeCopilot,
        openCreateModal,
        closeCreateModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
