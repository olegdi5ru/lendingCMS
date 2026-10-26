import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../store/useAppStore';

describe('useAppStore', () => {
  describe('Initial state', () => {
    it('should have demo tenants', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.tenants).toHaveLength(3);
      expect(result.current.tenants[0].id).toBe('family_zdravclinic');
    });

    it('should have demo pages', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.pages.length).toBeGreaterThan(0);
    });

    it('should have demo substitutions', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.substitutions.length).toBeGreaterThan(0);
    });

    it('should have demo UI blocks', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.blocks).toHaveLength(5);
    });

    it('should set first tenant as active by default', () => {
      const { result } = renderHook(() => useAppStore());

      expect(result.current.activeTenantId).toBe('family_zdravclinic');
      expect(result.current.activeTenant.name).toBe('ЗдравКлиника');
    });
  });

  describe('Tenant management', () => {
    it('should switch active tenant', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.setActiveTenantId('edu_online_school');
      });

      expect(result.current.activeTenantId).toBe('edu_online_school');
      expect(result.current.activeTenant.name).toBe('Онлайн Школа');
    });

    it('should filter pages by active tenant', () => {
      const { result } = renderHook(() => useAppStore());

      const firstTenantPages = result.current.tenantPages;

      act(() => {
        result.current.setActiveTenantId('edu_online_school');
      });

      const secondTenantPages = result.current.tenantPages;

      expect(firstTenantPages).not.toEqual(secondTenantPages);
      expect(firstTenantPages.every(p => p.tenantId === 'family_zdravclinic')).toBe(true);
      expect(secondTenantPages.every(p => p.tenantId === 'edu_online_school')).toBe(true);
    });

    it('should filter substitutions by active tenant', () => {
      const { result } = renderHook(() => useAppStore());

      const firstTenantSubs = result.current.tenantSubstitutions;

      act(() => {
        result.current.setActiveTenantId('edu_online_school');
      });

      const secondTenantSubs = result.current.tenantSubstitutions;

      expect(firstTenantSubs).not.toEqual(secondTenantSubs);
      expect(firstTenantSubs.every(s => s.tenantId === 'family_zdravclinic')).toBe(true);
    });
  });

  describe('Page management', () => {
    it('should update page content', () => {
      const { result } = renderHook(() => useAppStore());
      const pageId = result.current.tenantPages[0].id;

      act(() => {
        result.current.updatePage(pageId, { title: 'Updated Title' });
      });

      const updatedPage = result.current.pages.find(p => p.id === pageId);
      expect(updatedPage?.title).toBe('Updated Title');
    });

    it('should update page updatedAt timestamp', () => {
      const { result } = renderHook(() => useAppStore());
      const pageId = result.current.tenantPages[0].id;
      const originalUpdatedAt = result.current.tenantPages[0].updatedAt;

      act(() => {
        result.current.updatePage(pageId, { title: 'Updated' });
      });

      const updatedPage = result.current.pages.find(p => p.id === pageId);
      expect(updatedPage?.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('should add new page', () => {
      const { result } = renderHook(() => useAppStore());
      const initialCount = result.current.pages.length;

      act(() => {
        result.current.addPage({
          tenantId: 'family_zdravclinic',
          slug: 'new-page',
          title: 'New Page',
          content: '# New',
          metadata: { description: 'New page' },
          status: 'draft',
          version: 1,
        });
      });

      expect(result.current.pages.length).toBe(initialCount + 1);
      const newPage = result.current.pages.find(p => p.slug === 'new-page');
      expect(newPage).toBeDefined();
      expect(newPage?.title).toBe('New Page');
    });

    it('should generate unique IDs for new pages', () => {
      const { result } = renderHook(() => useAppStore());

      act(() => {
        result.current.addPage({
          tenantId: 'family_zdravclinic',
          slug: 'page-a',
          title: 'Page A',
          content: '',
          metadata: { description: '' },
          status: 'draft',
          version: 1,
        });
      });

      act(() => {
        result.current.addPage({
          tenantId: 'family_zdravclinic',
          slug: 'page-b',
          title: 'Page B',
          content: '',
          metadata: { description: '' },
          status: 'draft',
          version: 1,
        });
      });

      const pageA = result.current.pages.find(p => p.slug === 'page-a');
      const pageB = result.current.pages.find(p => p.slug === 'page-b');
      expect(pageA?.id).not.toBe(pageB?.id);
    });
  });

  describe('Substitution management', () => {
    it('should update substitution table', () => {
      const { result } = renderHook(() => useAppStore());
      const subId = result.current.tenantSubstitutions[0].id;

      act(() => {
        result.current.updateSubstitution(subId, {
          data: { h1: 'New H1', cta: 'New CTA' },
        });
      });

      const updated = result.current.substitutions.find(s => s.id === subId);
      expect(updated?.data.h1).toBe('New H1');
    });

    it('should add new substitution table', () => {
      const { result } = renderHook(() => useAppStore());
      const initialCount = result.current.substitutions.length;

      act(() => {
        result.current.addSubstitution({
          tenantId: 'family_zdravclinic',
          name: 'new_table',
          data: { h1: 'Test' },
        });
      });

      expect(result.current.substitutions.length).toBe(initialCount + 1);
      const newSub = result.current.substitutions.find(s => s.name === 'new_table');
      expect(newSub).toBeDefined();
    });
  });
});
