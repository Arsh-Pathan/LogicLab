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
      default: return '#06b6d4';
    }
  }, [type]);

  return (
    <div
      className="relative flex items-center"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Input handles */}
      <div className="flex flex-col justify-evenly absolute left-0 top-0 bottom-0 z-10"
        style={{ transform: 'translateX(-1px)' }}>
        {inputs.map((pin) => (
          <div key={pin.id} className="relative flex items-center" style={{ height: `${100 / Math.max(inputs.length, 1)}%` }}>
            <Handle
              type="target"
              position={Position.Left}
              id={pin.id}
              className="!w-2.5 !h-2.5 !rounded-full !border-2 transition-colors duration-75"
              style={{
                position: 'relative',
                top: 'auto',
                left: 'auto',
                transform: 'none',
                backgroundColor: pin.signal === 1 ? '#22c55e' : '#1f2937',
                borderColor: pin.signal === 1 ? '#22c55e' : '#4b5563',
              }}
            />
            <span className="text-[8px] text-gray-400 ml-0.5 font-mono select-none">
              {pin.label}
            </span>
          </div>
        ))}
      </div>

      {/* IC body */}
      <div
        className={`relative flex flex-col items-center justify-center border-2 rounded-lg px-6 mx-4 transition-all
          ${selected ? 'border-white scale-[1.02] z-50 shadow-xl shadow-white/5' : ''}
        `}
        style={{
          minWidth: '64px',
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

        {/* Label */}
        <div className="text-[10px] font-bold text-main font-mono">
          {label}
        </div>
        <div className="text-[8px] text-dim mt-0.5">
          {type === 'IC' ? 'Custom' : type.replace('_', ' ')}
        </div>
      </div>

      {/* Output handles */}
      <div className="flex flex-col justify-evenly absolute right-0 top-0 bottom-0 z-10"
        style={{ transform: 'translateX(1px)' }}>
        {outputs.map((pin) => (
          <div key={pin.id} className="relative flex items-center" style={{ height: `${100 / Math.max(outputs.length, 1)}%` }}>
            <span className="text-[8px] text-gray-400 mr-0.5 font-mono select-none">
              {pin.label}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={pin.id}
              className="!w-2.5 !h-2.5 !rounded-full !border-2 transition-colors duration-75"
              style={{
                position: 'relative',
                top: 'auto',
                right: 'auto',
                transform: 'none',
                backgroundColor: pin.signal === 1 ? '#22c55e' : '#1f2937',
                borderColor: pin.signal === 1 ? '#22c55e' : '#4b5563',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ICNode);
