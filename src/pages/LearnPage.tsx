import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Zap, 
  ArrowRight,
  Target,
  FlaskConical,
  BrainCircuit,
  Binary,
  Lock,
  Play,
  CheckCircle2,
  Clock,
  BookOpen
} from 'lucide-react';
import { gsap } from 'gsap';

const MODULES = [
  {
    title: 'Silicon Foundations',
    id: 'silicon',
    duration: '45 mins',
    difficulty: 'Introductory',
    desc: 'The genesis of digital logic. Mastery of transistors, logic gates, and the electrical properties of binary signals.',
    lessons: [
      { title: 'Transistor Switching', time: '10m', type: 'Theory' },
      { title: 'Gate Truth Tables', time: '15m', type: 'Lab' },
      { title: 'NAND Minimization', time: '10m', type: 'Quiz' },
      { title: 'Propagation Delay Theory', time: '10m', type: 'Theory' }
    ],
    status: 'available',
    icon: <Binary className="w-6 h-6" />
  },
  {
    title: 'Combinational Systems',
    id: 'combinational',
    duration: '1.5 hours',
    difficulty: 'Core',
    desc: 'Synthesizing complex behavior from primitives. Building multiplexers, encoders, and multi-bit arithmetic units.',
    lessons: [
      { title: 'Karnaugh Map Mastery', time: '20m', type: 'Theory' },
      { title: 'Adders & Subtractors', time: '30m', type: 'Lab' },
      { title: 'The Magnitude Comparator', time: '20m', type: 'Theory' },
      { title: 'Building a 4-bit ALU', time: '20m', type: 'Final' }
    ],
    status: 'available',
    icon: <Target className="w-6 h-6" />
  },
  {
    title: 'Sequential Logic',
    id: 'sequential',
    duration: '2 hours',
    difficulty: 'Advanced',
    desc: 'Introducing time and memory. Understanding flip-flops, synchronous counters, and state-machine architecture.',
    lessons: [
      { title: 'SR vs JK Latches', time: '25m', type: 'Theory' },
      { title: 'Edge-Triggered Theory', time: '35m', type: 'Lab' },
      { title: 'Synchronous Counters', time: '30m', type: 'Lab' },
      { title: 'The Finite State Machine', time: '30m', type: 'Final' }
    ],
    status: 'locked',
    icon: <Zap className="w-6 h-6" />
  },
  {
    title: 'Computer Architecture',
    id: 'arch',
    duration: '4 hours',
    difficulty: 'Professional',
    desc: 'The ultimate synthesis. Combining memory, processing, and control logic into a Turing-complete machine.',
    lessons: [
      { title: 'Von Neumann Bottleneck', time: '40m', type: 'Theory' },
      { title: 'Instruction Set Design', time: '60m', type: 'Lab' },
      { title: 'The Register File', time: '60m', type: 'Lab' },
      { title: 'Building an 8-bit CPU', time: '80m', type: 'Final' }
    ],
    status: 'locked',
    icon: <FlaskConical className="w-6 h-6" />
  }
];

export default function LearnPage() {
  const [activeModule, setActiveModule] = useState(0);
  const containerRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1
      });

      gsap.from('.module-card', {
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.4
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (previewRef.current) {
      gsap.fromTo(previewRef.current,
        { opacity: 0, scale: 0.98, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }
      );
    }
  }, [activeModule]);

  return (
    <div className="min-h-screen bg-app transition-colors duration-500 pb-32" ref={containerRef}>
       {/* Hero Section */}
       <div className="pt-40 pb-24 border-b border-border-main overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col gap-8 max-w-4xl">
              <div className="hero-reveal flex items-center gap-5">
                 <div className="w-16 h-16 bg-main flex items-center justify-center rounded-sm shadow-premium hover:rotate-12 transition-transform duration-500">
                    <Trophy className="w-8 h-8 text-app" />
                 </div>
                 <h1 className="text-7xl font-black uppercase tracking-tighter leading-none">The Academy</h1>
              </div>
              <p className="hero-reveal text-4xl font-black text-dim leading-none tracking-tighter uppercase max-w-3xl">
                Master logic from <br />
                <span className="text-main italic">silicon to neural systems.</span>
              </p>
              <div className="hero-reveal flex gap-8 items-center mt-4">
                 <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dim">152 Active Research Papers</span>
                 </div>
                 <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 opacity-40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dim">3-Stage Certification</span>
                 </div>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 text-[500px] font-black italic text-main opacity-[0.015] translate-x-1/4 -translate-y-1/4 select-none pointer-events-none">
            01
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
             {/* Module List */}
             <div className="lg:col-span-7 flex flex-col gap-10">
                <div className="flex justify-between items-end border-b border-border-main pb-8">
                   <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-dim opacity-50 italic">Curriculum Flow</h2>
                   <span className="text-[10px] font-black uppercase tracking-widest text-main">Phase 01: Silicon Primitives</span>
                </div>
                
                {MODULES.map((mod, i) => (
                   <div 
                      key={i}
                      onClick={() => mod.status !== 'locked' && setActiveModule(i)}
                      className={`
                        module-card group p-12 border border-transparent transition-all relative overflow-hidden rounded-sm
                        ${mod.status === 'locked' ? 'opacity-30 grayscale cursor-not-allowed' : 'cursor-pointer hover:border-main'}
                        ${activeModule === i ? 'bg-main text-app !opacity-100 shadow-float translate-x-4 border-main' : 'bg-transparent'}
                      `}
                   >
                      <div className="flex justify-between items-start mb-8 relative z-10">
                         <div className={`w-16 h-16 flex items-center justify-center rounded-sm transition-all duration-700 shadow-premium
                            ${activeModule === i ? 'bg-app text-main' : 'bg-main text-app group-hover:scale-110'}`}>
                           {mod.icon}
                         </div>
                         <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                               <Clock className="w-3 h-3 opacity-40" />
                               <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{mod.duration}</span>
                            </div>
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest
                               ${activeModule === i ? 'bg-white/10 text-white' : 'bg-neutral-100 text-main'}`}>
                               {mod.difficulty}
                            </span>
                         </div>
                      </div>

                      <div className="relative z-10">
                         <h3 className="text-4xl font-black tracking-tighter mb-4 uppercase leading-none">{mod.title}</h3>
                         <p className={`text-lg leading-relaxed font-medium mb-10 max-w-xl transition-colors duration-500
                            ${activeModule === i ? 'text-white/60' : 'text-dim'}`}>
                           {mod.desc}
                         </p>
                      </div>

                      {mod.status === 'locked' ? (
                         <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-40">
                            <Lock className="w-4 h-4" /> prerequisite required
                         </div>
                      ) : (
                         <div className="flex items-center gap-6">
                            <button className={`flex items-center gap-4 px-10 py-4 font-black uppercase text-[10px] tracking-[0.25em] transition-all
                               ${activeModule === i ? 'bg-app text-main hover:invert' : 'bg-main text-app hover:invert'}`}>
                               Begin Phase <Play className="w-3 h-3 fill-current" />
                            </button>
                         </div>
                      )}
                   </div>
                ))}
             </div>

             {/* Preview/Active Panel */}
             <div className="lg:col-span-5 relative">
                <div className="lg:sticky lg:top-32 h-fit" ref={previewRef}>
                   <div className="glass-card p-16 flex flex-col gap-12 border-main border-2">
                      <div className="flex flex-col gap-6">
                         <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-main animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-dim opacity-50">Active Exploration</span>
                         </div>
                         <h2 className="text-5xl font-black tracking-tighter leading-[0.85] uppercase">
                           {MODULES[activeModule].title}
                         </h2>
                         <div className="w-24 h-2 bg-main"></div>
                      </div>

                      <div className="space-y-10">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-dim border-b border-border-main pb-4">Lab Syllabus Content</h4>
                         <div className="flex flex-col gap-2">
                            {MODULES[activeModule].lessons.map((lesson, j) => (
                               <div 
                                 key={j} 
                                 className="group flex items-center justify-between p-8 bg-app hover:bg-neutral-50 border-b border-border-main transition-all cursor-pointer"
                               >
                                  <div className="flex items-center gap-10">
                                     <span className="text-3xl font-black text-dim italic opacity-10 group-hover:opacity-40 transition-opacity">0{j+1}</span>
                                     <div className="flex flex-col gap-1">
                                        <span className="text-xl font-black tracking-tighter uppercase">{lesson.title}</span>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-dim opacity-50">{lesson.type} • {lesson.time}</span>
                                     </div>
                                   </div>
                                   <div className="w-10 h-10 rounded-full border border-border-main flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                                      <ArrowRight className="w-4 h-4" />
                                   </div>
                               </div>
                            ))}
                         </div>
                      </div>

                      <div className="p-12 bg-main text-app rounded-sm relative overflow-hidden shadow-2xl mt-8">
                         <Binary className="absolute -right-16 -bottom-16 w-60 h-60 opacity-10 rotate-12" />
                         <div className="relative z-10">
                           <h4 className="text-2xl font-black uppercase tracking-tighter mb-4">Scholars Resources</h4>
                           <p className="opacity-60 text-sm leading-relaxed mb-10 font-medium italic">
                             Automated verification labs, VHDL hardware handbooks, and industrial-grade primitive kits.
                           </p>
                           <button className="w-full py-5 bg-app text-main font-black uppercase tracking-[0.3em] text-[10px] hover:invert transition-all">
                              Download Phase Assets
                           </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
}
