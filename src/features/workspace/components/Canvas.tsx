// ============================================================
// Canvas — Main React Flow canvas component
// ============================================================

import { useCallback, useRef, DragEvent } from 'react';
import ReactFlow, {
  Background,
  Controls,
  BackgroundVariant,
  ReactFlowInstance,
  SelectionMode,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { nodeTypes } from '../../../nodes/nodeTypes';
import { edgeTypes } from '../../../edges/edgeTypes';
import { useCircuitStore } from '../../../store/circuitStore';
import { useUIStore } from '../../../store/uiStore';
import { ComponentType } from '../../../types/circuit';

// Static objects — defined once at module level, never recreated
const defaultEdgeOptions = { type: 'wire', animated: false, style: { strokeWidth: 2 } } as const;
const connectionLineStyle = { stroke: '#3b82f6', strokeWidth: 2.5, strokeLinecap: 'round' as const, opacity: 0.6 };
const controlsStyle = { marginBottom: '112px', marginLeft: '24px' };

export default function Canvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const nodes = useCircuitStore((s: any) => s.nodes);
  const edges = useCircuitStore((s: any) => s.edges);
  const onNodesChange = useCircuitStore((s: any) => s.onNodesChange);
  const onEdgesChange = useCircuitStore((s: any) => s.onEdgesChange);
  const onConnect = useCircuitStore((s: any) => s.onConnect);
  const addNode = useCircuitStore((s: any) => s.addNode);
  const splitEdge = useCircuitStore((s: any) => s.splitEdge);

  const snapToGrid = useUIStore((s: any) => s.snapToGrid);
  const gridSize = useUIStore((s: any) => s.gridSize);
  const showContextMenu = useUIStore((s: any) => s.showContextMenu);
  const hideContextMenu = useUIStore((s: any) => s.hideContextMenu);
  const setSelectedNodes = useUIStore((s: any) => s.setSelectedNodes);
  const setZoomLevel = useUIStore((s: any) => s.setZoomLevel);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    reactFlowInstance.current = instance;
    setZoomLevel(instance.getZoom());
  }, [setZoomLevel]);

  const onMove = useCallback((_event: any, viewport: { zoom: number }) => {
    setZoomLevel(viewport.zoom);
  }, [setZoomLevel]);

  const onDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const typeStr = event.dataTransfer.getData('application/logiclab-type');
      if (!typeStr || !reactFlowInstance.current) return;

      const type = typeStr as ComponentType;
      const icId = event.dataTransfer.getData('application/logiclab-ic-id');
      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position, undefined, icId || undefined);
    },
    [addNode]
  );


  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      showContextMenu(event.clientX, event.clientY);
    },
    [showContextMenu]
  );

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: { id: string }) => {
      event.preventDefault();
      showContextMenu(event.clientX, event.clientY, node.id);
    },
    [showContextMenu]
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: { id: string }) => {
      event.preventDefault();
      showContextMenu(event.clientX, event.clientY, undefined, edge.id);
    },
    [showContextMenu]
  );

  const onPaneClick = useCallback(() => {
    hideContextMenu();
  }, [hideContextMenu]);

  const onEdgeDoubleClick = useCallback((event: React.MouseEvent, edge: { id: string }) => {
    if (!reactFlowInstance.current) return;
    const position = reactFlowInstance.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    splitEdge(edge.id, position);
  }, [splitEdge]);

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: { id: string }[] }) => {
      setSelectedNodes(selectedNodes.map((n) => n.id));
    },
    [setSelectedNodes]
  );

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full bg-canvas transition-theme">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onMove={onMove}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onPaneContextMenu={onPaneContextMenu}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onEdgeDoubleClick={onEdgeDoubleClick}
        onPaneClick={onPaneClick}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid={snapToGrid}
        snapGrid={[gridSize, gridSize]}
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        panOnScroll={true}
        panOnDrag={[1, 2]}
        multiSelectionKeyCode="Shift"
        deleteKeyCode="Delete"
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={connectionLineStyle}
        className="react-flow-premium"
        proOptions={{ hideAttribution: true }}
      >
        {/* Subtle grid like the image */}
        <Background
          variant={BackgroundVariant.Dots}
          gap={gridSize}
          size={1}
          color="var(--grid-dots)"
        />

        <Controls
          className="!bg-panel !border-border-main !rounded-2xl !backdrop-blur-md opacity-80 [&>button]:!bg-transparent [&>button]:!border-border-muted [&>button]:!text-dim [&>button:hover]:!text-main"
          position="bottom-left"
          style={controlsStyle}
        />
      </ReactFlow>
    </div>
  );
}
