import { useState, useEffect, useRef } from 'react';
import { Layers, Sparkles, ArrowRight, X } from 'lucide-react';

interface ProjectNameDialogProps {
  open: boolean;
  onConfirm: (name: string) => void;
  onSkip: () => void;
}

export default function ProjectNameDialog({ open, onConfirm, onSkip }: ProjectNameDialogProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed) {
      onConfirm(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onSkip();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="relative w-full max-w-lg mx-4 overflow-hidden"
        style={{
          animation: 'dialogSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Main card — uses the site's design tokens */}
        <div className="bg-app border border-border-main rounded-sm shadow-float overflow-hidden">
          {/* Header */}
          <div className="relative px-8 pt-8 pb-6">
            {/* Close button */}
            <button
              onClick={onSkip}
              className="absolute top-4 right-4 p-2 rounded-sm text-dim hover:text-main transition-all"
            >
              <X size={16} />
            </button>

            <div className="relative flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-sm bg-main/5 border border-border-main shrink-0">
                <Layers size={22} className="text-main" />
              </div>
              <div>
                <h2 className="text-xl font-black text-main tracking-tight uppercase">
                  New Project
                </h2>
                <p className="text-xs text-dim mt-1.5 leading-relaxed font-medium">
                  Give your circuit a name to get started.
                </p>
              </div>
            </div>
          </div>

          {/* Input section */}
          <div className="px-8 pb-4">
            <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-dim mb-3 opacity-50">
              Project Name
            </label>
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 4-Bit ALU, SR Latch Test..."
                className="w-full bg-transparent border border-border-main rounded-sm px-5 py-4 text-main text-sm font-bold outline-none transition-all duration-300 focus:border-main placeholder:text-dim placeholder:opacity-30"
                maxLength={60}
                autoComplete="off"
                spellCheck={false}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Sparkles
                  size={16}
                  className={`transition-all duration-300 ${
                    name.trim()
                      ? 'text-accent-blue opacity-100'
                      : 'text-dim opacity-20'
                  }`}
                />
              </div>
            </div>

            {/* Character count */}
            <div className="flex justify-end mt-2">
              <span className={`text-[9px] font-black tracking-widest transition-colors ${
                name.length > 50 ? 'text-accent-red' : 'text-dim opacity-30'
              }`}>
                {name.length}/60
              </span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="px-8 py-5 border-t border-border-main flex items-center justify-between">
            <button
              onClick={onSkip}
              className="px-4 py-2 text-[10px] font-black text-dim hover:text-main uppercase tracking-widest transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="btn-premium disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:filter-none"
            >
              Create Project
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dialogSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
