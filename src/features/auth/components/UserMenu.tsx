import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useUIStore } from '../../../store/uiStore';

export default function UserMenu() {
  const navigate = useNavigate();
  const { profile, user, signOut } = useAuthStore();
  const theme = useUIStore((s: any) => s.theme);
  const toggleTheme = useUIStore((s: any) => s.toggleTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url;
  const initials = displayName.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors"
        style={{ color: 'var(--text-main)' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: 'var(--accent-blue)',
              color: '#fff',
            }}
          >
            {initials}
          </div>
        )}
        <span className="text-sm font-medium hidden md:block max-w-[120px] truncate">
          {displayName}
        </span>
        <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-lg shadow-lg overflow-hidden z-50"
          style={{
            backgroundColor: 'var(--bg-app)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {/* User info */}
          <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>
              {displayName}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-dim)' }}>
              {user?.email}
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={() => { navigate('/dashboard'); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--text-main)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LayoutDashboard size={16} style={{ color: 'var(--text-dim)' }} />
              Dashboard
            </button>

            <button
              onClick={() => { toggleTheme(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--text-main)' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {theme === 'dark' ? (
                <Sun size={16} style={{ color: 'var(--text-dim)' }} />
              ) : (
                <Moon size={16} style={{ color: 'var(--text-dim)' }} />
              )}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
              style={{ color: '#ef4444' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
