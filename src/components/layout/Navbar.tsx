import { useNavigate } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLaunch = () => {
    navigate('/sandbox');
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-24 flex items-center justify-between px-8 lg:px-16 z-[100] mix-blend-difference pointer-events-none">
      <div className="flex items-center gap-4 pointer-events-auto cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <Logo size={42} />
        <span className="text-xl font-bold font-premium uppercase tracking-tighter">LogicLab</span>
      </div>
      <div className="flex items-center gap-6 lg:gap-12 pointer-events-auto">
        <button 
          onClick={handleLaunch} 
          className="px-8 py-3 glass-premium rounded-full text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity"
        >
          Launch Engine
        </button>
      </div>
    </nav>
  );
}
