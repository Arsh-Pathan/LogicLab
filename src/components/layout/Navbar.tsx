import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Github } from 'lucide-react';
import Logo from '../common/Logo';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Simulator', path: '/simulator' },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  // Don't render navbar on simulator pages
  if (location.pathname.startsWith('/simulator')) return null;

  return (
    <>
      <nav
        className="sticky top-0 z-[100] border-b"
        style={{
          height: 'var(--nav-height)',
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="section-container h-full flex items-center justify-between">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => navigate('/')}
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
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    color: isActive(link.path) ? 'var(--text-main)' : 'var(--text-dim)',
                  }}
                  onMouseEnter={e => {
                    if (!isActive(link.path)) {
                      (e.target as HTMLElement).style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive(link.path)) {
                      (e.target as HTMLElement).style.color = 'var(--text-dim)';
                    }
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: GitHub + CTA */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Arsh-Pathan/LogicLab"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full transition-colors hidden sm:flex"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-main)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              <Github size={20} />
            </a>

            <button
              onClick={() => navigate('/simulator')}
              className="btn-primary hidden sm:flex"
              style={{ padding: '8px 20px', fontSize: '13px' }}
            >
              Open Simulator
            </button>

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
            <div className="pt-4 space-y-2">
              <a
                href="https://github.com/Arsh-Pathan/LogicLab"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors block"
                style={{ color: 'var(--text-main)' }}
              >
                GitHub
              </a>
              <button
                onClick={() => { navigate('/simulator'); setMobileOpen(false); }}
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
