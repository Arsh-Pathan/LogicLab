// ============================================================
// Wire Edge — Optimized for large circuits (no animations/glow)
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

  // Read signal directly from engine via node data
  const nodes = useCircuitStore((s) => s.nodes);
  const sourceNode = nodes.find((n) => n.id === source);
  const pin = sourceNode?.data.outputs.find((p) => p.id === (sourceHandleId ?? 'out'));
  const signal = pin?.signal ?? 0;
  const isHigh = signal === 1;
  const isFrozen = simulationMode === 'frozen';

  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 8,
  });

  const strokeColor = isFrozen
    ? '#f59e0b'
    : isHigh
      ? 'var(--accent-blue)'
      : 'var(--text-muted)';

  return (
    <>
      {/* Base track */}
      <path
        d={edgePath}
        fill="none"
        stroke="#1e293b"
        strokeWidth={selected ? 4 : 3}
        strokeLinecap="round"
      />

      {/* Signal layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={selected ? 3 : 2}
        strokeLinecap="round"
      />

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
