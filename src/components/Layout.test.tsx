import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useAppStore } from '../store/useAppStore';
import { Layout } from './Layout';
import type { ReactNode } from 'react';

function TestWrapper({ children }: { children: ReactNode }) {
  const store = useAppStore();
  return (
    <AppContext.Provider value={store}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </AppContext.Provider>
  );
}

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <TestWrapper>
      {ui}
    </TestWrapper>
  );
}

describe('Layout Component', () => {
  it('should render sidebar with navigation', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByText('Landing Engine')).toBeInTheDocument();
    expect(screen.getByText('v4.0')).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByText('Дашборд')).toBeInTheDocument();
    expect(screen.getByText('Страницы')).toBeInTheDocument();
    expect(screen.getByText('Подмены')).toBeInTheDocument();
    expect(screen.getByText('UI-блоки')).toBeInTheDocument();
    expect(screen.getByText('Тенанты')).toBeInTheDocument();
    expect(screen.getByText('Семантика')).toBeInTheDocument();
  });

  it('should display active tenant name', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByText('ЗдравКлиника')).toBeInTheDocument();
  });

  it('should display tenant domain', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByText('zdravclinic.ru')).toBeInTheDocument();
  });

  it('should show database status indicator', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByText('PostgreSQL 16 + pgvector')).toBeInTheDocument();
  });
});
