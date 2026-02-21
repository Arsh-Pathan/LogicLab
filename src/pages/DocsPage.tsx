import { Book, Cpu, Zap, Info, ArrowRight, Layers, Layout, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const GATES = [
  { name: 'AND Gate', icon: <Zap size={18} />, desc: 'Output is high ONLY if all inputs are high.', logic: 'Y = A · B' },
  { name: 'OR Gate', icon: <Cpu size={18} />, desc: 'Output is high if AT LEAST ONE input is high.', logic: 'Y = A + B' },
  { name: 'NOT Gate', icon: <Info size={18} />, desc: 'Inverts the incoming signal.', logic: 'Y = Ā' },
  { name: 'XOR Gate', icon: <Layers size={18} />, desc: 'Output is high if inputs are DIFFERENT.', logic: 'Y = A ⊕ B' },
  { name: 'NAND Gate', icon: <Zap size={18} />, desc: 'Inverted AND. High unless all inputs are high.', logic: 'Y = ¬(A · B)' },
  { name: 'NOR Gate', icon: <Cpu size={18} />, desc: 'Inverted OR. High only if all inputs are low.', logic: 'Y = ¬(A + B)' },
];

export default function DocsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app text-main">
      {/* Side Navigation */}
      <div className="fixed top-0 left-0 bottom-0 w-72 bg-sidebar border-r border-border-main p-8 overflow-y-auto hidden lg:block">
        <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => navigate('/home')}>
           <Logo size={24} />
           <span className="text-lg font-bold">Documentation</span>
        </div>

        <nav className="space-y-12">
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-dim mb-6">Introduction</h4>
            <div className="space-y-4">
               <button className="flex items-center gap-3 text-sm font-bold text-main">Getting Started</button>
               <button className="flex items-center gap-3 text-sm font-semibold text-dim hover:text-main">Installation</button>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-dim mb-6">Simulation Engine</h4>
            <div className="space-y-4">
               <button className="flex items-center gap-3 text-sm font-semibold text-dim hover:text-main">Signal Flow</button>
               <button className="flex items-center gap-3 text-sm font-semibold text-dim hover:text-main">Oscillators (Clock)</button>
               <button className="flex items-center gap-3 text-sm font-semibold text-dim hover:text-main">Propagation Delay</button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <main className="lg:pl-72 max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest mb-6">
            <Book size={14} /> Library / Primitives
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight mb-8">Logic Gate Encyclopedia</h1>
          <p className="text-xl text-dim font-medium leading-relaxed mb-16">
            Explore the fundamental building blocks of digital computation. Every gate in LogicLab is built on high-precision deterministic logic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {GATES.map((gate, i) => (
              <div key={i} className="p-8 rounded-2xl bg-sidebar border border-border-main hover:border-accent transition-all group">
                <div className="w-10 h-10 rounded-xl bg-app border border-border-main flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-app transition-all">
                  {gate.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{gate.name}</h3>
                <p className="text-sm text-dim font-medium leading-relaxed mb-6">{gate.desc}</p>
                <div className="p-3 bg-app rounded-xl border border-border-main text-xs font-mono font-bold text-accent text-center tracking-widest">
                  {gate.logic}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20 border-t border-border-main">
            <h2 className="text-3xl font-bold mb-6">Advanced Components</h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Half-Adder', icon: <Layout />, desc: 'Computes sum and carry-out for two binary digits.' },
                { name: 'Clock Source', icon: <Clock />, desc: 'Periodic square-wave generator for sequential logic.' },
                { name: 'Integrated Circuit (IC)', icon: <Layers />, desc: 'Custom abstraction of complex sub-grids into a single gate.' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-border-main bg-sidebar hover:bg-app transition-colors cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="text-dim group-hover:text-accent">{c.icon}</div>
                    <div>
                      <h4 className="font-bold text-main">{c.name}</h4>
                      <p className="text-xs text-dim font-medium">{c.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-border-main group-hover:text-accent translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
