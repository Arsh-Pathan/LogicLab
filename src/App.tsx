import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';
import DashboardPage from './pages/DashboardPage';
import CommunityPage from './pages/CommunityPage';
import DocsPage from './pages/DocsPage';
import LearnPage from './pages/LearnPage';
import NotFoundPage from './pages/NotFoundPage';
import MobileWarning from './pages/MobileWarning';

import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthModal from './features/auth/components/AuthModal';
import MigrationPromptModal from './features/auth/components/MigrationPromptModal';

import { useKeyboard } from './hooks/useKeyboard';
import { useUIStore } from './store/uiStore';
import { useAuthStore } from './store/authStore';

export default function App() {
  const theme = useUIStore((s: any) => s.theme);
  const [isMobile, setIsMobile] = useState(false);
  const initialize = useAuthStore((s) => s.initialize);

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

  // Mobile Detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Index Redirect */}
          <Route index element={<Navigate to="/home" replace />} />

          {/* Main Routes */}
          <Route path="home" element={isMobile ? <MobileWarning /> : <HomePage />} />
          <Route path="docs" element={<DocsPage />} />
          <Route path="academy" element={<LearnPage />} />
          <Route path="community" element={<CommunityPage />} />

          {/* Simulator — public (anonymous gets localStorage) */}
          <Route path="sandbox" element={isMobile ? <MobileWarning /> : <WorkspacePage />} />
          <Route path="sandbox/:projectId" element={isMobile ? <MobileWarning /> : <WorkspacePage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          {/* Catch-All */}
          <Route path="mobile-warning" element={<MobileWarning />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      {/* Global modals */}
      <AuthModal />
      <MigrationPromptModal />
    </BrowserRouter>
  );
}
