import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PagesList } from './pages/PagesList';
import { PageEditor } from './pages/PageEditor';
import { Substitutions } from './pages/Substitutions';
import { Blocks } from './pages/Blocks';
import { Tenants } from './pages/Tenants';
import { SemanticSearch } from './pages/SemanticSearch';
import { AppContext } from './context/AppContext';

export default function App() {
  const store = useAppStore();

  return (
    <AppContext.Provider value={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pages" element={<PagesList />} />
            <Route path="pages/:id" element={<PageEditor />} />
            <Route path="substitutions" element={<Substitutions />} />
            <Route path="blocks" element={<Blocks />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="semantic" element={<SemanticSearch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
