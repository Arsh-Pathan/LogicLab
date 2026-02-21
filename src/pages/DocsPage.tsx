import { useState, useEffect, useRef } from 'react';
import {
  Search,
  Book,
  Cpu,
  Zap,
  Layers,
  Code2,
  ArrowRight,
  Terminal,
  Box
} from 'lucide-react';
import { gsap } from 'gsap';

const CATEGORIES = [
  {
    title: 'Foundations',
    id: 'foundations',
    icon: <Book className="w-4 h-4" />,
    items: [
      { id: 'philosophy', title: 'The LogicLab Philosophy', desc: 'Understanding the deterministic engine behind our simulations.', content: 'LogicLab is built on the principle of absolute determinism. Every signal propagation is computed with nanosecond precision, ensuring that asynchronous hazards and race conditions in your circuits behave exactly as they would on silicon.' },
      { id: 'binary', title: 'Pure Binary Systems', desc: 'The mathematical bedrock of digital computation.', content: 'Beyond 0 and 1, we simulate high-impedance (Z) and undefined (X) states to accurately model tri-state buffers and uninitialized memory components.' },
      { id: 'signal', title: 'Signal Propagation', desc: 'How voltage levels and state transitions work in LogicLab.', content: 'Our Discrete Event Simulator (DES) handles millions of signal transitions per second, allowing for real-time visualization of complex wave propagation across massive grids.' }
    ]
  },
  {
    title: 'Simulation Core',
    id: 'core',
    icon: <Cpu className="w-4 h-4" />,
    items: [
      { id: 'oscillator', title: 'Synchronous Clocking', desc: 'Timing analysis and oscillator stability in complex circuits.', content: 'Clock stability is paramount. We implement jitter-aware oscillators that can be tuned from 0.1Hz to 1MHz for deep timing analysis.' },
      { id: 'delay', title: 'Propagation Latency', desc: 'Simulating real-world physical constraints in gate switching.', content: 'Every logic gate in our library includes configurable propagation delays. Transitioning from AND to NAND logic introduces measurable latency, enabling the study of critical paths.' },
      { id: 'bus', title: 'Bus Architecture', desc: 'Handling multi-bit data paths and tri-state logic.', content: 'Design wide data paths using our multi-bit bus components. Built-in parity checking and error detection modules allow for robust architecture design.' }
    ]
  },
  {
    title: 'Advanced Hardware',
    id: 'advanced',
    icon: <Layers className="w-4 h-4" />,
    items: [
      { id: 'alu', title: 'Arithmetic Logic Units', desc: 'Implementing complex math via cascading full adders.', content: 'Build high-performance ALUs that support standard operations (ADD, SUB, AND, OR) along with custom micro-op instructions.' },
      { id: 'ram', title: 'Memory Hierarchies', desc: 'From flip-flops to high-density static RAM modules.', content: 'LogicLab provides optimized SRAM primitives. Design multi-level caches and register files with concurrent read/write access.' },
      { id: 'instruction', title: 'Instruction Set Design', desc: 'Creating custom control units for programmable chips.', content: 'Define your own ISA. Build control units that decode opcodes and drive execution stages with single-cycle precision.' }
    ]
  },
  {
    title: 'The Future',
    id: 'future',
    icon: <Zap className="w-4 h-4" />,
    items: [
      { id: 'quantum', title: 'Quantum Logic Gates', desc: 'Theoretical implementation of Qubits and Superposition.', content: 'Explore the foundations of quantum compute. Simulate Hadamard and CNOT gates within a classical logic framework for educational exploration.' },
      { id: 'neural', title: 'Neuromorphic Hardware', desc: 'Simulating neural nodes using analog-inspired digital logic.', content: 'Build spiking neural networks using standard logic gates. Our engine supports Leaky-Integrate-and-Fire models for digital neuromorphic research.' }
    ]
  }
];

export default function DocsPage() {
  const [activeItem, setActiveItem] = useState(CATEGORIES[0].items[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const pageRef = useRef(null);
  const contentBodyRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.docs-header', {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: 'power4.out'
      });
      
      gsap.from('.sidebar-item', {
        x: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2
      });

      gsap.from('.content-section', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        delay: 0.4
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (contentBodyRef.current) {
      gsap.fromTo(contentBodyRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, [activeItem]);

  const filteredCategories = CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-app transition-colors duration-500 pb-24" ref={pageRef}>
      {/* Search Header */}
      <div className="docs-header pt-32 pb-16 border-b border-border-main">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-main flex items-center justify-center rounded-sm shadow-premium">
                <Code2 className="w-8 h-8 text-app" />
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">The Academy</h1>
            </div>
            
            <div className="relative max-w-2xl mt-4">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-dim opacity-40" />
              <input 
                type="text"
                placeholder="search the foundations of logic..."
                className="premium-input pl-16 py-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-24">
          {/* Sidebar */}
          <aside className="flex flex-col gap-12 sticky top-32 h-fit">
            {filteredCategories.map((cat) => (
              <div key={cat.id} className="sidebar-item flex flex-col gap-5">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-dim opacity-50">
                  {cat.icon}
                  {cat.title}
                </div>
                <div className="flex flex-col gap-1">
                  {cat.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveItem(item)}
                      className={`
                        text-left py-3 px-6 rounded-sm text-sm font-bold transition-all
                        ${activeItem.id === item.id 
                          ? 'bg-main text-app shadow-premium translate-x-2' 
                          : 'text-dim hover:text-main hover:bg-neutral-100'}
                      `}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex flex-col gap-20 content-section" ref={contentBodyRef}>
            <section className="flex flex-col gap-12">
              <div className="flex flex-col gap-8">
                <div className="px-5 py-2 rounded-full border border-border-main self-start text-[10px] font-black uppercase tracking-[0.2em] text-accent opacity-60">
                  Section: {activeItem.id}
                </div>
                <h2 className="text-7xl font-black tracking-tighter max-w-4xl leading-[0.85] uppercase">
                  {activeItem.title}
                </h2>
                <div className="w-32 h-2 bg-main"></div>
                <p className="text-3xl text-dim max-w-3xl leading-snug font-medium tracking-tight">
                  {activeItem.desc}
                </p>
              </div>

              <div className="glass-card p-16 prose prose-xl max-w-none prose-invert border-none">
                 <p className="text-xl leading-relaxed font-medium text-main">
                   {activeItem.content}
                 </p>
                 
                 <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="flex flex-col gap-6 p-10 border border-border-main rounded-sm group hover:border-main transition-all cursor-pointer">
                      <Terminal className="w-8 h-8 text-dim group-hover:text-main transition-colors" />
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Implementation Guide</h4>
                      <p className="text-sm text-dim leading-relaxed">
                        Detailed specifications for system designers and verification engineers.
                      </p>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                   </div>
                   <div className="flex flex-col gap-6 p-10 border border-border-main rounded-sm group hover:border-main transition-all cursor-pointer">
                      <Box className="w-8 h-8 text-dim group-hover:text-main transition-colors" />
                      <h4 className="text-2xl font-black uppercase tracking-tighter">Primitive Library</h4>
                      <p className="text-sm text-dim leading-relaxed">
                        Master the standard logic gates and their mathematical truth tables.
                      </p>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                   </div>
                 </div>
              </div>

              <div className="p-16 bg-main text-app rounded-sm relative overflow-hidden shadow-2xl flex flex-col gap-12 mt-12">
                <Layers className="absolute -right-24 -bottom-24 w-96 h-96 opacity-5 rotate-12" />
                <div className="flex flex-col gap-6 relative z-10 max-w-2xl">
                  <h3 className="text-5xl font-black leading-none tracking-tighter uppercase italic">
                    Unlock <br />Advanced Lab Features
                  </h3>
                  <p className="opacity-60 text-lg leading-relaxed font-medium">
                    Integrated circuitry, cloud collaborative verification, and 
                    high-density memory simulation. Sign in to access your private lab.
                  </p>
                  <button className="self-start px-12 py-5 bg-app text-main font-black uppercase tracking-[0.25em] text-xs hover:invert transition-all">
                    Register Scholar Access
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
