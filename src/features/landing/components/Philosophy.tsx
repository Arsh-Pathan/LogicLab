import { Monitor } from 'lucide-react';
import Logo from '../../../components/common/Logo';

export default function Philosophy() {
  return (
    <section className="parallax-section relative py-64 px-8 lg:px-16 flex flex-col items-center text-center overflow-hidden">
      <div className="parallax-bg absolute inset-0 -z-10 opacity-[0.05] flex items-center justify-center">
        <Logo size={800} />
      </div>
      <div className="max-w-4xl relative z-10">
        <Monitor className="text-blue-500 mx-auto mb-10" size={64} />
        <h2 className="text-5xl lg:text-7xl font-black font-premium uppercase tracking-tighter mb-12">Designed for Immersion</h2>
        <p className="text-lg lg:text-xl font-medium opacity-30 leading-relaxed uppercase tracking-[0.1em]">
          The interface disappears, leaving only your logic. Minimalist aesthetics combined with a powerful command registry provide an unparalleled architectural workflow.
        </p>
      </div>
    </section>
  );
}
