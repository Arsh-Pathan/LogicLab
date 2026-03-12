import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, Menu, X, Sun, Moon,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import Logo from '../common/Logo';
import UserMenu from '../../features/auth/components/UserMenu';

const NAV_LINKS = [
  { label: 'Docs', path: '/docs' },
  { label: 'Learn', path: '/academy' },
  { label: 'Community', path: '/community' },
  { label: 'Simulator', path: '/sandbox' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useUIStore((s: any) => s.theme);
  const toggleTheme = useUIStore((s: any) => s.toggleTheme);
  const { isAuthenticated, setShowAuthModal, setAuthView } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Don't render navbar on sandbox/workspace pages
  if (location.pathname.startsWith('/sandbox')) return null;

  const handleSignIn = () => {
    setAuthView('login');
    setShowAuthModal(true);
  };

  return (
    <>
      <nav
        className="sticky top-0 z-[100] border-b"
        style={{
          height: 'var(--nav-height)',
          backgroundColor: 'var(--bg-app)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="section-container h-full flex items-center justify-between">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => navigate('/home')}
            >
              <Logo size={28} />
              <span
                className="text-lg font-bold hidden sm:block"
                style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}
              >
                LogicLab
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors relative"
                  style={{
                    color: isActive(link.path) ? 'var(--accent-blue)' : 'var(--text-dim)',
                    backgroundColor: isActive(link.path) ? 'var(--accent-blue-light)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive(link.path)) {
                      (e.target as HTMLElement).style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.path)) {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </button>
              ))}
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors relative"
                  style={{
                    color: isActive('/dashboard') ? 'var(--accent-blue)' : 'var(--text-dim)',
                    backgroundColor: isActive('/dashboard') ? 'var(--accent-blue-light)' : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!isActive('/dashboard')) {
                      (e.target as HTMLElement).style.backgroundColor = 'var(--bg-hover)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive('/dashboard')) {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Right: Search, Theme, Auth */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full transition-colors"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Search size={20} />
            </button>

            {isAuthenticated ? (
              /* Authenticated: UserMenu (includes theme toggle) */
              <UserMenu />
            ) : (
              /* Not authenticated: Theme toggle + Sign In + CTA */
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: 'var(--text-dim)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <button
                  onClick={handleSignIn}
                  className="hidden sm:flex px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Sign In
                </button>

                <button
                  onClick={() => navigate('/sandbox')}
                  className="btn-primary hidden sm:flex ml-1"
                  style={{ padding: '8px 20px', fontSize: '13px' }}
                >
                  Open Simulator
                </button>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-full lg:hidden transition-colors"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar (expandable) */}
        {searchOpen && (
          <div
            className="absolute top-full left-0 right-0 border-b p-4"
            style={{
              backgroundColor: 'var(--bg-app)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            <div className="section-container">
              <div className="relative max-w-xl">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="text"
                  placeholder="Search documentation, circuits, tutorials..."
                  className="input-field pl-12"
                  autoFocus
                  onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[99] lg:hidden"
          style={{ top: 'var(--nav-height)' }}
        >
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="relative w-72 h-full shadow-xl p-6 space-y-2"
            style={{ backgroundColor: 'var(--bg-app)' }}
          >
            {NAV_LINKS.map(link => (
              <button
                key={link.path}
                onClick={() => { navigate(link.path); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive(link.path) ? 'var(--accent-blue)' : 'var(--text-main)',
                  backgroundColor: isActive(link.path) ? 'var(--accent-blue-light)' : 'transparent',
                }}
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { navigate('/dashboard'); setMobileOpen(false); }}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive('/dashboard') ? 'var(--accent-blue)' : 'var(--text-main)',
                  backgroundColor: isActive('/dashboard') ? 'var(--accent-blue-light)' : 'transparent',
                }}
              >
                Dashboard
              </button>
            )}
            <div className="pt-4 space-y-2">
              {!isAuthenticated && (
                <button
                  onClick={() => { handleSignIn(); setMobileOpen(false); }}
                  className="w-full text-center px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => { navigate('/sandbox'); setMobileOpen(false); }}
                className="btn-primary w-full justify-center"
              >
                Open Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
