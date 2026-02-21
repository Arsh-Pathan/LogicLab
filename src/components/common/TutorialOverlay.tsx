import { useState } from 'react';
import { X, ArrowRight, Box, Cpu, Save, Terminal, Activity } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const STEPS = [
  {
    title: "Inaugural Handshake",
    desc: "Welcome to the LogicLab Research Environment. You are entering a precision-engineered ecosystem for digital verification and systemic design.",
    icon: <Terminal className="text-main" size={32} />,
  },
  {
    title: "The Lattice Grid",
    desc: "The central workspace allows for deterministic signal propagation. Drag components from the infrastructure library and anchor them to the grid to begin verification.",
    icon: <Activity className="text-main" size={32} />,
  },
  {
    title: "System Encapsulation",
    desc: "LogicLab supports infinite recursion. Select verified sub-systems and click 'Package IC' to collapse complex logic into single, high-density nodes.",
    icon: <Box className="text-main" size={32} />,
  },
  {
    title: "Persistent Registry",
    desc: "Anchor your research to the global lattice. Sign in to synchronize your persistent states across all institutional nodes.",
    icon: <Save className="text-main" size={32} />,
  },
  {
    title: "System Authorization",
    desc: "You are now cleared for experimentation. Access the Academy for advanced curriculum or browse the Registry for peer-verified architectures.",
    icon: <Cpu className="text-main" size={32} />,
  }
];

export default function TutorialOverlay() {
  const [currentStep, setCurrentStep] = useState(0);
  const showTutorial = useUIStore((s) => s.showTutorial);
  const setShowTutorial = useUIStore((s) => s.setShowTutorial);

  if (!showTutorial) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleClose();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleClose = () => {
    setShowTutorial(false);
    localStorage.setItem('logiclab_tutorial_completed', 'true');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-app/90 backdrop-blur-3xl transition-all duration-700 animate-in fade-in">
      <div className="bg-app border border-border-main rounded-sm shadow-float max-w-xl w-full overflow-hidden flex flex-col">
        {/* Institutional Header */}
        <div className="p-8 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-main animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Onboarding Protocol</span>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-sm hover:bg-neutral-100 text-dim hover:text-main transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-12 pt-8 text-center flex flex-col gap-8">
            <div className="w-20 h-20 bg-neutral-50 rounded-sm flex items-center justify-center mx-auto border border-border-main shadow-sm animate-bounce-subtle">
                {step.icon}
            </div>
            
            <div className="space-y-4">
               <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{step.title}</h2>
               <div className="w-12 h-1 bg-main mx-auto" />
            </div>

            <p className="text-lg text-dim font-medium leading-relaxed italic tracking-tight opacity-70">
                {step.desc}
            </p>

            {/* Precision Pagination */}
            <div className="flex justify-center gap-2">
                {STEPS.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1 transition-all duration-500 ease-expo ${i === currentStep ? 'w-12 bg-main' : 'w-4 bg-border-main opacity-20'}`} 
                    />
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-4">
                <button 
                    onClick={handleNext}
                    className="btn-premium px-12 py-6 text-xs uppercase tracking-[0.3em] font-black w-full"
                >
                    {isLast ? "Enter Laboratory" : "Proceed to Next Node"}
                    {!isLast && <ArrowRight size={18} />}
                </button>
                
                {!isLast && (
                    <button 
                        onClick={handleClose}
                        className="text-[9px] font-black text-dim hover:text-main py-2 transition-all uppercase tracking-[0.4em] opacity-40 hover:opacity-100"
                    >
                        Bypass Handshake
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
