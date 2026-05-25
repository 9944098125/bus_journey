import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { SIDEBAR_LOADING_MS, SIDEBAR_OPEN_KEY } from './sidebar/sidebar.constants';

type SidebarContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggle: () => void;
  isMobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

function readStored(key: string, fallback: boolean): boolean {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    return stored === 'true';
  } catch {
    return fallback;
  }
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpenState] = useState(() => readStored(SIDEBAR_OPEN_KEY, true));
  const [isMobileOpen, setMobileOpenState] = useState(false);
  const [isLoading, setIsLoadingState] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_OPEN_KEY, String(isOpen));
    } catch {
      // ignore
    }
  }, [isOpen]);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoadingState(false), SIDEBAR_LOADING_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open);
  }, []);

  const toggle = useCallback(() => {
    setIsOpenState(prev => !prev);
  }, []);

  const setMobileOpen = useCallback((open: boolean) => {
    setMobileOpenState(open);
  }, []);

  const toggleMobile = useCallback(() => {
    setMobileOpenState(prev => !prev);
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setIsLoadingState(loading);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      toggle,
      isMobileOpen,
      setMobileOpen,
      toggleMobile,
      isLoading,
      setIsLoading,
    }),
    [
      isOpen,
      setIsOpen,
      toggle,
      isMobileOpen,
      setMobileOpen,
      toggleMobile,
      isLoading,
      setIsLoading,
    ],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error('useSidebar must be used within SidebarProvider');
  }
  return ctx;
}
