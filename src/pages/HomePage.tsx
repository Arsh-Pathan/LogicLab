import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import Logo from '../components/common/Logo';
import {
  ChevronRight,
  Cpu,
  Layers,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const setShowAuthModal = useUIStore((s) => s.setShowAuthModal);

  return (
    <div className="min-h-screen bg-app text-main selection:bg-accent/20">
      {/* Sophisticated Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-app/80 backdrop-blur-md border-b border-border-main">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size={32} />
            <span className="text-sm font-bold tracking-tight">LogicLab</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <button onClick={() => navigate('/docs')} className="text-sm text-dim hover:text-main font-medium transition-colors">Documentation</button>
            <button onClick={() => navigate('/learn')} className="text-sm text-dim hover:text-main font-medium transition-colors">Learn</button>
            <button onClick={() => navigate('/community')} className="text-sm text-dim hover:text-main font-medium transition-colors">Community</button>
          </div>

          <div className="flex items-center gap-6">
            {!isAuthenticated ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm font-semibold text-main hover:opacity-70 transition-opacity"
              >
                Sign In
              </button>
            ) : (
              <button 
                onClick={() => navigate('/dashboard')}
                className="text-sm font-semibold text-main flex items-center gap-2 group"
              >
                Go to Dashboard
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
            <button
               onClick={() => navigate('/sandbox')}
               className="bg-main text-app px-6 py-2.5 rounded-full text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-40 pb-32">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          {/* Anthropic-style Hero Section */}
          <div className="max-w-3xl mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/10 text-accent font-bold text-[10px] uppercase tracking-widest mb-10">
              V5.0 Digital Simulation Engine
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] mb-10">
              Computational logic, <span className="text-dim/40 italic">refined.</span>
            </h1>
            
            <p className="text-xl text-dim font-medium leading-relaxed mb-12 max-w-2xl">
              A high-precision digital logic laboratory designed for engineers and researchers. Build, simulate, and package complex circuitry with mathematical accuracy.
            </p>

            <div className="flex items-center gap-6">
               <button
                 onClick={() => navigate('/sandbox')}
                 className="bg-main text-app px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-xl transition-all active:scale-[0.98]"
               >
                 Launch Experiment
               </button>
               <button
                 onClick={() => navigate('/docs')}
                 className="flex items-center gap-2 text-main font-bold text-lg hover:opacity-60 transition-opacity group"
               >
                 View Specifications
                 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>

          {/* Institutional Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-border-main">
            {[
              { icon: <Cpu className="text-accent" />, title: 'Deterministic Flow', desc: 'Real-time signal propagation with infinite recursion depth for nested ICs.' },
              { icon: <Layers className="text-accent" />, title: 'Component Modularization', desc: 'Transform entire circuits into single-gate abstractions for high-level design.' },
              { icon: <BookOpen className="text-accent" />, title: 'Academic Library', desc: 'Comprehensive documentation on Boolean algebra and gate primitives.' },
            ].map((f, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-sidebar border border-border-main flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="text-sm text-dim leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-border-main bg-sidebar py-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-xs space-y-6">
            <div className="flex items-center gap-3">
              <Logo size={24} />
              <span className="text-lg font-bold">LogicLab</span>
            </div>
            <p className="text-xs text-dim leading-relaxed font-medium">
              Developing the future of digital logic simulation with an emphasis on clarity, performance, and institutional security.
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-dim">Product</h4>
              <nav className="flex flex-col gap-2 text-sm font-medium text-dim">
                <button onClick={() => navigate('/sandbox')} className="hover:text-main text-left">Sandbox</button>
                <button onClick={() => navigate('/community')} className="hover:text-main text-left">Community</button>
                <button onClick={() => navigate('/docs')} className="hover:text-main text-left">Lab Specs</button>
              </nav>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-dim">Community</h4>
              <nav className="flex flex-col gap-2 text-sm font-medium text-dim">
                <button onClick={() => navigate('/dashboard')} className="hover:text-main text-left">Dashboard</button>
                <button className="hover:text-main text-left opacity-30 cursor-not-allowed">Cloud Hub</button>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
