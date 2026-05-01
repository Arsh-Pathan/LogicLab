import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Github, Users, Download, Star, Cpu, Zap, CircuitBoard, Globe, GraduationCap, Layers } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroVisual from '../features/landing/HeroVisual';
import Hero3DLazy from '../features/landing/Hero3DLazy';
import InteractiveDemo from '../features/landing/InteractiveDemo';
import FeatureGrid from '../features/landing/FeatureGrid';
import BuildProgression from '../features/landing/BuildProgression';
import WireAnimation from '../features/landing/WireAnimation';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const progressionRef = useRef<HTMLDivElement>(null);
  const useCasesRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      gsap.from('.hero-badge', { opacity: 0, y: 20, duration: 0.6, delay: 0.1 });
      gsap.from('.hero-title', { opacity: 0, y: 30, duration: 0.8, delay: 0.2 });
      gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, delay: 0.4 });
      gsap.from('.hero-cta', { opacity: 0, y: 20, duration: 0.6, delay: 0.5 });
      gsap.from('.hero-demo', { opacity: 0, y: 20, duration: 0.6, delay: 0.6 });
      gsap.from('.hero-visual', { opacity: 0, x: 40, duration: 0.8, delay: 0.3 });

      // Stats counter animation
      gsap.from('.stat-item', {
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
      });

      // Features section
      gsap.from('.features-heading', {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6,
      });
      gsap.from('.feature-card', {
        scrollTrigger: { trigger: featuresRef.current, start: 'top 75%' },
        opacity: 0, y: 40, stagger: 0.12, duration: 0.6,
      });

      // How it Works
      gsap.from('.how-heading', {
        scrollTrigger: { trigger: howItWorksRef.current, start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6,
      });
      gsap.from('.how-step', {
        scrollTrigger: { trigger: howItWorksRef.current, start: 'top 75%' },
        opacity: 0, y: 40, stagger: 0.15, duration: 0.6,
      });

      // Build Progression
      gsap.from('.progression-heading', {
        scrollTrigger: { trigger: progressionRef.current, start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6,
      });

      // Use cases
      gsap.from('.usecase-heading', {
        scrollTrigger: { trigger: useCasesRef.current, start: 'top 80%' },
        opacity: 0, y: 30, duration: 0.6,
      });
      gsap.from('.usecase-card', {
        scrollTrigger: { trigger: useCasesRef.current, start: 'top 75%' },
        opacity: 0, y: 40, stagger: 0.12, duration: 0.6,
      });

      // CTA
      gsap.from('.cta-content', {
        scrollTrigger: { trigger: ctaRef.current, start: 'top 80%' },
        opacity: 0, scale: 0.95, duration: 0.7,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-app)' }}>

      {/* ===== HERO SECTION ===== */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Dotted grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, var(--border-subtle) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.4,
          }}
        />
        {/* Top-edge aurora glow — premium feel */}
        <div
          className="absolute inset-x-0 top-0 h-[520px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 70% 30%, rgba(167,139,250,0.18), transparent 60%), radial-gradient(ellipse 50% 60% at 30% 20%, rgba(34,211,238,0.18), transparent 60%)',
            filter: 'blur(20px)',
          }}
        />
        {/* Bottom fade into page */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, var(--bg-app) 100%)',
          }}
        />

        <div className="section-container relative z-10 w-full py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="hero-badge mb-6">
                <span className="tag tag-blue">
                  Open Source
                </span>
              </div>

              <h1
                className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-main)',
                  lineHeight: '1.05',
                }}
              >
                Build Digital Logic{' '}
                <span className="text-gradient">Visually</span>
              </h1>

              <p
                className="hero-subtitle text-lg md:text-xl mb-10 max-w-lg"
                style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}
              >
                LogicLab is an interactive digital logic simulator where students
                and engineers design, test, and understand circuits directly
                in the browser. No installs. No setup. Just logic.
              </p>

              <div className="hero-cta flex flex-wrap gap-4">
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

              <div className="hero-demo mt-12">
                <InteractiveDemo />
              </div>
            </div>

            <div className="hero-visual hidden lg:block relative">
              {/* Premium 3D PCB (loads after first paint, falls back to 2D on small devices) */}
              <div className="hidden md:block">
                <Hero3DLazy />
              </div>
              {/* Mobile / reduced-motion fallback */}
              <div className="md:hidden flex items-center justify-center">
                <HeroVisual />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WIRE DECORATION ===== */}
      <WireAnimation />

      {/* ===== STATS / SOCIAL PROOF ===== */}
      <section ref={statsRef} className="py-16 md:py-20" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <Users size={24} />, value: '10K+', label: 'Users', color: 'var(--accent-blue)' },
              { icon: <CircuitBoard size={24} />, value: '50K+', label: 'Circuits Built', color: 'var(--accent-green)' },
              { icon: <Star size={24} />, value: '100%', label: 'Free & Open Source', color: 'var(--accent-yellow)' },
              { icon: <Download size={24} />, value: '0', label: 'Installs Required', color: 'var(--accent-purple)' },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-item text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                  style={{ backgroundColor: stat.color + '18', color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                >
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-dim)' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section ref={featuresRef} className="py-24 md:py-32">
        <div className="section-container">
          <div className="features-heading text-center mb-16">
            <span className="tag tag-purple mb-4 inline-block">Features</span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
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

      {/* ===== HOW IT WORKS ===== */}
      <section
        ref={howItWorksRef}
        className="py-24 md:py-32"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="section-container">
          <div className="how-heading text-center mb-16">
            <span className="tag tag-green mb-4 inline-block">How It Works</span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Three steps to your first circuit
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              Get from zero to a working digital circuit in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Drag & Drop Gates',
                description: 'Pick from AND, OR, NOT, XOR, flip-flops, muxes, and more. Drop them onto the infinite canvas.',
                icon: <Layers size={28} />,
                color: 'var(--accent-blue)',
              },
              {
                step: '02',
                title: 'Connect Wires',
                description: 'Click output ports and drag to input ports. Wires route automatically with clean bezier curves.',
                icon: <Zap size={28} />,
                color: 'var(--accent-green)',
              },
              {
                step: '03',
                title: 'Simulate & Learn',
                description: 'Toggle inputs and watch signals propagate in real time. See truth tables come alive.',
                icon: <Cpu size={28} />,
                color: 'var(--accent-purple)',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="how-step relative rounded-xl p-8 text-center"
                style={{
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div
                  className="text-xs font-mono font-bold mb-4"
                  style={{ color: item.color }}
                >
                  STEP {item.step}
                </div>
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                  style={{ backgroundColor: item.color + '18', color: item.color }}
                >
                  {item.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WIRE DECORATION ===== */}
      <WireAnimation />

      {/* ===== BUILD PROGRESSION SECTION ===== */}
      <section ref={progressionRef} className="py-24 md:py-32">
        <div className="section-container">
          <div className="progression-heading text-center mb-16">
            <span className="tag tag-yellow mb-4 inline-block">Build Path</span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
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

      {/* ===== USE CASES ===== */}
      <section
        ref={useCasesRef}
        className="py-24 md:py-32"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="section-container">
          <div className="usecase-heading text-center mb-16">
            <span className="tag tag-blue mb-4 inline-block">Use Cases</span>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Built for everyone
            </h2>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              Whether you're learning, teaching, or designing — LogicLab adapts to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <GraduationCap size={28} />,
                title: 'Students',
                description: 'Visualize concepts from your digital logic course. Build adders, ALUs, and state machines hands-on instead of just reading about them.',
                color: 'var(--accent-blue)',
              },
              {
                icon: <Users size={28} />,
                title: 'Educators',
                description: 'Create interactive demos for your lectures. Share circuit links with students and let them experiment in real-time.',
                color: 'var(--accent-green)',
              },
              {
                icon: <Cpu size={28} />,
                title: 'Engineers',
                description: 'Quickly prototype and verify logic before committing to HDL. Test edge cases with the built-in simulation engine.',
                color: 'var(--accent-purple)',
              },
            ].map((useCase, i) => (
              <div
                key={i}
                className="usecase-card rounded-xl p-8"
                style={{
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5"
                  style={{ backgroundColor: useCase.color + '18', color: useCase.color }}
                >
                  {useCase.icon}
                </div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                >
                  {useCase.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OPEN SOURCE SECTION ===== */}
      <section className="py-24 md:py-32">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}
            >
              <Globe size={32} />
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Open Source, Free Forever
            </h2>
            <p
              className="text-lg mb-8 max-w-xl mx-auto"
              style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}
            >
              LogicLab is MIT-licensed and community-driven. Contribute features,
              report bugs, or just star the repo to show your support.
            </p>
            <a
              href="https://github.com/Arsh-Pathan/LogicLab"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex"
              style={{ padding: '14px 32px', fontSize: '15px' }}
            >
              <Github size={18} />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ===== WIRE DECORATION ===== */}
      <WireAnimation />

      {/* ===== CTA SECTION ===== */}
      <section ref={ctaRef} className="py-24 md:py-32" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="section-container">
          <div
            className="cta-content text-center max-w-2xl mx-auto rounded-2xl p-12 md:p-16"
            style={{
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
            }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Ready to Start Building?
            </h2>
            <p
              className="text-lg mb-8"
              style={{ color: 'var(--text-dim)' }}
            >
              No account required. Jump straight into the simulator and bring your circuits to life.
            </p>
            <button
              onClick={() => navigate('/simulator')}
              className="btn-primary"
              style={{ padding: '16px 40px', fontSize: '16px' }}
            >
              Launch Simulator
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
