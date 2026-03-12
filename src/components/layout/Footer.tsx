import { useNavigate, useLocation } from 'react-router-dom';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';
import Logo from '../common/Logo';

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { label: 'Simulator', path: '/sandbox' },
      { label: 'Documentation', path: '/docs' },
      { label: 'Learn', path: '/academy' },
      { label: 'Community', path: '/community' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Getting Started', path: '/docs' },
      { label: 'Logic Gates', path: '/docs' },
      { label: 'IC Design', path: '/docs' },
      { label: 'Examples', path: '/community' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'GitHub', path: '#' },
      { label: 'Discord', path: '#' },
      { label: 'Twitter', path: '#' },
      { label: 'Blog', path: '#' },
    ],
  },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render footer on sandbox pages
  if (location.pathname.startsWith('/sandbox')) return null;

  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="section-container py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <Logo size={32} />
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--text-main)' }}
              >
                LogicLab
              </span>
            </div>
            <p
              className="text-sm max-w-sm"
              style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}
            >
              An open-source digital logic simulator for students, educators, and engineers. 
              Design, test, and share circuits in your browser.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[Github, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-full transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => {
                    (e.currentTarget.style as any).color = 'var(--text-main)';
                    (e.currentTarget.style as any).backgroundColor = 'var(--bg-hover)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget.style as any).color = 'var(--text-muted)';
                    (e.currentTarget.style as any).backgroundColor = 'transparent';
                  }}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map(group => (
            <div key={group.title} className="space-y-4">
              <h4
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
                {group.title}
              </h4>
              <nav className="flex flex-col gap-2.5">
                {group.links.map(link => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.path)}
                    className="text-left text-sm transition-colors"
                    style={{ color: 'var(--text-dim)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent-blue)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-dim)')}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 LogicLab. Open source digital logic education platform.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-dim)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Privacy
            </button>
            <button className="text-xs transition-colors" style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-dim)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              Terms
            </button>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              v1.0.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
