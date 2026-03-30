import { useState } from 'react';

/**
 * Tiny interactive AND gate demo — two toggle inputs, live output.
 */
export default function InteractiveDemo() {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const output = a && b;

  return (
    <div
      className="inline-flex items-center gap-5 rounded-xl px-6 py-4"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      {/* Input A */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: 'var(--text-dim)', minWidth: 12 }}
        >
          A
        </span>
        <button
          onClick={() => setA(!a)}
          className="relative w-10 h-5 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: a ? 'var(--accent-green)' : 'var(--border-main)',
          }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
            style={{
              transform: a ? 'translateX(22px)' : 'translateX(2px)',
            }}
          />
        </button>
        <span
          className="text-xs font-mono font-bold"
          style={{ color: a ? 'var(--accent-green)' : 'var(--text-muted)', minWidth: 8 }}
        >
          {a ? '1' : '0'}
        </span>
      </div>

      {/* Input B */}
      <div className="flex items-center gap-2">
        <span
          className="text-xs font-mono font-semibold"
          style={{ color: 'var(--text-dim)', minWidth: 12 }}
        >
          B
        </span>
        <button
          onClick={() => setB(!b)}
          className="relative w-10 h-5 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: b ? 'var(--accent-green)' : 'var(--border-main)',
          }}
        >
          <div
            className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
            style={{
              transform: b ? 'translateX(22px)' : 'translateX(2px)',
            }}
          />
        </button>
        <span
          className="text-xs font-mono font-bold"
          style={{ color: b ? 'var(--accent-green)' : 'var(--text-muted)', minWidth: 8 }}
        >
          {b ? '1' : '0'}
        </span>
      </div>

      {/* Separator */}
      <div
        className="w-px h-6"
        style={{ backgroundColor: 'var(--border-subtle)' }}
      />

      {/* Gate label */}
      <span
        className="text-xs font-mono font-bold px-2 py-1 rounded"
        style={{
          backgroundColor: 'var(--accent-blue-light)',
          color: 'var(--accent-blue)',
        }}
      >
        AND
      </span>

      {/* Arrow */}
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" style={{ color: 'var(--text-muted)' }}>
        <path d="M0 6h16M12 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Output indicator */}
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full transition-colors duration-200"
          style={{
            backgroundColor: output ? 'var(--accent-green)' : 'var(--border-main)',
            boxShadow: output ? '0 0 8px var(--accent-green)' : 'none',
          }}
        />
        <span
          className="text-xs font-mono font-bold"
          style={{ color: output ? 'var(--accent-green)' : 'var(--text-muted)' }}
        >
          {output ? '1' : '0'}
        </span>
      </div>
    </div>
  );
}
