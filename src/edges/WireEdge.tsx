// ============================================================
// Wire Edge — Square/Orthogonal Connector Style
// ============================================================

import { memo } from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';
import { useCircuitStore } from '../store/circuitStore';

function WireEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  source,
  sourceHandleId,
}: EdgeProps) {
  const engine = useCircuitStore((s) => s.engine);
  const simulationMode = useCircuitStore((s) => s.simulationMode);

  // Get live signal from engine
  const sourceOutputs = engine.getNodeOutputs(source);
  const signal = sourceOutputs.get(sourceHandleId ?? 'out');
  const isHigh = signal === 1;
  const isFrozen = simulationMode === 'frozen';

  // Use getSmoothStepPath with radius for smooth curves
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16, // Smoother corners
  });

  const strokeColor = isFrozen
    ? '#f59e0b' 
    : isHigh
      ? '#3b82f6' 
      : '#334155';

  return (
    <>
      {/* Removed keyframes */}
      
      {/* Removed Glow Layer */}
      
      {/* Background/Shadow Layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={selected ? 5 : 4}
        strokeLinecap="round"
      />
      
      {/* Main Tactical Wire */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={selected ? 3 : 2.5}
        strokeLinecap="round"
        className="transition-colors duration-200"
      />

      {/* Removed Flow Animation Layer */}

      {/* Interaction layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={{ cursor: 'copy' }}
      />
    </>
  );
}

export default memo(WireEdge);
