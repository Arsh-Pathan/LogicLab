import React, { memo, useState } from 'react';
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
      className="relative flex items-center group"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div
        className={`
          w-24 h-24 rounded-[2rem] border-4 flex flex-col items-center justify-between
          select-none relative overflow-hidden p-3
          ${selected ? 'border-[var(--selection-color)]' : (isHigh && !isFrozen ? 'bg-red-500 border-red-400' : 'bg-app border-border-muted')}
        `}
        style={{ transform: `rotate(-${rotation}deg)` }}
      >
        {/* Header */}
        <div className="text-[10px] font-black tracking-[0.1em] uppercase text-main/70 text-center w-full">
          Clock
        </div>

        {/* Static wave indicator — no animation loop */}
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
                d="M 0,18 L 10,18 L 10,6 L 20,6 L 20,18 L 30,18 L 30,6 L 40,6 L 40,18 L 50,18 L 50,6 L 60,6 L 60,18 L 70,18 L 70,6 L 80,6 L 80,18 L 90,18 L 90,6 L 100,6"
                fill="none"
                stroke={isHigh && !isFrozen ? '#ffffff' : '#ef4444'}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
              />
            </svg>
          </div>
        </div>

        {/* Info - Editable Frequency */}
        <div
          className={`text-center ${selected ? 'cursor-text hover:bg-white/5 rounded-lg px-2' : ''}`}
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
            !w-4 !h-4 !rounded-full !border-2 !static !transform-none
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
