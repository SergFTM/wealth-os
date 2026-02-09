"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { Locale, DisplayLocale, coreLocale, dictionaries, Dictionary } from '@/lib/i18n';
import { UserRole } from '@/lib/data';

type Scope = 'household' | 'entity' | 'portfolio' | 'account';
export type Theme = 'light' | 'dark';

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
  displayLocale: DisplayLocale;
  t: Dictionary;
  // Theme
  theme: Theme;
  // Scope
  scope: Scope;
  asOfDate: string;
  // UI
  copilotOpen: boolean;
  aiPanelOpen: boolean;
  createModalOpen: boolean;
  // Navigation
  activeCluster: number;
}

interface AppContextType extends AppState {
  login: (role: UserRole, name?: string) => void;
  logout: () => void;
  setLocale: (locale: DisplayLocale) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setScope: (scope: Scope) => void;
  setAsOfDate: (date: string) => void;
  toggleClientSafe: () => void;
  openCopilot: () => void;
  closeCopilot: () => void;
  toggleAiPanel: () => void;
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setActiveCluster: (clusterId: number) => void;
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
    locale: 'en',
    displayLocale: 'en',
    t: dictionaries.en,
    theme: 'light',
    scope: 'household',
    asOfDate: today,
    copilotOpen: false,
    aiPanelOpen: false,
    createModalOpen: false,
    activeCluster: 1,
  });

  // Initialize theme from localStorage (default to light)
  useEffect(() => {
    const stored = localStorage.getItem('wealth-os-theme') as Theme | null;
    const initialTheme = stored || 'light';

    setState(prev => ({ ...prev, theme: initialTheme }));
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    const storedCluster = localStorage.getItem('wealth-os-active-cluster');
    if (storedCluster) {
      const parsed = parseInt(storedCluster, 10);
      if (parsed >= 1 && parsed <= 6) {
        setState(prev => ({ ...prev, activeCluster: parsed }));
      }
    }
  }, []);

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

  const setLocale = useCallback((dl: DisplayLocale) => {
    setState(prev => ({
      ...prev,
      locale: coreLocale(dl),
      displayLocale: dl,
      t: dictionaries[dl],
    }));
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    localStorage.setItem('wealth-os-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    setState(prev => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState(prev => {
      const newTheme = prev.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('wealth-os-theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return { ...prev, theme: newTheme };
    });
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

  const toggleAiPanel = useCallback(() => {
    setState(prev => ({ ...prev, aiPanelOpen: !prev.aiPanelOpen }));
  }, []);

  const openCreateModal = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: true }));
  }, []);

  const closeCreateModal = useCallback(() => {
    setState(prev => ({ ...prev, createModalOpen: false }));
  }, []);

  const setActiveCluster = useCallback((clusterId: number) => {
    localStorage.setItem('wealth-os-active-cluster', String(clusterId));
    setState(prev => ({ ...prev, activeCluster: clusterId }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        logout,
        setLocale,
        setTheme,
        toggleTheme,
        setScope,
        setAsOfDate,
        toggleClientSafe,
        openCopilot,
        closeCopilot,
        toggleAiPanel,
        openCreateModal,
        closeCreateModal,
        setActiveCluster,
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

export interface ScopeInfo {
  type: 'global' | 'household' | 'entity' | 'portfolio';
  id: string;
}

export function useScope() {
  const context = useContext(AppContext);
  if (!context) {
    // Return default scope when not in provider
    return {
      scope: { type: 'global', id: 'global' } as ScopeInfo,
      setScope: () => {},
    };
  }
  return {
    scope: {
      type: context.scope as ScopeInfo['type'],
      id: context.scope === 'household' ? 'hh-001' :
          context.scope === 'entity' ? 'ent-001' :
          context.scope === 'portfolio' ? 'port-001' : 'global',
    } as ScopeInfo,
    setScope: context.setScope,
  };
}
