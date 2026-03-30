import { useNavigate } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';
import HeroVisual from '../features/landing/HeroVisual';
import InteractiveDemo from '../features/landing/InteractiveDemo';
import FeatureGrid from '../features/landing/FeatureGrid';
import BuildProgression from '../features/landing/BuildProgression';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-app)' }}>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, var(--border-subtle) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.4,
          }}
        />
        {/* Gradient fade overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, var(--bg-app) 100%)',
          }}
        />

        <div className="section-container relative z-10 w-full py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <div>
              <div className="mb-6">
                <span className="tag tag-blue">
                  Open Source
                </span>
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
                style={{
                  color: 'var(--text-main)',
                  lineHeight: '1.05',
                }}
              >
                Build Digital Logic{' '}
                <span className="text-gradient">Visually</span>
              </h1>

              <p
                className="text-lg md:text-xl mb-10 max-w-lg"
                style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}
              >
                LogicLab is an interactive digital logic simulator where students
                and engineers can design, test, and understand circuits directly
                in the browser.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/simulator')}
                  className="btn-primary"
                  style={{ padding: '14px 32px', fontSize: '15px' }}
                >
                  Open Simulator
                  <ArrowRight size={18} />
                </button>
                <a
                  href="https://github.com/Arsh-Pathan/LogicLab"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '14px 32px', fontSize: '15px' }}
                >
                  <Github size={18} />
                  View on GitHub
                </a>
              </div>

              {/* Interactive Mini Demo */}
              <div className="mt-12">
                <InteractiveDemo />
              </div>
            </div>

            {/* Right: Animated Visual */}
            <div className="hidden lg:flex items-center justify-center">
              <HeroVisual />
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 md:py-32">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              Everything you need
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              A complete environment for designing and understanding digital circuits.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>

      {/* ===== BUILD PROGRESSION SECTION ===== */}
      <section
        className="py-24 md:py-32"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="section-container">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              Build Anything From Gates
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              Start with basic logic gates and work your way up to full processors.
            </p>
          </div>
          <BuildProgression />
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 md:py-32">
        <div className="section-container">
          <div
            className="text-center max-w-2xl mx-auto rounded-2xl p-12 md:p-16"
            style={{
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              Start Building
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: 'var(--text-dim)' }}
            >
              No account required. Jump in and start designing circuits.
            </p>
            <button
              onClick={() => navigate('/simulator')}
              className="btn-primary"
              style={{ padding: '16px 40px', fontSize: '16px' }}
            >
              Open Simulator
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
