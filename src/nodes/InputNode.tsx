import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';
import { useCircuitStore } from '../store/circuitStore';

function InputNode({ data, selected, id }: NodeProps<CircuitNodeData>) {
  const toggleInput = useCircuitStore((s) => s.toggleInput);
  const { rotation } = data;

  const value = (data.properties.value as number) ?? 0;
  const isHigh = value === 1;

  const handleToggle = useCallback(() => {
    toggleInput(id);
  }, [id, toggleInput]);

  return (
    <div
      className="relative flex items-center justify-center w-12 h-12 group transition-all duration-75"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <button
        onClick={handleToggle}
        className={`
          relative w-10 h-10 rounded-xl border-[3px] flex items-center justify-center
          cursor-pointer transition-all duration-75 select-none focus:outline-none
          ${selected 
            ? 'border-[var(--selection-color)] !scale-110 !z-[100]' 
            : (isHigh 
                ? 'bg-accent-blue border-accent-blue shadow-[0_0_15px_rgba(14,165,233,0.4)]' 
                : 'bg-app border-border-strong hover:border-main')}
        `}
        style={{ transform: `rotate(-${rotation}deg)` }}
      >
        <span className={`
          text-base font-black font-mono transition-all duration-75 z-10
          ${isHigh ? 'text-white' : 'text-main'}
        `}>
          {value}
        </span>
      </button>

      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className={`
          !w-3 !h-3 !rounded-full !border-[3px] !-mr-1.5 transition-colors z-10 !absolute !right-0
          ${isHigh 
            ? '!bg-accent-blue !border-white' 
            : '!bg-app !border-muted hover:!border-main'}
        `}
      />
    </div>
  );
}

export default memo(InputNode);
