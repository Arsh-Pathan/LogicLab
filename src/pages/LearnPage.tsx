import { Play, Target, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MODULES = [
  {
    title: 'Basics of Boolean Logic',
    duration: '10 mins',
    desc: 'Learn about A, B, and the mathematical beauty of True and False.',
    lessons: ['The Binary Concept', 'Meet the Gates', 'Truth Tables 101'],
    status: 'available',
  },
  {
    title: 'Sequential Logic',
    duration: '25 mins',
    desc: 'Understanding time, clocks, and memory elements like Flip-Flops.',
    lessons: ['Tick Tock: The Oscillator', 'State Management', 'Building a 1-bit memory'],
    status: 'locked',
  },
  {
    title: 'Architecting ICs',
    duration: '45 mins',
    desc: 'Strategies for complex modular design and component packaging.',
    lessons: ['Abstraction Patterns', 'Interface Design', 'Testing Sub-grids'],
    status: 'locked',
  }
];

export default function LearnPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app text-main selection:bg-accent/10">
      <main className="max-w-6xl mx-auto px-6 lg:px-12 py-20 lg:py-32">
        <div className="flex flex-col md:flex-row gap-16 items-start">
          {/* Left Column: Context */}
          <div className="md:w-1/3 space-y-10 sticky top-32">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-accent font-bold text-[10px] uppercase tracking-widest">
                <GraduationCap size={14} /> Academic Track
              </div>
              <h1 className="text-5xl font-bold tracking-tight leading-[1.1]">The Art of Circuit Design.</h1>
              <p className="text-lg text-dim font-medium leading-relaxed">
                A curriculum designed to take you from foundational logic to advanced computer architecture.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-sidebar border border-border-main">
                <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-xs italic">1</div>
                <span className="text-sm font-bold">15 Active Modules</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-sidebar border border-border-main">
                <div className="w-8 h-8 rounded-full bg-dim/10 text-dim flex items-center justify-center font-bold text-xs italic">2</div>
                <span className="text-sm font-bold">Laboratory Access Provided</span>
              </div>
            </div>
            
            <button
               onClick={() => navigate('/home')}
               className="text-sm font-bold text-dim hover:text-main transition-colors flex items-center gap-2 group"
            >
              Return Home
            </button>
          </div>

          {/* Right Column: Curriculum */}
          <div className="flex-1 space-y-8">
            {MODULES.map((module, mIdx) => (
              <div 
                key={mIdx} 
                className={`p-10 rounded-[2.5rem] bg-sidebar border border-border-main transition-all duration-500 ${module.status === 'locked' ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-accent hover:shadow-2xl hover:shadow-accent/5'}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-accent">
                      <Target size={12} /> Module 0{mIdx + 1} • {module.duration}
                    </div>
                    <h3 className="text-3xl font-bold">{module.title}</h3>
                  </div>
                  {module.status === 'available' ? (
                    <button className="bg-main text-app px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all">
                      <Play size={16} fill="currentColor" /> Start Learning
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-dim text-xs font-bold uppercase tracking-widest">
                      Locked
                    </div>
                  )}
                </div>

                <p className="text-lg text-dim font-medium leading-relaxed mb-10 border-b border-border-main pb-10">
                  {module.desc}
                </p>

                <div className="space-y-4">
                  {module.lessons.map((lesson, lIdx) => (
                    <div key={lIdx} className="flex items-center justify-between group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <CheckCircle2 size={16} className="text-border-main group-hover:text-accent transition-colors" />
                          <span className="text-sm font-bold text-dim group-hover:text-main transition-colors">Lesson {lIdx + 1}: {lesson}</span>
                       </div>
                       <ChevronRight size={14} className="text-border-main opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
