import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';

function ICNode({ data, selected }: NodeProps<CircuitNodeData>) {
  const { type, label, inputs, outputs, rotation } = data;

  const nodeHeight = useMemo(
    () => Math.max(60, Math.max(inputs.length, outputs.length) * 22 + 20),
    [inputs.length, outputs.length]
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
      className="relative flex items-center"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* IC body with integrated handles and labels */}
      <div
        className={`relative flex border-[1.5px] rounded-lg transition-all
          ${selected ? 'border-white scale-[1.02] z-50 shadow-xl shadow-white/5' : ''}
        `}
        style={{
          minWidth: '100px',
          height: `${nodeHeight}px`,
          borderColor: selected ? '#ffffff' : icColor,
          backgroundColor: 'var(--bg-app)',
          borderStyle: 'solid',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-2 rounded-b-full"
          style={{ backgroundColor: icColor, opacity: 0.4 }}
        />

        {/* Center Title Display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col px-6">
           <div className="text-[10px] sm:text-[11px] font-black text-main uppercase tracking-widest text-center" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', lineHeight: 1.2 }}>
             {label.replace(/_/g, ' ')}
           </div>
           
           {(() => {
             const fallbackDesc = `Custom IC: ${label}`;
             const customDesc = (data.properties?.definition as any)?.description;
             
             // If we have a custom subtitle distinct from the auto-generated one
             if (type === 'IC' && customDesc && customDesc !== fallbackDesc) {
               return (
                 <div className="text-[7.5px] text-dim opacity-80 font-bold mt-1 uppercase tracking-[0.2em] text-center" style={{ wordBreak: 'break-word', lineHeight: 1.2 }}>
                   {customDesc}
                 </div>
               );
             }
             
             // For standard ICs, show their type if label is truly different from the primitive
             const normalizedLabel = label.replace(/_/g, ' ').toUpperCase();
             const normalizedType = type.replace(/_/g, ' ').toUpperCase();
             
             if (type !== 'IC' && normalizedLabel !== normalizedType) {
               return (
                 <div className="text-[7.5px] text-dim font-bold mt-1 uppercase tracking-[0.2em] text-center" style={{ wordBreak: 'break-word', lineHeight: 1.2 }}>
                   {normalizedType}
                 </div>
               );
             }
             
             return null;
           })()}
        </div>

        {/* Input handles & inside Labels */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none">
          {inputs.map((pin) => (
            <div key={pin.id} className="relative flex items-center" style={{ height: `${100 / Math.max(inputs.length, 1)}%` }}>
              <Handle
                type="target"
                position={Position.Left}
                id={pin.id}
                className="!w-[9px] !h-[9px] !rounded-full !border-[1.5px] transition-colors duration-75 pointer-events-auto"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: 0,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: pin.signal === 1 ? '#22c55e' : 'var(--bg-panel)',
                  borderColor: pin.signal === 1 ? '#22c55e' : '#4b5563',
                }}
              />
              <span className="text-[7.5px] text-gray-300 font-bold font-mono select-none ml-[7px]">
                {pin.label}
              </span>
            </div>
          ))}
        </div>

        {/* Output handles & inside Labels */}
        <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-evenly pointer-events-none text-right">
          {outputs.map((pin) => (
            <div key={pin.id} className="relative flex items-center justify-end" style={{ height: `${100 / Math.max(outputs.length, 1)}%` }}>
              <span className="text-[7.5px] text-gray-300 font-bold font-mono select-none mr-[7px]">
                {pin.label}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={pin.id}
                className="!w-[9px] !h-[9px] !rounded-full !border-[1.5px] transition-colors duration-75 pointer-events-auto"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translate(50%, -50%)',
                  backgroundColor: pin.signal === 1 ? '#22c55e' : 'var(--bg-panel)',
                  borderColor: pin.signal === 1 ? '#22c55e' : '#4b5563',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(ICNode);
