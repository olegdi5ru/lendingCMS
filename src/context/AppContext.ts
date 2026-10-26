import { createContext, useContext } from 'react';
import type { useAppStore } from '../store/useAppStore';

type AppStore = ReturnType<typeof useAppStore>;

export const AppContext = createContext<AppStore | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppContext.Provider');
  return ctx;
}
