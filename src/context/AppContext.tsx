import { createContext, useContext, type ReactNode } from 'react';
import type { Tenant, Page, SubstitutionTable, UIBlock } from '../types';

interface AppStore {
  tenants: Tenant[];
  pages: Page[];
  substitutions: SubstitutionTable[];
  blocks: UIBlock[];
  activeTenantId: string;
  activeTenant: Tenant;
  tenantPages: Page[];
  tenantSubstitutions: SubstitutionTable[];
  setActiveTenantId: (id: string) => void;
  updatePage: (id: string, updates: Partial<Page>) => void;
  addPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubstitution: (id: string, updates: Partial<SubstitutionTable>) => void;
  addSubstitution: (sub: Omit<SubstitutionTable, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const AppContext = createContext<AppStore | null>(null);

export function useApp(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppContext.Provider');
  }
  return ctx;
}
