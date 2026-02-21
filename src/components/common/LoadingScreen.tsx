import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<SVGSVGElement>(null);
  const [status, setStatus] = useState('Initializing Core');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.2,
            duration: 1.5,
            ease: 'expo.inOut',
            onComplete
          });
        }
      });

      // Typing effect for "LOGICLAB"
      const chars = "LOGICLAB".split("");
      if (textRef.current) {
        textRef.current.innerHTML = chars.map(c => `<span class="opacity-0">${c}</span>`).join("");
        tl.to(textRef.current.children, {
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: 'power2.out',
          onStart: () => setStatus('Syncing Logic Gates')
        });

        // Flicker effect
        tl.to(textRef.current, {
          opacity: 0.5,
          duration: 0.05,
          repeat: 5,
          yoyo: true,
          ease: 'none'
        });
        tl.to(textRef.current, { opacity: 1, duration: 0.1 });
      }

      // Logic Flow animation
      if (pulseRef.current) {
        tl.fromTo(pulseRef.current.querySelectorAll('.pulse-line'), 
          { strokeDashoffset: 1000, strokeDasharray: 1000 },
          { 
            strokeDashoffset: 0, 
            duration: 2, 
            stagger: 0.2, 
            ease: 'power3.inOut',
            onStart: () => setStatus('Calibrating Signals')
          },
          "-=0.5"
        );
      }

      // Final zoom pre-exit
      tl.to('.loading-content', {
        scale: 0.9,
        opacity: 0.8,
        duration: 0.8,
        ease: 'power4.inOut',
        onStart: () => setStatus('Terminal Ready')
      });

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-app flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="loading-content relative flex flex-col items-center gap-12">
        <svg 
          ref={pulseRef}
          width="400" 
          height="120" 
          viewBox="0 0 400 120" 
          className="text-main"
        >
          <path className="pulse-line opacity-20" d="M 0 60 H 400" stroke="currentColor" strokeWidth="1" fill="none" />
          <path className="pulse-line" d="M 50 20 V 100 M 150 20 V 100 M 250 20 V 100 M 350 20 V 100" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle className="pulse-line" cx="200" cy="60" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>

        <div className="flex flex-col items-center gap-4">
          <div 
            ref={textRef}
            className="text-8xl font-black tracking-[-0.1em] text-main uppercase leading-none"
          >
            LOGICLAB
          </div>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-main rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-dim opacity-50">
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-12">
        <div className="text-[10px] font-black uppercase tracking-widest text-dim opacity-20">
          Precision Engineering // v7.0.42
        </div>
      </div>
    </div>
  );
}
