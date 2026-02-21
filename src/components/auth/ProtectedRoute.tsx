import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

/**
 * A wrapper component that redirects to home and opens auth modal if not authenticated.
 */
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, initialized } = useAuthStore();
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // We can't easily open the modal and redirect simultaneously without a splash screen or state
    // So we redirect to home and the user has to click sign in, or we can use a simpler approach.
    setTimeout(() => setShowAuthModal(true), 0);
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
