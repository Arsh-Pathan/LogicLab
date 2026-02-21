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

const CATEGORIES = [
  {
    title: 'Introduction',
    items: ['Getting Started', 'Installation', 'Architecture']
  },
  {
    title: 'Simulation Engine',
    items: ['Signal Flow', 'Oscillators (Clock)', 'Propagation Delay', 'Gate Determinism']
  },
  {
    title: 'Component Library',
    items: ['Basic Gates', 'Advanced Components', 'Integrated Circuits', 'Custom Chips']
  }
];

export default function DocsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app text-main pb-32">
      {/* Side Navigation */}
      <div className="fixed top-0 left-0 bottom-0 w-72 bg-sidebar border-r border-border-main p-8 overflow-y-auto hidden lg:block">
        <div className="flex items-center gap-3 mb-12 cursor-pointer" onClick={() => navigate('/home')}>
           <Logo size={24} />
           <span className="text-lg font-bold">Documentation</span>
        </div>

        <nav className="space-y-12">
          {CATEGORIES.map((cat, i) => (
            <div key={i}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-dim mb-6">{cat.title}</h4>
              <div className="space-y-4">
                 {cat.items.map((item, j) => (
                    <button key={j} className={`flex items-center gap-3 text-sm font-semibold transition-colors ${i === 2 && j === 0 ? 'text-main font-bold' : 'text-dim hover:text-main'}`}>
                        {item}
                    </button>
                 ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="lg:pl-72 max-w-7xl mx-auto px-8 py-16 lg:py-24">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest mb-6">
            <Book size={14} /> Library / Primitives
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-8">Logic Gate Encyclopedia</h1>
          <p className="text-xl text-dim font-medium leading-relaxed mb-16">
            Explore the fundamental building blocks of digital computation. Every gate in LogicLab is built on high-precision deterministic logic.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
            {GATES.map((gate, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-sidebar border border-border-main hover:border-accent transition-all group">
                <div className="w-10 h-10 rounded-2xl bg-app border border-border-main flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-app transition-all">
                  {gate.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{gate.name}</h3>
                <p className="text-sm text-dim font-medium leading-relaxed mb-6">{gate.desc}</p>
                <div className="p-4 bg-app rounded-2xl border border-border-main text-[10px] font-mono font-bold text-accent text-center tracking-[0.2em]">
                  {gate.logic}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-20 border-t border-border-main">
            <h2 className="text-3xl font-bold mb-4">Advanced Components</h2>
            <p className="text-dim mb-10 font-medium">Beyond simple gates, LogicLab provides high-level primitives for complex architectural design.</p>
            
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Half-Adder', icon: <Layout />, desc: 'Computes sum and carry-out for two binary digits. The basis of all arithmetic logic units.' },
                { name: 'Clock Source', icon: <Clock />, desc: 'Periodic square-wave generator. Essential for synchronous systems and flip-flops.' },
                { name: 'Integrated Circuit (IC)', icon: <Layers />, desc: 'A revolutionary feature: recursively pack any sub-circuit into a single re-usable node.' },
                { name: 'Multiplexer (MUX)', icon: <Cpu />, desc: 'Selects one of many input signals and forwards it to a single output line.' },
                { name: 'Flip-Flop (D-Type)', icon: <Zap />, desc: 'A fundamental storage element that captures the value of the D-input at a definite portion of the clock cycle.' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-8 rounded-[2rem] border border-border-main bg-sidebar hover:bg-app transition-all cursor-pointer group hover:shadow-xl hover:shadow-black/5">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-app flex items-center justify-center text-dim group-hover:text-accent transition-colors border border-border-main">
                        {c.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-main">{c.name}</h4>
                      <p className="text-xs text-dim font-medium max-w-sm">{c.desc}</p>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-border-strong group-hover:text-accent translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-32 p-12 rounded-[3rem] bg-accent/5 border border-accent/10 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-4">Mathematical Foundations</h2>
                    <p className="text-dim font-medium leading-relaxed mb-8 max-w-lg">
                        Our engine uses a discrete event-based simulation model. This ensures that every signal propagation is deterministic and free from race conditions.
                    </p>
                    <button className="flex items-center gap-2 text-accent font-bold text-sm hover:gap-4 transition-all">
                        Read the technical whitepaper <ArrowRight size={16} />
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-[0.03] blur-3xl -translate-y-1/2 translate-x-1/2" />
          </div>
        </div>
      </main>
    </div>
  );
}
