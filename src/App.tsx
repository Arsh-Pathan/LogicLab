import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from './pages/HomePage';
import WorkspacePage from './pages/WorkspacePage';
import MobileWarning from './pages/MobileWarning';

import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/common/LoadingScreen';

import { useKeyboard } from './hooks/useKeyboard';
import { useUIStore } from './store/uiStore';

export default function App() {
  const theme = useUIStore((s: any) => s.theme);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize keyboard shortcuts
  useKeyboard();

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

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={isMobile ? <MobileWarning /> : <HomePage />} />
          <Route path="simulator" element={isMobile ? <MobileWarning /> : <WorkspacePage />} />
          <Route path="simulator/:projectId" element={isMobile ? <MobileWarning /> : <WorkspacePage />} />
          {/* Legacy redirects */}
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="sandbox" element={<Navigate to="/simulator" replace />} />
          <Route path="sandbox/:projectId" element={<Navigate to="/simulator" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
