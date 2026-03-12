import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Clock,
  Lock, ChevronRight, Play, ArrowRight,
  Zap, Star
} from 'lucide-react';

const CURRICULUM = [
  {
    level: 1,
    title: 'Digital Foundations',
    description: 'Start here — learn the basic building blocks of digital electronics.',
    color: 'var(--accent-blue)',
    bgColor: 'var(--accent-blue-light)',
    modules: [
      { id: 'binary-numbers', title: 'Binary Number System', duration: '15 min', description: 'Understand how computers represent data using only 0s and 1s. Learn to convert between binary, decimal, and hexadecimal.', status: 'available' },
      { id: 'logic-gates', title: 'Basic Logic Gates', duration: '20 min', description: 'Master AND, OR, and NOT gates — the fundamental operations of digital logic.', status: 'available' },
      { id: 'truth-tables', title: 'Truth Tables', duration: '15 min', description: 'Learn to create and read truth tables to describe gate behavior systematically.', status: 'available' },
      { id: 'boolean-algebra', title: 'Boolean Algebra', duration: '25 min', description: 'Simplify logic expressions using boolean algebra laws and identities.', status: 'available' },
    ],
  },
  {
    level: 2,
    title: 'Combinational Logic',
    description: 'Build stateless circuits that compute outputs directly from inputs.',
    color: 'var(--accent-green)',
    bgColor: 'var(--accent-green-light)',
    modules: [
      { id: 'compound-gates', title: 'NAND, NOR, XOR, XNOR', duration: '20 min', description: 'Explore compound gates and understand why NAND is called the universal gate.', status: 'available' },
      { id: 'adders', title: 'Adder Circuits', duration: '30 min', description: 'Design half adders and full adders — the foundation of all arithmetic operations.', status: 'available' },
      { id: 'multiplexers', title: 'Multiplexers & Decoders', duration: '25 min', description: 'Learn signal routing with MUX and DEMUX circuits for data selection.', status: 'available' },
      { id: 'comparators', title: 'Comparator Circuits', duration: '20 min', description: 'Build circuits that compare two binary values and indicate their relationship.', status: 'locked' },
    ],
  },
  {
    level: 3,
    title: 'Sequential Logic',
    description: 'Add memory and timing to your circuits with flip-flops and state machines.',
    color: 'var(--accent-purple)',
    bgColor: 'var(--accent-purple-light)',
    modules: [
      { id: 'latches', title: 'SR & D Latches', duration: '25 min', description: 'Understand how circuits can "remember" — the simplest memory elements.', status: 'locked' },
      { id: 'flip-flops', title: 'Flip-Flops', duration: '30 min', description: 'Master edge-triggered memory: D, JK, and T flip-flops for reliable storage.', status: 'locked' },
      { id: 'counters', title: 'Counter Circuits', duration: '30 min', description: 'Design binary counters using flip-flops — from simple ripple to synchronous.', status: 'locked' },
      { id: 'state-machines', title: 'Finite State Machines', duration: '35 min', description: 'Model complex behavior with Moore and Mealy state machines.', status: 'locked' },
    ],
  },
];

export default function LearnPage() {
  const navigate = useNavigate();
  const [expandedLevel, setExpandedLevel] = useState<number>(1);

  return (
    <div className="page-enter" style={{ backgroundColor: 'var(--bg-app)' }}>

      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-app) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="section-container py-12">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }}
            >
              <GraduationCap size={20} />
            </div>
            <h1
              className="text-3xl font-bold"
              style={{ color: 'var(--text-main)' }}
            >
              Learn Digital Logic
            </h1>
          </div>
          <p className="text-base max-w-xl" style={{ color: 'var(--text-dim)' }}>
            A structured curriculum to take you from zero to building complex digital circuits. 
            Each lesson includes theory, interactive examples, and hands-on exercises.
          </p>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                Your progress
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--accent-blue)' }}>
                0 / {CURRICULUM.reduce((acc, l) => acc + l.modules.length, 0)} lessons
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'var(--border-subtle)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: '0%',
                  background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="section-container page-content">
        <div className="max-w-4xl mx-auto space-y-8">
          {CURRICULUM.map((level) => (
            <div key={level.level} className="card overflow-hidden">
              {/* Level Header */}
              <button
                onClick={() => setExpandedLevel(expandedLevel === level.level ? 0 : level.level)}
                className="w-full p-6 flex items-center gap-5 text-left transition-colors"
                style={{
                  backgroundColor: expandedLevel === level.level ? level.bgColor : 'transparent',
                }}
              >
                {/* Level Badge */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg font-bold shadow-sm"
                  style={{
                    backgroundColor: level.level <= 1 ? level.color : 'var(--bg-app)',
                    color: level.level <= 1 ? '#fff' : level.color,
                    border: level.level > 1 ? `1px solid ${level.color}` : 'none'
                  }}
                >
                  {level.level}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold" style={{ color: 'var(--text-main)' }}>
                      Level {level.level}: {level.title}
                    </h2>
                    <span
                      className="tag"
                      style={{
                        backgroundColor: level.bgColor,
                        color: level.color,
                        fontSize: '11px',
                        padding: '2px 8px',
                      }}
                    >
                      {level.modules.length} modules
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-dim)' }}>
                    {level.description}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  style={{
                    color: 'var(--text-muted)',
                    transform: expandedLevel === level.level ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {/* Modules */}
              {expandedLevel === level.level && (
                <div style={{ borderTop: '1px solid var(--border-subtle)' }} className="divide-y divide-[var(--border-subtle)]">
                  {level.modules.map((module) => (
                    <div
                      key={module.id}
                      className="p-6 transition-colors"
                      style={{ opacity: module.status === 'locked' ? 0.6 : 1 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-1"
                            style={{
                              backgroundColor: module.status === 'locked' ? 'var(--bg-surface)' : level.bgColor,
                              color: module.status === 'locked' ? 'var(--text-muted)' : level.color,
                            }}
                          >
                            {module.status === 'locked' ? <Lock size={16} /> : <Play size={16} fill="currentColor" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-base" style={{ color: 'var(--text-main)' }}>{module.title}</h3>
                              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                                <Clock size={12} />
                                {module.duration}
                              </div>
                            </div>
                            <p className="text-sm mt-1 max-w-xl" style={{ color: 'var(--text-dim)' }}>
                              {module.description}
                            </p>
                            
                            {/* Practical Highlight */}
                            {module.status !== 'locked' && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                <span className="tag tag-blue text-[10px] py-0.5 px-2">Interactive Lab</span>
                                <span className="tag tag-green text-[10px] py-0.5 px-2">Practical Challenge</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="shrink-0">
                          {module.status === 'locked' ? (
                            <button className="btn-secondary opacity-50 cursor-not-allowed text-xs py-2 px-4">
                              Locked
                            </button>
                          ) : (
                            <button 
                              onClick={() => navigate('/sandbox')}
                              className="btn-primary text-xs py-2 px-6 shadow-sm hover:shadow-md"
                              style={{ backgroundColor: level.color }}
                            >
                              Launch Lab
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Practical Challenge Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="flex items-center gap-3 mb-6">
            <Zap size={24} style={{ color: 'var(--accent-yellow)' }} />
            <h2 className="text-2xl font-bold">Practical Challenges</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card border-l-4 border-l-[var(--accent-blue)]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Binary Math</span>
                <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-600">Intermediate</span>
              </div>
              <h3 className="font-bold mb-2">Build a 4-bit Ripple Carry Adder</h3>
              <p className="text-sm mb-6 text-dim">Using only Full Adders and basic gates, create a circuit that adds two 4-bit numbers.</p>
              <button 
                onClick={() => navigate('/sandbox')}
                className="w-full btn-secondary text-xs"
              >
                Start Challenge
              </button>
            </div>

            <div className="card border-l-4 border-l-[var(--accent-purple)]">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">Memory</span>
                <span className="text-xs font-medium px-2 py-1 rounded bg-purple-50 text-purple-600">Advanced</span>
              </div>
              <h3 className="font-bold mb-2">Design an 8-bit Register</h3>
              <p className="text-sm mb-6 text-dim">Create a persistent 8-bit storage unit using D-Flip Flops with a common Load enable signal.</p>
              <button 
                onClick={() => navigate('/sandbox')}
                className="w-full btn-secondary text-xs"
              >
                Start Challenge
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-16">
          <div
            className="card p-10 text-center"
            style={{
              background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-app) 100%)',
              border: '1px solid var(--border-main)',
            }}
          >
            <Star size={32} className="mx-auto mb-4" style={{ color: 'var(--accent-yellow)' }} />
            <h3
              className="text-2xl font-bold mb-3"
              style={{ color: 'var(--text-main)' }}
            >
              Certified Logic Designer?
            </h3>
            <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: 'var(--text-dim)' }}>
              Complete all interactive labs and challenges to unlock advanced IC design tools and community leaderboards.
            </p>
            <button
              onClick={() => navigate('/sandbox')}
              className="btn-primary"
              style={{ padding: '14px 32px' }}
            >
              Enter the Simulator
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
