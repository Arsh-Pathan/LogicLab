// ============================================================
// Context Menu — Right-click context menu
// ============================================================

import { useCallback, useEffect, useRef } from 'react';
import {
  RotateCw,
  Pencil,
  Trash2,
  Copy,
  Plus,
  Minus,
  Search,
} from 'lucide-react';
import { useUIStore } from '../../../store/uiStore';
import { useCircuitStore } from '../../../store/circuitStore';
import { isGateType } from '../../../engine/gates';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
}

function MenuItem({ icon, label, onClick, variant = 'default', disabled }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-md transition-colors
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
        ${variant === 'danger'
          ? 'text-red-400 hover:bg-red-900/30'
          : 'text-gray-300 hover:bg-gray-700/50'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

export default function ContextMenu() {
  const menuRef = useRef<HTMLDivElement>(null);

  const contextMenu = useUIStore((s) => s.contextMenu);
  const hideContextMenu = useUIStore((s) => s.hideContextMenu);
  const showRenameDialog = useUIStore((s) => s.showRenameDialog);
  const showPinInspector = useUIStore((s) => s.showPinInspector);

  const nodes = useCircuitStore((s) => s.nodes);
  const rotateNode = useCircuitStore((s) => s.rotateNode);
  const removeNodes = useCircuitStore((s) => s.removeNodes);
  const removeEdges = useCircuitStore((s) => s.removeEdges);
  const copySelection = useCircuitStore((s) => s.copySelection);
  const addInputToGate = useCircuitStore((s) => s.addInputToGate);
  const removeInputFromGate = useCircuitStore((s) => s.removeInputFromGate);

  const { visible, x, y, nodeId, edgeId } = contextMenu;

  const node = nodeId ? nodes.find((n) => n.id === nodeId) : null;
  const isGate = node ? isGateType(node.data.type) : false;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        hideContextMenu();
      }
    };

    if (visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [visible, hideContextMenu]);

  const handleRotate = useCallback(() => {
    if (nodeId) rotateNode(nodeId);
    hideContextMenu();
  }, [nodeId, rotateNode, hideContextMenu]);

  const handleRename = useCallback(() => {
    if (nodeId && node) {
      showRenameDialog(nodeId, node.data.label);
    }
    hideContextMenu();
  }, [nodeId, node, showRenameDialog, hideContextMenu]);

  const handleDelete = useCallback(() => {
    if (nodeId) removeNodes([nodeId]);
    if (edgeId) removeEdges([edgeId]);
    hideContextMenu();
  }, [nodeId, edgeId, removeNodes, removeEdges, hideContextMenu]);

  const handleCopy = useCallback(() => {
    if (nodeId) copySelection([nodeId]);
    hideContextMenu();
  }, [nodeId, copySelection, hideContextMenu]);

  const handleAddInput = useCallback(() => {
    if (nodeId) addInputToGate(nodeId);
    hideContextMenu();
  }, [nodeId, addInputToGate, hideContextMenu]);

  const handleRemoveInput = useCallback(() => {
    if (nodeId) removeInputFromGate(nodeId);
    hideContextMenu();
  }, [nodeId, removeInputFromGate, hideContextMenu]);

  const handleInspect = useCallback(() => {
    if (nodeId) showPinInspector(nodeId);
    hideContextMenu();
  }, [nodeId, showPinInspector, hideContextMenu]);

  if (!visible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-gray-900 border border-gray-700 rounded-lg p-1 min-w-[160px]"
      style={{ left: x, top: y }}
    >
      {nodeId && (
        <>
          <MenuItem icon={<RotateCw size={14} />} label="Rotate 90°" onClick={handleRotate} />
          <MenuItem icon={<Pencil size={14} />} label="Rename" onClick={handleRename} />
          <MenuItem icon={<Search size={14} />} label="Inspect Pins" onClick={handleInspect} />
          <MenuItem icon={<Copy size={14} />} label="Copy" onClick={handleCopy} />
          {isGate && (
            <>
              <div className="h-px bg-gray-700 my-1" />
              <MenuItem icon={<Plus size={14} />} label="Add Input" onClick={handleAddInput} />
              <MenuItem
                icon={<Minus size={14} />}
                label="Remove Input"
                onClick={handleRemoveInput}
                disabled={node ? node.data.inputs.length <= 1 : true}
              />
            </>
          )}
          <div className="h-px bg-gray-700 my-1" />
          <MenuItem icon={<Trash2 size={14} />} label="Delete" onClick={handleDelete} variant="danger" />
        </>
      )}
      {edgeId && !nodeId && (
        <MenuItem icon={<Trash2 size={14} />} label="Delete Wire" onClick={handleDelete} variant="danger" />
      )}
      {!nodeId && !edgeId && (
        <div className="px-3 py-2 text-xs text-gray-500">No actions available</div>
      )}
    </div>
  );
}
