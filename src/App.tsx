import { useEffect, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import LoadingScreen from './components/common/LoadingScreen';
import AuthModal from './features/auth/components/AuthModal';

import { useKeyboard } from './hooks/useKeyboard';
import { useUIStore } from './store/uiStore';
import { useAuthStore } from './store/authStore';
import { useCircuitStore } from './store/circuitStore';

// Lazy load pages — keeps Three.js/GSAP out of the main bundle
const HomePage = lazy(() => import('./pages/HomePage'));
const WorkspacePage = lazy(() => import('./pages/WorkspacePage'));
const MobileWarning = lazy(() => import('./pages/MobileWarning'));

export default function App() {
  const theme = useUIStore((s: any) => s.theme);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialize = useAuthStore((s) => s.initialize);
  const initWasmEngine = useCircuitStore((s) => s.initWasmEngine);

  // Initialize keyboard shortcuts
  useKeyboard();

  // Initialize auth + WASM engine
  useEffect(() => {
    initialize().then();
    initWasmEngine();
  }, [initialize, initWasmEngine]);

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
      <AuthModal />
      <Suspense fallback={null}>
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
      </Suspense>
    </BrowserRouter>
  );
}
