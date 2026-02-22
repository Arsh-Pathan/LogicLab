import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CircuitBackground() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const ctx = gsap.context(() => {
      // Flowing signals along the curves
      gsap.to('.signal-pulse', {
        strokeDashoffset: -120,
        duration: 4,
        repeat: -1,
        ease: 'none',
        stagger: {
          each: 0.8,
          repeat: -1
        }
      });

      // Atmospheric pulsing of nodes
      gsap.to('.data-node', {
        r: 3,
        opacity: 0.8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          amount: 2,
          from: 'random'
        }
      });
      
      // Proximity glow effect based on mouse movement
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const rect = svgRef.current?.getBoundingClientRect();
        if (rect) {
          const x = (clientX - rect.left);
          const y = (clientY - rect.top);
          gsap.to('.proximity-glow', {
            cx: x,
            cy: y,
            duration: 1.2,
            ease: 'expo.out'
          });
        }
      };
      
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);

    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08] bg-app">
      <svg 
        ref={svgRef}
        viewBox="0 0 1400 1400" 
        className="w-full h-full text-main"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="path-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <radialGradient id="mouseGradient">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* --- Background Lattice Grid --- */}
        <g stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.05">
           {Array.from({ length: 15 }).map((_, i) => (
             <path key={`h-${i}`} d={`M 0 ${i * 100} H 1400`} />
           ))}
           {Array.from({ length: 15 }).map((_, i) => (
             <path key={`v-${i}`} d={`M ${i * 100} 0 V 1400`} />
           ))}
        </g>

        {/* --- Curvy Signal Arteries --- */}
        <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2">
          <path d="M -100 250 Q 400 50 800 400 T 1500 200" />
          <path d="M -100 600 Q 500 850 900 600 T 1500 900" />
          <path d="M 300 -100 Q 150 400 500 750 T 300 1500" />
          <path d="M 1000 -100 Q 1200 500 900 950 T 1100 1500" />
          
          {/* Intersection Points */}
          <path d="M 400 200 C 600 200 600 600 800 600" />
          <path d="M 900 750 C 700 750 700 1100 500 1100" />
        </g>

        {/* --- Animated Flowing Pulses --- */}
        <g stroke="currentColor" strokeWidth="2" fill="none" filter="url(#path-glow)" opacity="0.5">
          <path className="signal-pulse" d="M -100 250 Q 400 50 800 400 T 1500 200" strokeDasharray="12,80" />
          <path className="signal-pulse" d="M -100 600 Q 500 850 900 600 T 1500 900" strokeDasharray="12,80" />
          <path className="signal-pulse" d="M 300 -100 Q 150 400 500 750 T 300 1500" strokeDasharray="12,80" />
          <path className="signal-pulse" d="M 1000 -100 Q 1200 500 900 950 T 1100 1500" strokeDasharray="12,80" />
        </g>

        {/* --- Data Nodes (Pulsing Terminals) --- */}
        <g fill="currentColor" opacity="0.4">
          {[
            [400, 205], [800, 400], [500, 755], [900, 600], [600, 200], [700, 750], [900, 950], [1030, 480], [240, 520]
          ].map(([x, y], i) => (
            <circle key={i} className="data-node" cx={x} cy={y} r="2" />
          ))}
        </g>

        {/* --- Dynamic Proximity Layer --- */}
        <circle className="proximity-glow" cx="0" cy="0" r="300" fill="url(#mouseGradient)" />
      </svg>
    </div>
  );
}
