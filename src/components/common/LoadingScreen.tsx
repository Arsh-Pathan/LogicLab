
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<SVGSVGElement>(null);
  const [, setStatus] = useState('Initializing Core');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(containerRef.current, {
            opacity: 0,
            duration: 0.8,
            onComplete
          });
        }
      });

      // Cinematic entrance with motion blur
      tl.fromTo('#v-blur', 
        { attr: { stdDeviation: "0 20" } },
        { attr: { stdDeviation: "0 0" }, duration: 1.5, ease: 'power2.out' }
      );

      tl.from('.loading-content', {
        y: 60,
        opacity: 0,
        duration: 1.5,
        ease: 'expo.out'
      }, "-=1.5");

      // Typing effect for "LOGICLAB"
      const chars = "LOGICLAB".split("");
      if (textRef.current) {
        textRef.current.innerHTML = chars.map(c => `<span class="inline-block opacity-0">${c}</span>`).join("");
        tl.to(textRef.current.children, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.8,
          ease: 'power4.out',
          onStart: () => setStatus('Syncing Logic Lattice')
        }, "-=1.2");
      }

      // Hardware Pulse animation
      if (pulseRef.current) {
        tl.fromTo(pulseRef.current.querySelectorAll('.pulse-path'), 
          { strokeDashoffset: 400, strokeDasharray: 400 },
          { 
            strokeDashoffset: 0, 
            duration: 2.5, 
            stagger: 0.1, 
            ease: 'expo.inOut',
            onStart: () => setStatus('Calibrating Signals')
          },
          "-=1.8"
        );

        // Core glow oscillation (Perfect Centering)
        gsap.to('.core-center', {
          opacity: 0.8,
          scale: 1.2,
          transformOrigin: "center center",
          duration: 0.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Final zoom pre-exit with motion blur re-init
      tl.to('#v-blur', {
        attr: { stdDeviation: "0 40" },
        duration: 0.8,
        ease: 'power2.in'
      }, "+=0.2");

      tl.to('.loading-content', {
        scale: 1.05,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.in',
        onStart: () => setStatus('Terminal Ready')
      }, "-=0.8");

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-app flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Matrix */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none animate-grid-pulse">
        <svg width="100%" height="100%">
          <pattern id="loading-grid-v11" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            <circle cx="0" cy="0" r="1" fill="currentColor" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#loading-grid-v11)" />
        </svg>
      </div>

      <div className="loading-content relative flex flex-col items-center gap-16 select-none">
        
        {/* Cinematic Blur Definitions */}
        <svg className="absolute invisible w-0 h-0">
          <defs>
            <filter id="motion-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="0 0" id="v-blur" />
            </filter>
            <filter id="logo-glow">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* High-Precision Institutional Logo SVG (Logic Gate Component) */}
        <div style={{ filter: 'url(#motion-blur)', transform: 'scale(1.1)' }}>
          <svg 
            ref={pulseRef}
            width="200" 
            height="200" 
            viewBox="0 0 100 100" 
            className="text-main"
            style={{ overflow: 'visible' }}
          >
            {/* Component Blueprint Grid */}

            {/* The Gate Structure */}
            <g stroke="currentColor" strokeWidth="2.5" fill="none" filter="url(#logo-glow)">
               {/* Body */}
               <path 
                 d="M 30 20 H 50 C 70 20 85 35 85 50 C 85 65 70 80 50 80 H 30 V 20 Z" 
               />
               
               {/* Input/Output Leads */}
               <path className="pulse-path" d="M 0 35 H 30" opacity="0.2"/>
               <path className="pulse-path" d="M 0 65 H 30" opacity="0.2"/>
               <path className="pulse-path" d="M 85 50 H 110" opacity="0.2"/>
            </g>

            <g className="core-center">
               <circle cx="112" cy="50" r="3" fill="currentColor" className="origin-center" />
               <circle cx="112" cy="50" r="4" stroke="currentColor" strokeWidth="1" className="origin-center opacity-20" />
            </g>

            {/* Terminal Points */}
            <g fill="currentColor">
              <circle cx="2" cy="35" r="3" />
              <circle cx="2" cy="65" r="3" />
            </g>

          </svg>
        </div>

        <div className="flex flex-col items-center gap-12" style={{ filter: 'url(#motion-blur)' }}>
          <div 
            ref={textRef}
            className="text-7xl md:text-8xl font-black tracking-[-0.08em] text-main uppercase leading-none"
          >
            LOGICLAB
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-[1px] bg-border-main relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-main w-full animate-shimmer" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="text-[10px] font-black uppercase tracking-[1em] text-dim opacity-30 flex items-center gap-6">
          <div className="w-8 h-[1px] bg-border-main" />
          from engineer to engineers
          <div className="w-8 h-[1px] bg-border-main" />
        </div>
      </div>
    </div>
  );
}
