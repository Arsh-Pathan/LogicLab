import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';
import DashboardPage from './pages/DashboardPage';
import CommunityPage from './pages/CommunityPage';
import DocsPage from './pages/DocsPage';
import LearnPage from './pages/LearnPage';
import MainLayout from './layouts/MainLayout';
import AuthModal from './features/auth/components/AuthModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/common/LoadingScreen';

import { useKeyboard } from './hooks/useKeyboard';
import { useUIStore } from './store/uiStore';
import { useAuthStore } from './store/authStore';

export default function App() {
  const theme = useUIStore((s: any) => s.theme);
  const initialize = useAuthStore((s) => s.initialize);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize keyboard shortcuts
  useKeyboard();

  // Initialize auth
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Sync theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      {/* Global Auth Modal */}
      <AuthModal />

      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/learn" element={<LearnPage />} />
          <Route path="/community" element={<CommunityPage />} />
          
          <Route path="/sandbox" element={
            <ProtectedRoute>
              <WorkspacePage />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
