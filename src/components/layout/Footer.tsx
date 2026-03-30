import { useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';
import Logo from '../common/Logo';

export default function Footer() {
  const location = useLocation();

  // Don't render footer on simulator pages
  if (location.pathname.startsWith('/simulator')) return null;

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="section-container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Logo size={24} />
            <span
              className="text-base font-bold"
              style={{ color: 'var(--text-main)' }}
            >
              LogicLab
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Arsh-Pathan/LogicLab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm transition-colors"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-main)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              <Github size={16} />
              GitHub
            </a>
            <a
              href="https://github.com/Arsh-Pathan/LogicLab/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors"
              style={{ color: 'var(--text-dim)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-main)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
            >
              MIT License
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-8 pt-6 border-t text-center"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Built for learning digital logic. Open source, free forever.
          </p>
        </div>
      </div>
    </footer>
  );
}
