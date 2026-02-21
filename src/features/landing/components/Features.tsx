import { Activity, Cpu, Layers, Dna, ArrowUpRight } from 'lucide-react';

interface FeaturesProps {
  onEnter: () => void;
}

export default function Features({ onEnter }: FeaturesProps) {
  return (
    <section className="py-64 px-8 lg:px-16 max-w-8xl mx-auto bento-grid">
      <div className="mb-32 max-w-4xl">
        <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.8em] block mb-6">Engine Specifications</span>
        <h2 className="text-6xl lg:text-8xl font-black font-premium uppercase tracking-tighter leading-none mb-12">
          Engineered <br /> for Performance
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
        <div className="md:col-span-8 bento-item bento-card rounded-[3rem] p-12 lg:p-16 flex flex-col justify-end relative group">
          <div className="absolute top-16 right-16 opacity-5 group-hover:opacity-10 transition-opacity"><Activity size={200} /></div>
          <div className="relative z-10 max-w-md">
            <Activity className="text-blue-500 mb-8" size={48} />
            <h3 className="text-4xl font-black font-premium uppercase mb-6 tracking-tight">Zero-Latency Trace</h3>
            <p className="text-sm font-medium opacity-40 leading-relaxed uppercase tracking-widest">Our proprietary evaluation graph allows for real-time propagation across millions of nodes with sub-ms overhead.</p>
          </div>
        </div>

        <div className="md:col-span-4 bento-item bento-card rounded-[3rem] p-12 lg:p-16 flex flex-col justify-between border-blue-500/20 bg-blue-500/5 group hover:bg-blue-500/10 transition-colors">
          <Cpu className="text-blue-500" size={48} />
          <div>
            <h3 className="text-2xl font-black font-premium uppercase mb-4">Multi-Core Engine</h3>
            <p className="text-[11px] font-bold opacity-40 uppercase tracking-widest leading-relaxed">Thread-safe evaluation allows complex synchronous systems to run without jitter or race conditions.</p>
          </div>
        </div>

        <div className="md:col-span-4 bento-item bento-card rounded-[3rem] p-12 flex flex-col justify-between group">
          <Layers className="text-slate-400 group-hover:text-white transition-colors" size={40} />
          <h3 className="text-xl font-bold uppercase tracking-widest">Atomic Modules</h3>
        </div>

        <div className="md:col-span-4 bento-item bento-card rounded-[3rem] p-12 flex flex-col justify-between group">
          <Dna className="text-slate-400 group-hover:text-white transition-colors" size={40} />
          <h3 className="text-xl font-bold uppercase tracking-widest">Logic Clusters</h3>
        </div>

        <div className="md:col-span-4 bento-item bento-card rounded-[3rem] p-12 flex items-center justify-center group overflow-hidden bg-white text-black hover:bg-blue-500 hover:text-white transition-all cursor-pointer" onClick={onEnter}>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black tracking-[1em] mb-4">INITIALIZE</span>
            <div className="text-5xl font-black font-premium tracking-tighter uppercase flex items-center gap-4">
              LAB <ArrowUpRight size={48} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
