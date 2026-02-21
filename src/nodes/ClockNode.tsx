import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircuitNodeData } from '../types/circuit';
import { useCircuitStore } from '../store/circuitStore';

function ClockNode({ data, selected, id }: NodeProps<CircuitNodeData>) {
  const simulationMode = useCircuitStore((s) => s.simulationMode);
  const setClockFrequency = useCircuitStore((s) => s.setClockFrequency);
  const { outputs, rotation } = data;

  const frequency = (data.properties.frequency as number) ?? 1;
  const outputSignal = outputs[0]?.signal;
  const isHigh = outputSignal === 1;
  const isFrozen = simulationMode === 'frozen';

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(frequency.toString());

  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (isFrozen) return;
    let frameId: number;
    
    const animate = (time: number) => {
      // Speed scales with frequency
      const speed = frequency * 40; // Pixels per second
      const currentOffset = ((time / 1000) * speed) % 40;
      setOffset(currentOffset);
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [frequency, isFrozen]);

  const handleStartEdit = (e: React.MouseEvent) => {
    if (!selected) return;
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(frequency.toString());
  };

  const handleFinishEdit = () => {
    setIsEditing(false);
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) {
      setClockFrequency(id, val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleFinishEdit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  return (
    <div
      className="relative flex items-center group transition-all duration-75"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        className={`
          w-24 h-24 rounded-[2rem] border-4 flex flex-col items-center justify-between
          transition-all duration-75 select-none relative overflow-hidden p-3
          ${selected ? 'border-[var(--selection-color)] scale-[1.02]' : (isHigh && !isFrozen ? 'bg-red-600/90 border-red-400' : 'bg-node border-border-muted')}
        `}
        style={{ transform: `rotate(-${rotation}deg)` }}
      >
        {/* Header */}
        <div className="text-[10px] font-black tracking-[0.1em] uppercase text-main/70 text-center w-full">
          Clock
        </div>

        {/* Wave Visualization */}
        <div className="flex-1 w-full flex items-center justify-center py-1 px-1">
          <div className="w-full h-8 bg-black/40 rounded-1xl relative overflow-hidden flex items-center border border-white/5">
            <svg 
              width="100%" 
              height="24" 
              viewBox="0 0 100 24" 
              preserveAspectRatio="none"
              className="relative z-10"
            >
              <path
                d={`M ${-40 + offset},18 L ${-20 + offset},18 L ${-20 + offset},6 L ${offset},6 L ${offset},18 L ${20 + offset},18 L ${20 + offset},6 L ${40 + offset},6 L ${40 + offset},18 L ${60 + offset},18 L ${60 + offset},6 L ${80 + offset},6 L ${80 + offset},18 L ${100 + offset},18 L ${100 + offset},6 L ${120 + offset},6 L ${120 + offset},18`}
                fill="none"
                stroke={isHigh && !isFrozen ? '#ffffff' : '#ef4444'}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors duration-100"
                strokeWidth="2.5"
              />
            </svg>
            
          </div>
        </div>

        {/* Info - Editable Frequency */}
        <div 
          className={`text-center transition-all ${selected ? 'cursor-text hover:bg-white/5 rounded-lg px-2' : ''}`}
          onClick={handleStartEdit}
        >
          {isEditing ? (
            <input
              autoFocus
              className="w-12 bg-transparent text-base font-black tracking-tighter text-main text-center outline-none"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleFinishEdit}
              onKeyDown={handleKeyDown}
            />
          ) : (
            <div className="text-base font-black tracking-tighter text-main leading-none">
              {frequency < 1 ? frequency.toFixed(1) : frequency}Hz
            </div>
          )}
        </div>
      </div>

      {/* Output handle */}
      <div className="absolute -right-3 h-full flex flex-col justify-center z-20">
        <Handle
          type="source"
          position={Position.Right}
          id="out"
          className={`
            !w-4 !h-4 !rounded-full !border-2 !static !transform-none transition-all
            ${isHigh 
              ? '!bg-white !border-red-400' 
              : '!bg-gray-900 !border-white/20'}
          `}
        />
      </div>
    </div>
  );
}

export default memo(ClockNode);
