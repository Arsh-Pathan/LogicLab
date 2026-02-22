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
  const simulationMode = useCircuitStore((s) => s.simulationMode);
  
  // Get live signal from properly reactive signalCache
  const signalCache = useCircuitStore((s) => s.signalCache);
  const nodeSignals = signalCache.get(source);
  const signal = nodeSignals?.get(sourceHandleId ?? 'out') ?? 0;
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

  const strokeColor = isFrozen ? '#f59e0b' : isHigh ? '#ffffff' : '#334155';

  return (
    <>
      {/* Background/Shadow Layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="rgba(0,0,0,0.5)"
        strokeWidth={selected ? 5 : 4}
        strokeLinecap="round"
      />
      
      {/* Base Idle Track */}
      <path
        d={edgePath}
        fill="none"
        stroke="#334155"
        strokeWidth={selected ? 3 : 2.5}
        strokeLinecap="round"
      />

      {/* Active White Flowing Wave */}
      {isHigh && (
        <path
          d={edgePath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={selected ? 3 : 2.5}
          strokeLinecap="round"
          style={{
            strokeDasharray: !isFrozen ? '8, 12' : 'none',
            filter: 'drop-shadow(0 0 6px rgba(255,255,255,0.8))',
          }}
        >
          {!isFrozen && (
            <animate
              attributeName="stroke-dashoffset"
              from="20"
              to="0"
              dur="0.5s"
              repeatCount="indefinite"
            />
          )}
        </path>
      )}

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
