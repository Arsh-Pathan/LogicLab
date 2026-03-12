import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, setShowAuthModal, setAuthView } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setAuthView('login');
      setShowAuthModal(true);
      navigate('/home', { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, setShowAuthModal, setAuthView]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: 'var(--bg-app)' }}>
        <div className="animate-spin w-8 h-8 border-2 rounded-full" style={{ borderColor: 'var(--border-subtle)', borderTopColor: 'var(--accent-blue)' }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <Outlet />;
}
