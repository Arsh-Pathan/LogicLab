import { lazy, Suspense, useEffect, useState } from 'react';

// 3D bundle loads only after first paint — keeps hero text visible immediately
const Hero3D = lazy(() => import('./Hero3D'));

function HeroSkeleton() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{
        height: 480,
        background:
          'radial-gradient(ellipse at center, rgba(34,211,238,0.08), rgba(11,18,32,0.0) 70%), linear-gradient(180deg, rgba(15,23,42,0.6), rgba(2,6,23,0.0))',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: '#22d3ee',
            boxShadow: '0 0 24px 6px rgba(34,211,238,0.7)',
            animation: 'logiclab-pulse 1.4s ease-in-out infinite',
          }}
        />
      </div>
      <style>{`
        @keyframes logiclab-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 1.0; transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}

/**
 * Lazy 3D hero — renders skeleton until WebGL bundle resolves.
 * Skips entirely if reduced-motion is preferred or device is tiny.
 */
export default function Hero3DLazy() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tooSmall = window.innerWidth < 768;
    if (reduceMotion || tooSmall) return;

    // Defer the 3D mount past the first paint so hero text/CTA render instantly
    const idle =
      (window as Window & { requestIdleCallback?: (cb: () => void) => number }).requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => setEnabled(true));
  }, []);

  if (!enabled) return <HeroSkeleton />;

  return (
    <Suspense fallback={<HeroSkeleton />}>
      <Hero3D />
    </Suspense>
  );
}
