// ============================================================
// Wire Edge — Optimized for large circuits (no animations/glow)
// ============================================================

import { memo } from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';
import { useCircuitStore } from '../store/circuitStore';

const controlsStyle = { cursor: 'copy' } as const;

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

  // Fine-grained selector: only re-renders when THIS edge's signal changes
  const signal = useCircuitStore((s) => {
    const sourceNode = s.nodes.find((n) => n.id === source);
    if (!sourceNode) return 0;
    const pin = sourceNode.data.outputs.find((p) => p.id === (sourceHandleId ?? 'out'));
    return pin?.signal ?? 0;
  });

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

  const baseWidth = selected ? 4 : 3;
  const signalWidth = selected ? 3 : 2;

  return (
    <>
      {/* Base track */}
      <path
        d={edgePath}
        fill="none"
        stroke="#1e293b"
        strokeWidth={baseWidth}
        strokeLinecap="round"
      />

      {/* Signal layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth={signalWidth}
        strokeLinecap="round"
      />

      {/* Interaction layer */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={20}
        style={controlsStyle}
      />
    </>
  );
}

export default memo(WireEdge);
