import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Cpu, BookOpen, Zap,
  CircuitBoard, Binary, Activity, Globe, ChevronRight
} from 'lucide-react';

const FEATURES = [
  {
    icon: <CircuitBoard size={24} />,
    title: 'Visual Circuit Design',
    description: 'Drag-and-drop logic gates onto an infinite canvas. Connect, simulate, and verify your designs in real-time.',
    color: 'var(--accent-blue)',
    bgColor: 'var(--accent-blue-light)',
  },
  {
    icon: <Cpu size={24} />,
    title: 'Custom IC Packaging',
    description: 'Encapsulate sub-circuits into reusable integrated circuits. Build complex hierarchical designs with ease.',
    color: 'var(--accent-green)',
    bgColor: 'var(--accent-green-light)',
  },
  {
    icon: <Activity size={24} />,
    title: 'Real-Time Simulation',
    description: 'Watch signals propagate through your circuits instantly. Toggle inputs and observe outputs change live.',
    color: 'var(--accent-purple)',
    bgColor: 'var(--accent-purple-light)',
  },
  {
    icon: <Globe size={24} />,
    title: 'Share & Collaborate',
    description: 'Publish your circuits to the community gallery. Browse, fork, and learn from designs created by others.',
    color: 'var(--accent-yellow)',
    bgColor: 'var(--accent-yellow-light)',
  },
];

const GATE_TYPES = [
  { name: 'AND', desc: 'Outputs 1 only when all inputs are 1', color: 'var(--accent-blue)' },
  { name: 'OR', desc: 'Outputs 1 when any input is 1', color: 'var(--accent-purple)' },
  { name: 'NOT', desc: 'Inverts the input signal', color: 'var(--accent-red)' },
  { name: 'NAND', desc: 'Inverted AND — universal gate', color: 'var(--accent-green)' },
  { name: 'XOR', desc: 'Outputs 1 when inputs differ', color: 'var(--accent-yellow)' },
  { name: 'NOR', desc: 'Inverted OR operation', color: 'var(--accent-red)' },
];

const LEARN_PATH = [
  { step: '01', title: 'Learn the basics', desc: 'Understand binary, logic gates, and truth tables through interactive lessons.' },
  { step: '02', title: 'Build circuits', desc: 'Apply your knowledge by constructing real circuits in the visual simulator.' },
  { step: '03', title: 'Create ICs', desc: 'Package your circuits into reusable integrated circuits for complex designs.' },
  { step: '04', title: 'Share & teach', desc: 'Publish your creations and contribute to the learning community.' },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-app)' }}>

      {/* ===== HERO SECTION ===== */}
      <section
        className="relative overflow-hidden min-h-[80vh] flex items-center"
        style={{
          background: 'linear-gradient(180deg, var(--bg-app) 0%, var(--bg-surface) 100%)',
        }}
      >
        {/* Animated Circuit Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.2]">
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--accent-blue)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity="0" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            {/* Horizontal Wires */}
            <path d="M -100 100 H 400 V 300 H 1200" fill="none" stroke="var(--border-main)" strokeWidth="1.5" />
            <path d="M 1500 200 H 1100 V 500 H 200" fill="none" stroke="var(--border-main)" strokeWidth="1.5" />
            <path d="M -100 600 H 600 V 400 H 1600" fill="none" stroke="var(--border-main)" strokeWidth="1.5" />
            
            {/* Pulse Group 1 */}
            <circle r="3" fill="var(--accent-blue)" filter="url(#glow)">
              <animateMotion
                dur="8s"
                repeatCount="indefinite"
                path="M -100 100 H 400 V 300 H 1200"
              />
            </circle>

            {/* Pulse Group 2 */}
            <circle r="3" fill="var(--accent-purple)" filter="url(#glow)">
              <animateMotion
                dur="10s"
                begin="2s"
                repeatCount="indefinite"
                path="M 1500 200 H 1100 V 500 H 200"
              />
            </circle>

            {/* Pulse Group 3 */}
            <circle r="3" fill="var(--accent-green)" filter="url(#glow)">
              <animateMotion
                dur="12s"
                begin="4s"
                repeatCount="indefinite"
                path="M -100 600 H 600 V 400 H 1600"
              />
            </circle>

            {/* Junctions */}
            <circle cx="400" cy="100" r="4" fill="var(--bg-app)" stroke="var(--border-main)" strokeWidth="2" />
            <circle cx="400" cy="300" r="4" fill="var(--bg-app)" stroke="var(--border-main)" strokeWidth="2" />
            <circle cx="1100" cy="200" r="4" fill="var(--bg-app)" stroke="var(--border-main)" strokeWidth="2" />
            <circle cx="1100" cy="500" r="4" fill="var(--bg-app)" stroke="var(--border-main)" strokeWidth="2" />
            <circle cx="600" cy="600" r="4" fill="var(--bg-app)" stroke="var(--border-main)" strokeWidth="2" />
            <circle cx="600" cy="400" r="4" fill="var(--bg-app)" stroke="var(--border-main)" strokeWidth="2" />
          </svg>
        </div>

        <div className="section-container relative z-10 w-full py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="mb-6">
              <span
                className="tag tag-blue"
              >
                <Zap size={14} />
                Open Source Digital Logic Simulator
              </span>
            </div>

            <h1
              className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight"
              style={{
                color: 'var(--text-main)',
                lineHeight: '1',
              }}
            >
              Build the future of 
              <span className="text-gradient block"> logic design.</span>
            </h1>

            <p
              className="text-xl md:text-2xl mb-12 max-w-2xl font-medium"
              style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}
            >
              The most advanced, browser-based digital logic platform. 
              Built for students, tailored for engineers, shared by the community.
            </p>

            <div className="flex flex-wrap gap-5">
              <button
                onClick={() => navigate('/sandbox')}
                className="btn-primary"
                style={{ padding: '16px 36px', fontSize: '16px' }}
              >
                Launch Simulator
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="btn-secondary"
                style={{ padding: '16px 36px', fontSize: '16px' }}
              >
                Documentation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              Everything you need to learn digital logic
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              A complete environment for designing, simulating, and understanding digital circuits — right in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="card card-interactive p-8"
                style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: feature.bgColor, color: feature.color }}
                >
                  {feature.icon}
                </div>
                <div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--text-main)' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GATE REFERENCE SECTION ===== */}
      <section
        className="py-20 md:py-28"
        style={{ backgroundColor: 'var(--bg-surface)' }}
      >
        <div className="section-container">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
              <span className="tag tag-green mb-4">
                <Binary size={14} />
                Gate Reference
              </span>
              <h2
                className="text-3xl font-bold mb-4"
                style={{ color: 'var(--text-main)' }}
              >
                Fundamental logic gates
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-dim)', lineHeight: '1.7' }}>
                LogicLab supports all standard digital logic gates. Each gate simulates 
                real-world signal behavior with accurate propagation.
              </p>
              <button
                onClick={() => navigate('/docs')}
                className="btn-secondary"
              >
                View full reference
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GATE_TYPES.map((gate, i) => (
                <div
                  key={i}
                  className="card p-5"
                >
                  <div
                    className="text-xl font-bold font-mono mb-2"
                    style={{ color: gate.color }}
                  >
                    {gate.name}
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-dim)', lineHeight: '1.5' }}>
                    {gate.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LEARNING PATH ===== */}
      <section className="py-20 md:py-28">
        <div className="section-container">
          <div className="text-center mb-16">
            <span className="tag tag-purple mb-4">
              <BookOpen size={14} />
              Learning Path
            </span>
            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-main)' }}
            >
              From zero to circuit designer
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-dim)' }}>
              Follow our structured curriculum to master digital logic design, step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEARN_PATH.map((item, i) => (
              <div key={i} className="card p-6 relative">
                <div
                  className="text-4xl font-extrabold mb-4"
                  style={{ color: 'var(--accent-blue)', opacity: 0.15 }}
                >
                  {item.step}
                </div>
                <h3
                  className="text-base font-semibold mb-2"
                  style={{ color: 'var(--text-main)' }}
                >
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
                  {item.desc}
                </p>
                {i < LEARN_PATH.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 z-10">
                    <ChevronRight size={20} style={{ color: 'var(--border-main)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section
        className="py-20 md:py-28"
        style={{
          backgroundColor: 'var(--accent-blue)',
          color: '#fff',
        }}
      >
        <div className="section-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#fff' }}>
            Ready to build your first circuit?
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ opacity: 0.85 }}>
            Jump into the simulator and start designing. No account required to get started.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/sandbox')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all"
              style={{
                backgroundColor: '#fff',
                color: 'var(--accent-blue)',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Open Simulator
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/academy')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)')}
            >
              Start Learning
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
