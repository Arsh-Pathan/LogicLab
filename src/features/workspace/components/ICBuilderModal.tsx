// ============================================================
// ICBuilderModal — Visual IC Packaging Editor
// A full visual editor that shows the selected circuit's
// components and wires, letting you click on terminals to
// define IC pins with full visual context.
// ============================================================

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  X, Package, Save, Eye, ChevronUp, ChevronDown,
  Move, ZoomIn, ZoomOut, Maximize2,
  Tag, ArrowRight
} from 'lucide-react';
import { useUIStore } from '../../../store/uiStore';
import { useCircuitStore } from '../../../store/circuitStore';

// ---- types ----
interface PinDef {
  nodeId: string;
  label: string;
  side: 'left' | 'right';
  order: number;
}

// ---- helpers ----
const NODE_W = 110;
const NODE_H = 44;

function nodeColor(type: string): string {
  switch (type) {
    case 'INPUT': return '#10b981';
    case 'OUTPUT': case 'LED': return '#3b82f6';
    case 'CLOCK': return '#f59e0b';
    case 'AND': case 'NAND': return '#6366f1';
    case 'OR': case 'NOR': return '#8b5cf6';
    case 'NOT': case 'BUFFER': return '#ef4444';
    case 'XOR': case 'XNOR': return '#14b8a6';
    default: return '#64748b';
  }
}

function shortLabel(label: string, maxLen = 12) {
  return label.length > maxLen ? label.slice(0, maxLen - 1) + '…' : label;
}

// ============================================================
// Main Component
// ============================================================
export default function ICBuilderModal() {
  const showICBuilder = useUIStore((s: any) => s.showICBuilder);
  const setShowICBuilder = useUIStore((s: any) => s.setShowICBuilder);
  const selectedNodeIds = useUIStore((s: any) => s.selectedNodeIds);

  const nodes = useCircuitStore((s: any) => s.nodes);
  const edges = useCircuitStore((s: any) => s.edges);
  const createIC = useCircuitStore((s: any) => s.createIC);

  // IC metadata
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Pin definitions — built by clicking nodes in the visual editor
  const [pins, setPins] = useState<PinDef[]>([]);

  // Visual editor state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Filtered nodes & edges
  const selectedNodes = useMemo(() =>
    nodes.filter((n: any) => selectedNodeIds.includes(n.id)),
    [nodes, selectedNodeIds]
  );

  const selectedEdges = useMemo(() =>
    edges.filter((e: any) =>
      selectedNodeIds.includes(e.source) && selectedNodeIds.includes(e.target)
    ),
    [edges, selectedNodeIds]
  );

  // Identify terminal nodes (potential IC pins)
  const terminalNodes = useMemo(() =>
    selectedNodes.filter((n: any) =>
      n.data.type === 'INPUT' || n.data.type === 'OUTPUT' || n.data.type === 'LED'
    ),
    [selectedNodes]
  );

  // Compute bounds on mount & fit view
  const bounds = useMemo(() => {
    if (selectedNodes.length === 0) return { minX: 0, minY: 0, maxX: 400, maxY: 300 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of selectedNodes) {
      minX = Math.min(minX, n.position.x);
      minY = Math.min(minY, n.position.y);
      maxX = Math.max(maxX, n.position.x + NODE_W);
      maxY = Math.max(maxY, n.position.y + NODE_H);
    }
    const pad = 60;
    return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
  }, [selectedNodes]);

  // Auto-fit on open
  useEffect(() => {
    if (showICBuilder && svgRef.current) {
      const svgEl = svgRef.current;
      const { width: svgW, height: svgH } = svgEl.getBoundingClientRect();
      const bw = bounds.maxX - bounds.minX;
      const bh = bounds.maxY - bounds.minY;
      if (bw <= 0 || bh <= 0) return;
      const scale = Math.min(svgW / bw, svgH / bh, 1.5) * 0.85;
      setZoom(scale);
      setPan({
        x: (svgW / 2) - ((bounds.minX + bw / 2) * scale),
        y: (svgH / 2) - ((bounds.minY + bh / 2) * scale),
      });
    }
  }, [showICBuilder, bounds]);

  // Reset on close
  useEffect(() => {
    if (!showICBuilder) {
      setName('');
      setDescription('');
      setPins([]);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [showICBuilder]);

  // ---- Pin Management ----
  const isNodePinned = (nodeId: string) => pins.some(p => p.nodeId === nodeId);

  const togglePin = useCallback((nodeId: string, nodeType: string, nodeLabel: string) => {
    setPins(prev => {
      if (prev.some(p => p.nodeId === nodeId)) {
        // Remove pin
        const filtered = prev.filter(p => p.nodeId !== nodeId);
        // Reorder
        const left = filtered.filter(p => p.side === 'left').sort((a, b) => a.order - b.order);
        const right = filtered.filter(p => p.side === 'right').sort((a, b) => a.order - b.order);
        left.forEach((p, i) => p.order = i);
        right.forEach((p, i) => p.order = i);
        return [...left, ...right];
      } else {
        // Add pin
        const side: 'left' | 'right' = nodeType === 'INPUT' ? 'left' : 'right';
        const sameSide = prev.filter(p => p.side === side);
        return [...prev, {
          nodeId,
          label: nodeLabel,
          side,
          order: sameSide.length,
        }];
      }
    });
  }, []);

  const updatePinLabel = (nodeId: string, label: string) => {
    setPins(prev => prev.map(p => p.nodeId === nodeId ? { ...p, label } : p));
  };

  const movePinOrder = (nodeId: string, dir: -1 | 1) => {
    setPins(prev => {
      const updated = [...prev];
      const pin = updated.find(p => p.nodeId === nodeId);
      if (!pin) return prev;
      const sameSide = updated.filter(p => p.side === pin.side).sort((a, b) => a.order - b.order);
      const idx = sameSide.findIndex(p => p.nodeId === nodeId);
      if (idx < 0) return prev;
      if (dir === -1 && idx === 0) return prev;
      if (dir === 1 && idx === sameSide.length - 1) return prev;
      const swapWith = sameSide[idx + dir];
      const tmpOrder = pin.order;
      const gA = updated.findIndex(p => p.nodeId === pin.nodeId);
      const gB = updated.findIndex(p => p.nodeId === swapWith.nodeId);
      updated[gA] = { ...updated[gA], order: swapWith.order };
      updated[gB] = { ...updated[gB], order: tmpOrder };
      return updated;
    });
  };

  const switchPinSide = (nodeId: string) => {
    setPins(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(p => p.nodeId === nodeId);
      if (idx < 0) return prev;
      const newSide: 'left' | 'right' = updated[idx].side === 'left' ? 'right' : 'left';
      const maxOrder = Math.max(-1, ...updated.filter(p => p.side === newSide).map(p => p.order));
      updated[idx] = { ...updated[idx], side: newSide, order: maxOrder + 1 };
      // Reorder old side
      const oldSide = newSide === 'left' ? 'right' : 'left';
      const oldPins = updated.filter(p => p.side === oldSide).sort((a, b) => a.order - b.order);
      oldPins.forEach((p, i) => {
        const gi = updated.findIndex(u => u.nodeId === p.nodeId);
        if (gi >= 0) updated[gi] = { ...updated[gi], order: i };
      });
      return updated;
    });
  };

  // ---- Save ----
  const handleSave = useCallback(() => {
    if (!name.trim() || pins.length === 0) return;

    const leftPins = pins.filter(p => p.side === 'left').sort((a, b) => a.order - b.order);
    const rightPins = pins.filter(p => p.side === 'right').sort((a, b) => a.order - b.order);

    const inputMarkers = leftPins.map(p => ({ id: p.nodeId, label: p.label }));
    const outputMarkers = rightPins.map(p => ({ id: p.nodeId, label: p.label }));

    createIC(name, description, selectedNodeIds, inputMarkers, outputMarkers);
    setShowICBuilder(false);
  }, [name, description, selectedNodeIds, pins, createIC, setShowICBuilder]);

  // ---- Pan/Zoom handlers ----
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.max(0.15, Math.min(4, z * delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2 || (e.button === 0 && e.altKey)) {
      e.preventDefault();
      isPanning.current = true;
      panStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    setPan({
      x: panStart.current.panX + (e.clientX - panStart.current.x),
      y: panStart.current.panY + (e.clientY - panStart.current.y),
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const fitView = useCallback(() => {
    if (!svgRef.current) return;
    const { width: svgW, height: svgH } = svgRef.current.getBoundingClientRect();
    const bw = bounds.maxX - bounds.minX;
    const bh = bounds.maxY - bounds.minY;
    if (bw <= 0 || bh <= 0) return;
    const scale = Math.min(svgW / bw, svgH / bh, 1.5) * 0.85;
    setZoom(scale);
    setPan({
      x: (svgW / 2) - ((bounds.minX + bw / 2) * scale),
      y: (svgH / 2) - ((bounds.minY + bh / 2) * scale),
    });
  }, [bounds]);

  // ---- Derived data ----
  const leftPins = pins.filter(p => p.side === 'left').sort((a, b) => a.order - b.order);
  const rightPins = pins.filter(p => p.side === 'right').sort((a, b) => a.order - b.order);
  const icHeight = Math.max(80, Math.max(leftPins.length, rightPins.length) * 28 + 36);

  if (!showICBuilder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div
        className="bg-app border border-border-main rounded-sm shadow-float w-full h-full max-w-[95vw] max-h-[92vh] flex flex-col overflow-hidden"
        style={{ animation: 'icSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* ========== HEADER ========== */}
        <div className="px-6 py-4 border-b border-border-main flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-sm bg-main/5 border border-border-main">
              <Package className="text-main" size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black text-main uppercase tracking-widest">
                IC Packaging Studio
              </h2>
              <p className="text-[9px] text-dim font-bold uppercase tracking-[0.3em] mt-0.5 opacity-50">
                {selectedNodes.length} components · {selectedEdges.length} wires · {terminalNodes.length} terminals
              </p>
            </div>
          </div>
          <button onClick={() => setShowICBuilder(false)} className="text-dim hover:text-main transition-colors p-2">
            <X size={18} />
          </button>
        </div>

        {/* ========== BODY ========== */}
        <div className="flex-1 flex overflow-hidden min-h-0">

          {/* ---- LEFT: Visual Circuit Editor ---- */}
          <div className="flex-1 flex flex-col min-w-0 border-r border-border-main">
            {/* Editor toolbar */}
            <div className="px-4 py-2 border-b border-border-main flex items-center justify-between shrink-0 bg-app">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-dim opacity-50">
                  Circuit Editor
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-sm bg-main/5 border border-border-main text-dim font-bold">
                  Click terminals to define pins
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setZoom(z => Math.min(4, z * 1.2))} className="p-1.5 text-dim hover:text-main transition-colors">
                  <ZoomIn size={14} />
                </button>
                <span className="text-[9px] font-bold text-dim w-10 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={() => setZoom(z => Math.max(0.15, z * 0.8))} className="p-1.5 text-dim hover:text-main transition-colors">
                  <ZoomOut size={14} />
                </button>
                <div className="w-[1px] h-4 bg-border-main mx-1" />
                <button onClick={fitView} className="p-1.5 text-dim hover:text-main transition-colors" title="Fit view">
                  <Maximize2 size={14} />
                </button>
              </div>
            </div>

            {/* SVG Canvas */}
            <div className="flex-1 relative overflow-hidden bg-canvas cursor-crosshair"
              onContextMenu={(e) => e.preventDefault()}
            >
              <svg
                ref={svgRef}
                className="w-full h-full"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Grid pattern */}
                <defs>
                  <pattern id="ic-grid" width={20 * zoom} height={20 * zoom} patternUnits="userSpaceOnUse">
                    <circle cx={1} cy={1} r={0.5} fill="var(--text-muted)" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ic-grid)" />

                {/* Transform group */}
                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>

                  {/* ---- Wires ---- */}
                  {selectedEdges.map((e: any) => {
                    const src = selectedNodes.find((n: any) => n.id === e.source);
                    const tgt = selectedNodes.find((n: any) => n.id === e.target);
                    if (!src || !tgt) return null;

                    const x1 = src.position.x + NODE_W;
                    const y1 = src.position.y + NODE_H / 2;
                    const x2 = tgt.position.x;
                    const y2 = tgt.position.y + NODE_H / 2;
                    const mx = (x1 + x2) / 2;

                    return (
                      <path
                        key={e.id}
                        d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
                        fill="none"
                        stroke="var(--text-muted)"
                        strokeWidth={1.5}
                        opacity={0.5}
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* ---- Node boxes ---- */}
                  {selectedNodes.map((n: any) => {
                    const isTerminal = n.data.type === 'INPUT' || n.data.type === 'OUTPUT' || n.data.type === 'LED';
                    const pinned = isNodePinned(n.id);
                    const color = nodeColor(n.data.type);
                    const x = n.position.x;
                    const y = n.position.y;

                    return (
                      <g
                        key={n.id}
                        onClick={isTerminal ? () => togglePin(n.id, n.data.type, n.data.label) : undefined}
                        style={{ cursor: isTerminal ? 'pointer' : 'default' }}
                      >
                        {/* Selection glow for pinned terminals */}
                        {pinned && (
                          <rect
                            x={x - 4}
                            y={y - 4}
                            width={NODE_W + 8}
                            height={NODE_H + 8}
                            rx={6}
                            fill="none"
                            stroke={color}
                            strokeWidth={2}
                            strokeDasharray="4 2"
                            opacity={0.7}
                          >
                            <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1s" repeatCount="indefinite" />
                          </rect>
                        )}

                        {/* Node body */}
                        <rect
                          x={x}
                          y={y}
                          width={NODE_W}
                          height={NODE_H}
                          rx={3}
                          fill={pinned ? `${color}18` : 'var(--bg-panel)'}
                          stroke={isTerminal ? color : 'var(--text-muted)'}
                          strokeWidth={pinned ? 2 : 1}
                        />

                        {/* Left port dot */}
                        {n.data.inputs?.length > 0 && (
                          <circle
                            cx={x}
                            cy={y + NODE_H / 2}
                            r={3}
                            fill="var(--bg-app)"
                            stroke="var(--text-muted)"
                            strokeWidth={1}
                          />
                        )}

                        {/* Right port dot */}
                        {n.data.outputs?.length > 0 && (
                          <circle
                            cx={x + NODE_W}
                            cy={y + NODE_H / 2}
                            r={3}
                            fill="var(--bg-app)"
                            stroke="var(--text-muted)"
                            strokeWidth={1}
                          />
                        )}

                        {/* Type badge */}
                        <text
                          x={x + 8}
                          y={y + 14}
                          fill={isTerminal ? color : 'var(--text-dim)'}
                          fontSize={8}
                          fontWeight={900}
                          fontFamily="var(--font-mono)"
                          textAnchor="start"
                          style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}
                        >
                          {n.data.type}
                        </text>

                        {/* Label */}
                        <text
                          x={x + 8}
                          y={y + 30}
                          fill="var(--text-main)"
                          fontSize={10}
                          fontWeight={700}
                          fontFamily="var(--font-sans)"
                        >
                          {shortLabel(n.data.label)}
                        </text>

                        {/* Pinned badge */}
                        {pinned && (
                          <g transform={`translate(${x + NODE_W - 18}, ${y + 4})`}>
                            <rect width={14} height={14} rx={2} fill={color} />
                            <text x={7} y={10.5} fill="white" fontSize={8} fontWeight={900} textAnchor="middle">✓</text>
                          </g>
                        )}

                        {/* Click hint for unpinned terminals */}
                        {isTerminal && !pinned && (
                          <g transform={`translate(${x + NODE_W - 18}, ${y + 4})`} opacity={0.3}>
                            <rect width={14} height={14} rx={2} fill="none" stroke={color} strokeWidth={1} strokeDasharray="2 1" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>

              {/* Legend overlay */}
              <div className="absolute bottom-3 left-3 flex gap-3">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-app/80 backdrop-blur-sm border border-border-main">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-dim">Input</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-app/80 backdrop-blur-sm border border-border-main">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-dim">Output</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm bg-app/80 backdrop-blur-sm border border-border-main">
                  <div className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-dim">Logic</span>
                </div>
              </div>

              {/* Instruction overlay (fades after interaction) */}
              {pins.length === 0 && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-sm bg-app/90 backdrop-blur-sm border border-border-main animate-pulse">
                  <span className="text-[9px] font-black uppercase tracking-widest text-dim">
                    Click on <span className="text-emerald-500">INPUT</span> or <span className="text-blue-500">OUTPUT</span> nodes to define IC pins
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ---- RIGHT: Configuration Panel ---- */}
          <div className="w-[340px] shrink-0 flex flex-col overflow-y-auto bg-app">
            <div className="p-5 space-y-5 flex-1">

              {/* IC Name & Description */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-dim opacity-50 mb-2">IC Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 4-Bit Adder"
                    className="w-full bg-transparent border border-border-main rounded-sm px-4 py-3 text-main text-sm font-bold focus:border-main outline-none transition-all placeholder:text-dim placeholder:opacity-30"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-dim opacity-50 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional"
                    className="w-full bg-transparent border border-border-main rounded-sm px-4 py-2.5 text-main text-xs font-bold focus:border-main outline-none transition-all placeholder:text-dim placeholder:opacity-30"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border-main" />

              {/* Defined Pins */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.4em] text-dim opacity-50">
                    Defined Pins ({pins.length})
                  </label>
                  {pins.length > 0 && (
                    <button
                      onClick={() => setPins([])}
                      className="text-[8px] font-bold uppercase tracking-widest text-dim hover:text-accent-red transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {pins.length === 0 ? (
                  <div className="py-6 border border-dashed border-border-main rounded-sm text-center">
                    <Tag size={20} className="mx-auto text-dim opacity-20 mb-2" />
                    <p className="text-[9px] font-bold text-dim opacity-40 uppercase tracking-widest">
                      No pins defined yet
                    </p>
                    <p className="text-[8px] text-dim opacity-30 mt-1">
                      Click terminals in the editor
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Left pins header */}
                    {leftPins.length > 0 && (
                      <div className="text-[8px] font-black uppercase tracking-[0.3em] text-emerald-500 opacity-60 mb-1 mt-2 flex items-center gap-2">
                        <ArrowRight size={8} />
                        Input Pins ({leftPins.length})
                      </div>
                    )}
                    {leftPins.map((p) => (
                      <PinRow
                        key={p.nodeId}
                        pin={p}
                        color="#10b981"
                        onLabelChange={(label) => updatePinLabel(p.nodeId, label)}
                        onMoveUp={() => movePinOrder(p.nodeId, -1)}
                        onMoveDown={() => movePinOrder(p.nodeId, 1)}
                        onSwitchSide={() => switchPinSide(p.nodeId)}
                        onRemove={() => togglePin(p.nodeId, 'INPUT', p.label)}
                        isFirst={p.order === 0}
                        isLast={p.order === leftPins.length - 1}
                      />
                    ))}

                    {/* Right pins header */}
                    {rightPins.length > 0 && (
                      <div className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500 opacity-60 mb-1 mt-3 flex items-center gap-2">
                        <ArrowRight size={8} className="rotate-180" />
                        Output Pins ({rightPins.length})
                      </div>
                    )}
                    {rightPins.map((p) => (
                      <PinRow
                        key={p.nodeId}
                        pin={p}
                        color="#3b82f6"
                        onLabelChange={(label) => updatePinLabel(p.nodeId, label)}
                        onMoveUp={() => movePinOrder(p.nodeId, -1)}
                        onMoveDown={() => movePinOrder(p.nodeId, 1)}
                        onSwitchSide={() => switchPinSide(p.nodeId)}
                        onRemove={() => togglePin(p.nodeId, 'OUTPUT', p.label)}
                        isFirst={p.order === 0}
                        isLast={p.order === rightPins.length - 1}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Divider */}
              {pins.length > 0 && <div className="border-t border-border-main" />}

              {/* IC Preview */}
              {pins.length > 0 && (
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.4em] text-dim opacity-50 mb-3">
                    <Eye size={10} className="inline mr-1 align-middle" />
                    IC Preview
                  </label>
                  <div className="flex justify-center py-4">
                    <ICPreview
                      name={name || 'IC'}
                      description={description}
                      leftPins={leftPins}
                      rightPins={rightPins}
                      height={icHeight}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ---- Footer ---- */}
            <div className="px-5 py-4 border-t border-border-main flex gap-3 shrink-0">
              <button
                onClick={() => setShowICBuilder(false)}
                className="flex-1 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-dim hover:text-main transition-colors border border-border-main rounded-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!name.trim() || pins.length === 0}
                className="flex-1 btn-premium disabled:opacity-30 justify-center"
              >
                <Save size={14} /> Package IC
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes icSlideIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// PinRow — single pin editor row
// ============================================================
function PinRow({
  pin,
  color,
  onLabelChange,
  onMoveUp,
  onMoveDown,
  onSwitchSide,
  onRemove,
  isFirst,
  isLast,
}: {
  pin: PinDef;
  color: string;
  onLabelChange: (label: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onSwitchSide: () => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-1 px-2 py-1.5 rounded-sm border border-border-main hover:border-main/20 transition-colors group">
      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <input
        type="text"
        value={pin.label}
        onChange={(e) => onLabelChange(e.target.value)}
        className="flex-1 bg-transparent text-[11px] text-main outline-none font-mono font-bold min-w-0 px-1"
        placeholder="Label"
      />
      <button onClick={onSwitchSide} title="Switch side" className="p-0.5 text-dim hover:text-main opacity-0 group-hover:opacity-100 transition-all">
        <Move size={10} />
      </button>
      <button onClick={onMoveUp} disabled={isFirst} className="p-0.5 text-dim hover:text-main disabled:opacity-10 opacity-0 group-hover:opacity-100 transition-all">
        <ChevronUp size={10} />
      </button>
      <button onClick={onMoveDown} disabled={isLast} className="p-0.5 text-dim hover:text-main disabled:opacity-10 opacity-0 group-hover:opacity-100 transition-all">
        <ChevronDown size={10} />
      </button>
      <button onClick={onRemove} title="Remove pin" className="p-0.5 text-dim hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
        <X size={10} />
      </button>
    </div>
  );
}

// ============================================================
// ICPreview — mini IC chip visualization
// ============================================================
function ICPreview({
  name,
  description,
  leftPins,
  rightPins,
  height,
}: {
  name: string;
  description: string;
  leftPins: PinDef[];
  rightPins: PinDef[];
  height: number;
}) {
  return (
    <div className="relative flex items-stretch" style={{ minHeight: `${height}px` }}>
      {/* Left pins */}
      <div className="flex flex-col justify-evenly pr-0 z-10" style={{ minHeight: `${height}px` }}>
        {leftPins.map((p) => (
          <div key={p.nodeId} className="flex items-center gap-1">
            <span className="text-[8px] text-emerald-500 font-black font-mono w-10 text-right truncate opacity-70 uppercase">
              {p.label}
            </span>
            <div className="w-4 h-[1.5px] bg-emerald-500/40" />
            <div className="w-2 h-2 rounded-full border-[1.5px] border-emerald-500 bg-app -mr-1 z-10" />
          </div>
        ))}
      </div>

      {/* IC body */}
      <div
        className="relative border-2 border-main/25 rounded-sm bg-app flex items-center justify-center"
        style={{ width: '100px', minHeight: `${height}px` }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-2.5 rounded-b-full bg-main/10" />
        <div className="text-center px-3">
          <div className="text-[9px] font-black text-main uppercase tracking-widest leading-tight" style={{ wordBreak: 'break-word' }}>
            {name}
          </div>
          {description && (
            <div className="text-[7px] text-dim font-bold mt-0.5 uppercase tracking-wider opacity-40">
              {description}
            </div>
          )}
        </div>
      </div>

      {/* Right pins */}
      <div className="flex flex-col justify-evenly pl-0 z-10" style={{ minHeight: `${height}px` }}>
        {rightPins.map((p) => (
          <div key={p.nodeId} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full border-[1.5px] border-blue-500 bg-app -ml-1 z-10" />
            <div className="w-4 h-[1.5px] bg-blue-500/40" />
            <span className="text-[8px] text-blue-500 font-black font-mono w-10 truncate opacity-70 uppercase">
              {p.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
