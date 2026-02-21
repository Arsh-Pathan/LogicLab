import { useState } from 'react';
import { X, ArrowRight, MousePointer2, Box, Cpu, Save, Lightbulb } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

const STEPS = [
  {
    title: "Welcome to LogicLab",
    desc: "I'm so glad you're here! LogicLab is a powerful playground where you can design digital circuits, build custom chips, and learn how computers actually think under the hood.",
    icon: <Cpu className="text-accent" size={32} />,
  },
  {
    title: "The Canvas",
    desc: "This is where the magic happens. You can click and drag logic gates from the library on the left. Connect the small circles (pins) to create signal paths.",
    icon: <MousePointer2 className="text-blue-500" size={32} />,
  },
  {
    title: "Integrated Circuits (ICs)",
    desc: "Built something cool? Select your gates and click 'Build IC' to package them into a single, custom block. It's like creating your own LEGO pieces!",
    icon: <Box className="text-emerald-500" size={32} />,
  },
  {
    title: "Saving Your Work",
    desc: "Don't lose your hard work. Sign in to save your designs to my cloud. You can access your logic labs from any device, anywhere.",
    icon: <Save className="text-amber-500" size={32} />,
  },
  {
    title: "You're all set!",
    desc: "Explore the community tab to see what others have built, or dive into the 'Learn' track to master some serious computer science concepts.",
    icon: <Lightbulb className="text-yellow-400" size={32} />,
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-app/80 backdrop-blur-xl transition-all duration-500 animate-in fade-in">
      <div className="bg-sidebar border border-border-strong rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 pb-0 flex justify-end">
          <button 
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-main/5 text-dim hover:text-main transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 pt-4 text-center">
            <div className="w-16 h-16 bg-app rounded-2xl flex items-center justify-center mx-auto mb-8 border border-border-main shadow-sm">
                {step.icon}
            </div>
            
            <h2 className="text-3xl font-bold tracking-tight mb-4">{step.title}</h2>
            <p className="text-dim font-medium leading-relaxed mb-10">
                {step.desc}
            </p>

            {/* Pagination dots */}
            <div className="flex justify-center gap-1.5 mb-10">
                {STEPS.map((_, i) => (
                    <div 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-accent' : 'w-1.5 bg-border-strong'}`} 
                    />
                ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
                <button 
                    onClick={handleNext}
                    className="w-full h-14 bg-main text-app rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-[0.98]"
                >
                    {isLast ? "Let's Go!" : "Next Step"}
                    {!isLast && <ArrowRight size={18} />}
                </button>
                
                {!isLast && (
                    <button 
                        onClick={handleClose}
                        className="text-xs font-bold text-dim hover:text-main py-2 transition-colors uppercase tracking-widest"
                    >
                        Skip Tutorial
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
