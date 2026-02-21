import Logo from '../common/Logo';

export default function Footer() {
  return (
    <footer className="py-24 px-8 lg:px-16 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-12 opacity-40">
      <div className="flex items-center gap-4">
        <Logo size={42} />
        <div className="flex flex-col">
          <span className="text-xl font-bold font-premium uppercase tracking-tighter">LogicLab</span>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Architectural Systems Inc.</span>
        </div>
      </div>
      <div className="flex gap-16 text-[10px] font-black uppercase tracking-[0.6em]">
        <span className="cursor-pointer hover:text-white transition-colors">Registry</span>
        <span className="cursor-pointer hover:text-white transition-colors">Manual</span>
        <span className="cursor-pointer hover:text-white transition-colors">Support</span>
      </div>
      <span className="text-[9px] font-black uppercase tracking-widest opacity-40">© 2026 LogicLab — Worldwide Infrastructure</span>
    </footer>
  );
}
