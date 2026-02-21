import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

const SEGMENTS = [
  'M 5 2 L 7 0 L 17 0 L 19 2 L 17 4 L 7 4 Z',
  'M 20 3 L 22 5 L 22 13 L 20 15 L 18 13 L 18 5 Z',
  'M 20 17 L 22 19 L 22 27 L 20 29 L 18 27 L 18 19 Z',
  'M 5 28 L 7 26 L 17 26 L 19 28 L 17 30 L 7 30 Z',
  'M 4 17 L 6 19 L 6 27 L 4 29 L 2 27 L 2 19 Z',
  'M 4 3 L 6 5 L 6 13 L 4 15 L 2 13 L 2 5 Z',
  'M 5 15 L 7 13 L 17 13 L 19 15 L 17 17 L 7 17 Z',
];

function SevenSegmentNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const {inputs, rotation } = data;

  const segmentSignals = useMemo(() => {
    return inputs.map((p) => (p.signal === 1));
  }, [inputs]);

  return (
    <div
      className={`
        relative flex items-center p-2 rounded-3xl border-2 transition-all gap-4
        ${selected 
          ? 'bg-panel border-[var(--selection-color)] shadow-xl' 
          : 'bg-card border-border-main'}
      `}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Input labels & Handles column */}
      <div className="flex flex-col gap-1 px-1">
        {inputs.map((pin, i) => (
          <div key={pin.id} className="flex items-center gap-2 h-5">
            <Handle
              type="target"
              position={Position.Left}
              id={pin.id}
              className="!w-3 !h-3 !rounded-full !border-2 transition-colors !static !transform-none"
              style={{
                backgroundColor: pin.signal === 1 ? '#22c55e' : 'var(--bg-app)',
                borderColor: pin.signal === 1 ? '#22c55e' : 'var(--border-muted)',
              }}
            />
            <span className="text-[9px] text-main/60 font-black uppercase tracking-tighter w-3 text-center">
              {String.fromCharCode(97 + i)}
            </span>
          </div>
        ))}
      </div>

      <div
        className={`
          relative bg-[#02040a] rounded-2xl p-6 flex flex-col items-center justify-center min-w-[110px] transition-all
          border-[3px] shadow-inner
          ${selected ? 'border-[var(--selection-color)]/50' : 'border-white/10'}
        `}
      >
        <div className="absolute inset-2 bg-black/40 rounded-xl border border-white/5 pointer-events-none shadow-2xl" />
        
        <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-white/10" />
        <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-white/10" />
        <div className="absolute bottom-2 left-2 w-1 h-1 rounded-full bg-white/10" />
        <div className="absolute bottom-2 right-2 w-1 h-1 rounded-full bg-white/10" />

        <svg 
          width="54" 
          height="74" 
          viewBox="0 0 24 30"
          className="relative z-10 overflow-visible"
        >
          {SEGMENTS.map((path, i) => (
            <path
              key={i}
              d={path}
              fill={segmentSignals[i] ? '#ef4444' : (selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)')}
              opacity={segmentSignals[i] ? 1 : 0.6}
              stroke={segmentSignals[i] ? '#f87171' : 'transparent'}
              strokeWidth={segmentSignals[i] ? 0.4 : 0}
              className="transition-all duration-75"
              style={{
                filter: segmentSignals[i] ? 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.8))' : 'none'
              }}
            />
          ))}
        </svg>
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent rounded-2xl pointer-events-none opacity-30" />
      </div>
    </div>
  );
}

export default memo(SevenSegmentNode);
