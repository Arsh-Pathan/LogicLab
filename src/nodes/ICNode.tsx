import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

function ICNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { type, label, inputs, outputs, rotation } = data;

  const allPins = useMemo(() => [...inputs, ...outputs], [inputs, outputs]);

  const leftPins = useMemo(() => allPins.filter(p => (p as any).side === 'left' || (!(p as any).side && p.type === 'input')), [allPins]);
  const rightPins = useMemo(() => allPins.filter(p => (p as any).side === 'right' || (!(p as any).side && p.type === 'output')), [allPins]);
  const topPins = useMemo(() => allPins.filter(p => (p as any).side === 'top'), [allPins]);
  const bottomPins = useMemo(() => allPins.filter(p => (p as any).side === 'bottom'), [allPins]);

  const nodeWidth = useMemo(
    () => Math.max(140, Math.max(topPins.length, bottomPins.length) * 24 + 60),
    [topPins.length, bottomPins.length]
  );

  const nodeHeight = useMemo(
    () => Math.max(80, Math.max(leftPins.length, rightPins.length) * 24 + 40),
    [leftPins.length, rightPins.length]
  );

  const icColor = useMemo(() => {
    switch (type) {
      case 'HALF_ADDER': return '#f59e0b';
      case 'FULL_ADDER': return '#ef4444';
      case 'DECODER': return '#8b5cf6';
      case 'BCD_TO_7SEG': return '#f97316';
      case 'MUX_2TO1': return '#06b6d4';
      case 'MUX_4TO1': return '#0891b2';
      case 'DEMUX_1TO4': return '#6366f1';
      case 'SR_LATCH': return '#ec4899';
      case 'D_FLIPFLOP': return '#f43f5e';
      case 'JK_FLIPFLOP': return '#d946ef';
      case 'COMPARATOR': return '#10b981';
      default: return '#06b6d4';
    }
  }, [type]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ transform: `rotate(${rotation}deg)`, width: nodeWidth, height: nodeHeight }}
    >
      {/* IC body with integrated handles and labels */}
      <div
        className={`relative flex border-2 rounded-xl transition-all overflow-hidden w-full h-full
          ${selected ? 'z-50' : ''}
        `}
        style={{
          borderColor: selected ? 'var(--accent-blue)' : 'var(--border-main)',
          backgroundColor: 'var(--bg-panel)',
          boxShadow: selected ? '0 0 0 4px var(--accent-blue-light), var(--shadow-xl)' : 'var(--shadow-md)',
          background: `linear-gradient(165deg, var(--bg-panel) 0%, var(--bg-canvas) 100%)`,
        }}
      >
        {/* Mold Parting Line (Subtle horizontal line across the chip) */}
        <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-main/5 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-1/2 w-[1.5px] bg-main/5 pointer-events-none" />

        {/* Notch (Ceramic/Plastic style) */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-4 rounded-b-xl border-x border-b border-border-main flex items-start justify-center"
          style={{ backgroundColor: 'var(--bg-app)', boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.2)' }}
        >
          <div className="w-8 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: icColor, opacity: 0.8 }} />
        </div>

        {/* Batch ID / Technical markings */}
        <div className="absolute bottom-3 right-3 opacity-20 pointer-events-none select-none">
          <span className="text-[7px] font-black font-mono text-main uppercase tracking-[0.4em]">
            {type}-{allPins.length}X-REV2
          </span>
        </div>

        {/* Center Title Display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col px-10">
           <div className="text-[13px] font-black text-main uppercase tracking-[0.2em] text-center leading-tight drop-shadow-sm" style={{ wordBreak: 'break-word' }}>
             {label.replace(/_/g, ' ')}
           </div>

           {(() => {
             const fallbackDesc = `Custom IC: ${label}`;
             const customDesc = (data.properties?.definition as any)?.description;

             if (type === 'IC' && customDesc && customDesc !== fallbackDesc) {
               return (
                 <div className="text-[9px] text-muted font-bold mt-2.5 uppercase tracking-widest text-center opacity-60" style={{ wordBreak: 'break-word', lineHeight: 1.2 }}>
                   {customDesc}
                 </div>
               );
             }

             const normalizedLabel = label.replace(/_/g, ' ').toUpperCase();
             const normalizedType = type.replace(/_/g, ' ').toUpperCase();

             if (type !== 'IC' && normalizedLabel !== normalizedType) {
               return (
                 <div className="text-[8px] text-muted font-black mt-2 uppercase tracking-[0.3em] text-center opacity-40" style={{ wordBreak: 'break-word', lineHeight: 1.2 }}>
                   {normalizedType}
                 </div>
               );
             }

             return null;
           })()}
        </div>

        {/* LEFT Handles */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none py-4">
          {leftPins.map((pin) => (
            <div key={pin.id} className="relative flex items-center h-full px-2.5">
              <Handle
                type={pin.type === 'input' ? 'target' : 'source'}
                position={Position.Left}
                id={pin.id}
                className={`
                  !w-4 !h-4 !rounded-full !border-[2.5px] !static !transform-none pointer-events-auto transition-all hover:scale-125
                  ${pin.signal === 1
                    ? '!bg-accent-blue !border-white'
                    : '!bg-border-strong !border-border-subtle'}
                `}
                style={{ marginLeft: '-19px' }}
              />
              <span className="text-[9px] text-main/60 font-black font-mono select-none ml-2 uppercase tracking-tighter">
                {pin.label}
              </span>
            </div>
          ))}
        </div>

        {/* RIGHT Handles */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none py-4 text-right">
          {rightPins.map((pin) => (
            <div key={pin.id} className="relative flex items-center justify-end h-full px-2.5">
              <span className="text-[9px] text-main/60 font-black font-mono select-none mr-2 uppercase tracking-tighter">
                {pin.label}
              </span>
              <Handle
                type={pin.type === 'input' ? 'target' : 'source'}
                position={Position.Right}
                id={pin.id}
                className={`
                  !w-4 !h-4 !rounded-full !border-[2.5px] !static !transform-none pointer-events-auto transition-all hover:scale-125
                  ${pin.signal === 1
                    ? '!bg-accent-blue !border-white'
                    : '!bg-border-strong !border-border-subtle'}
                `}
                style={{ marginRight: '-19px' }}
              />
            </div>
          ))}
        </div>

        {/* TOP Handles */}
        <div className="absolute top-0 left-0 right-0 flex justify-evenly pointer-events-none px-4">
          {topPins.map((pin) => (
            <div key={pin.id} className="relative flex flex-col items-center w-full py-2">
              <Handle
                type={pin.type === 'input' ? 'target' : 'source'}
                position={Position.Top}
                id={pin.id}
                className={`
                  !w-4 !h-4 !rounded-full !border-[2.5px] !static !transform-none pointer-events-auto transition-all hover:scale-125
                  ${pin.signal === 1
                    ? '!bg-accent-blue !border-white'
                    : '!bg-border-strong !border-border-subtle'}
                `}
                style={{ marginTop: '-19px' }}
              />
              <span className="text-[9px] text-main/60 font-black font-mono select-none mt-1 uppercase tracking-tighter">
                {pin.label}
              </span>
            </div>
          ))}
        </div>

        {/* BOTTOM Handles */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-evenly pointer-events-none px-4">
          {bottomPins.map((pin) => (
            <div key={pin.id} className="relative flex flex-col items-center w-full py-2">
              <span className="text-[9px] text-main/60 font-black font-mono select-none mb-1 uppercase tracking-tighter">
                {pin.label}
              </span>
              <Handle
                type={pin.type === 'input' ? 'target' : 'source'}
                position={Position.Bottom}
                id={pin.id}
                className={`
                  !w-4 !h-4 !rounded-full !border-[2.5px] !static !transform-none pointer-events-auto transition-all hover:scale-125
                  ${pin.signal === 1
                    ? '!bg-accent-blue !border-white'
                    : '!bg-border-strong !border-border-subtle'}
                `}
                style={{ marginBottom: '-19px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ICNode);
