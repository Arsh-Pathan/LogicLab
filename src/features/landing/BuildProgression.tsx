import { useEffect, useRef, useState } from 'react';

const STAGES = [
  { label: 'NAND', color: '#8ab4f8' },
  { label: 'Half Adder', color: '#81c995' },
  { label: 'Full Adder', color: '#c58af9' },
  { label: 'ALU', color: '#fdd663' },
  { label: 'CPU', color: '#f28b82' },
];

export default function BuildProgression() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col sm:flex-row items-center justify-center gap-0">
      {STAGES.map((stage, i) => (
        <div
          key={stage.label}
          className="flex items-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(12px)',
            transition: `all 0.5s ease ${i * 0.12}s`,
          }}
        >
          {/* Node */}
          <div
            className="flex flex-col items-center gap-2 px-4 sm:px-6 py-4 rounded-xl transition-all duration-200"
            style={{
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-card)',
              minWidth: 100,
            }}
            onMouseEnter={e => {
              (e.currentTarget.style as any).borderColor = stage.color + '60';
              (e.currentTarget.style as any).boxShadow = `0 0 20px ${stage.color}15`;
            }}
            onMouseLeave={e => {
              (e.currentTarget.style as any).borderColor = 'var(--border-subtle)';
              (e.currentTarget.style as any).boxShadow = 'none';
            }}
          >
            <span
              className="text-sm font-mono font-bold"
              style={{ color: stage.color }}
            >
              {stage.label}
            </span>
          </div>

          {/* Connector arrow (not after last) */}
          {i < STAGES.length - 1 && (
            <svg
              width="32"
              height="12"
              viewBox="0 0 32 12"
              fill="none"
              className="mx-1 shrink-0 hidden sm:block"
              style={{
                opacity: visible ? 0.4 : 0,
                transition: `opacity 0.5s ease ${i * 0.12 + 0.2}s`,
              }}
            >
              <path
                d="M0 6h28M24 1l5 5-5 5"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {/* Mobile: down arrow */}
          {i < STAGES.length - 1 && (
            <svg
              width="12"
              height="24"
              viewBox="0 0 12 24"
              fill="none"
              className="my-1 shrink-0 sm:hidden"
              style={{
                opacity: visible ? 0.4 : 0,
                transition: `opacity 0.5s ease ${i * 0.12 + 0.2}s`,
              }}
            >
              <path
                d="M6 0v20M1 16l5 5 5-5"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
