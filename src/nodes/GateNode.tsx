import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

const GATE_COLORS: Record<string, string> = {
  AND: '#3b82f6',
  OR: '#8b5cf6',
  NOT: '#ef4444',
  NAND: '#06b6d4',
  NOR: '#f59e0b',
  XOR: '#10b981',
  XNOR: '#f472b6',
  BUFFER: '#94a3b8',
};

const getGatePath = (type: string, w: number, h: number) => {
  const r = 12;
  switch (true) {
    case type.includes('AND'):
      return `M 0,${r} Q 0,0 ${r},0 L ${w*0.5},0 A ${w*0.5},${h*0.5} 0 0 1 ${w*0.5},${h} L ${r},${h} Q 0,${h} 0,${h-r} Z`;
    case type.includes('OR') || type.includes('XOR'):
      return `M 0,${r} Q 0,0 ${r},0 C ${w*0.4},0 ${w*0.8},0 ${w},${h*0.5} C ${w*0.8},${h} ${w*0.4},${h} ${r},${h} Q 0,${h} 0,${h-r} C ${w*0.2},${h*0.5} ${w*0.2},${h*0.5} 0,${r} Z`;
    case type === 'NOT' || type === 'BUFFER':
      return `M ${r*0.5},${r} Q 0,0 ${r},0 L ${w-r},${h*0.5 - r*0.5} Q ${w},${h*0.5} ${w-r},${h*0.5 + r*0.5} L ${r},${h} Q 0,${h} ${r*0.5},${h-r} Z`;
    default:
      return `M ${r},0 L ${w-r},0 Q ${w},0 ${w},${r} L ${w},${h-r} Q ${w},${h} ${w-r},${h} L ${r},${h} Q 0,${h} 0,${h-r} L 0,${r} Q 0,0 ${r},0 Z`;
  }
};

function GateNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { type, inputs, outputs, rotation } = data;

  const gateColor = GATE_COLORS[type] ?? '#6b7280';
  const isInverted = ['NAND', 'NOR', 'NOT', 'XNOR'].includes(type);
  const isX = type === 'XOR' || type === 'XNOR';
  
  const outputSignal = outputs[0]?.signal;
  const isHigh = outputSignal === 1;

  // Scale width and height with input count for a growing-gate feel
  const nodeWidth = useMemo(() => Math.max(60, 52 + inputs.length * 6), [inputs.length]);
  const nodeHeight = useMemo(() => Math.max(56, inputs.length * 22 + 12), [inputs.length]);

  return (
    <div
      style={{ transform: `rotate(${rotation}deg)` }}
      className="relative flex items-center"
    >
      <div className="flex flex-col justify-center gap-4 py-2 absolute -left-[10px] h-full z-10"
        style={{ transition: 'height 0.2s ease' }}
      >
        {inputs.map((pin) => (
          <Handle
            key={pin.id}
            type="target"
            position={Position.Left}
            id={pin.id}
            className={`
              !w-3 !h-3 !rounded-full !border-2 !static !transform-none transition-all duration-75
              ${pin.signal === 1 
                ? '!bg-accent-blue !border-white' 
                : '!bg-app !border-muted hover:!border-main'}
            `}
          />
        ))}
      </div>

      <div className="relative mx-4"
        style={{
          width: nodeWidth,
          height: nodeHeight,
          transition: 'width 0.2s ease, height 0.2s ease',
        }}
      >
        <svg 
          viewBox={`0 0 ${nodeWidth} ${nodeHeight}`} 
          width={nodeWidth} 
          height={nodeHeight}
          className="overflow-visible"
          style={{ transition: 'width 0.2s ease, height 0.2s ease' }}
        >
          <defs />

          {/* Opaque base to occlude wires passing behind the gate */}
          <path
            d={getGatePath(type, nodeWidth, nodeHeight)}
            fill="var(--bg-app)"
          />

          <path
            d={getGatePath(type, nodeWidth, nodeHeight)}
            fill={isHigh ? `${gateColor}15` : 'var(--bg-panel)'}
            stroke={selected ? 'var(--selection-color)' : (isHigh ? gateColor : 'var(--text-muted)')}
            strokeWidth={selected ? 4 : 3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {isX && (
            <path
              d={`M -6,${nodeHeight*0.1} Q 2,${nodeHeight*0.5} -6,${nodeHeight*0.9}`}
              fill="none"
              stroke={selected ? 'var(--selection-color)' : (isHigh ? gateColor : 'var(--text-muted)')}
              strokeWidth={selected ? 4 : 3}
              strokeLinecap="round"
            />
          )}

          {isInverted && (
            <>
              <circle
                cx={nodeWidth + 8}
                cy={nodeHeight * 0.5}
                r={5}
                fill="var(--bg-app)"
              />
              <circle
                cx={nodeWidth + 8}
                cy={nodeHeight * 0.5}
                r={5}
                fill="var(--bg-panel)"
                stroke={selected ? 'var(--selection-color)' : (isHigh ? gateColor : 'var(--text-muted)')}
                strokeWidth={selected ? 4 : 3}
              />
            </>
          )}
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-3">
          <span 
            className={`text-[10px] font-black tracking-[0.2em] uppercase
              ${isHigh ? 'text-main' : 'text-dim'}
            `}
            style={{ 
              transform: ['OR', 'NOR', 'XOR', 'XNOR'].includes(type) ? 'translateX(4px)' : 'none'
            }}
          >
            {type === 'BUFFER' ? 'BUF' : type}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center absolute -right-[10px] h-full z-10"
        style={{ transition: 'height 0.2s ease' }}
      >
        {outputs.map((pin) => (
          <Handle
            key={pin.id}
            type="source"
            position={Position.Right}
            id={pin.id}
            className={`
              !w-4 !h-4 !rounded-full !border-2 !static !transform-none transition-all duration-75
              ${pin.signal === 1 
                ? '!bg-accent-blue !border-white' 
                : '!bg-app !border-muted'}
            `}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(GateNode);
