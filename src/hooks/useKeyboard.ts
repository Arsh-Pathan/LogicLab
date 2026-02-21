// ============================================================
// useKeyboard — Keyboard shortcuts hook
// ============================================================

import { useEffect, useCallback } from 'react';
import { useCircuitStore } from '../store/circuitStore';
import { useUIStore } from '../store/uiStore';

export function useKeyboard() {
  const undo = useCircuitStore((s) => s.undo);
  const redo = useCircuitStore((s) => s.redo);
  const copySelection = useCircuitStore((s) => s.copySelection);
  const pasteClipboard = useCircuitStore((s) => s.pasteClipboard);
  const removeNodes = useCircuitStore((s) => s.removeNodes);
  const removeEdges = useCircuitStore((s) => s.removeEdges);
  const setSimulationMode = useCircuitStore((s) => s.setSimulationMode);
  const simulationMode = useCircuitStore((s) => s.simulationMode);

  const selectedNodeIds = useUIStore((s) => s.selectedNodeIds);
  const selectedEdgeIds = useUIStore((s) => s.selectedEdgeIds);
  const hideContextMenu = useUIStore((s) => s.hideContextMenu);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't capture if typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isCtrl = e.ctrlKey || e.metaKey;

      // Ctrl+Z — Undo
      if (isCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl+Y or Ctrl+Shift+Z — Redo
      if (isCtrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }

      // Ctrl+C — Copy
      if (isCtrl && e.key === 'c') {
        e.preventDefault();
        copySelection(selectedNodeIds);
      }

      // Ctrl+V — Paste
      if (isCtrl && e.key === 'v') {
        e.preventDefault();
        pasteClipboard({ x: 50, y: 50 });
      }

      // Delete / Backspace — Delete selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeIds.length > 0) {
          removeNodes(selectedNodeIds);
        }
        if (selectedEdgeIds.length > 0) {
          removeEdges(selectedEdgeIds);
        }
      }

      // Escape — close context menu
      if (e.key === 'Escape') {
        hideContextMenu();
      }

      // Space — toggle simulation mode
      if (e.key === ' ' && isCtrl) {
        e.preventDefault();
        setSimulationMode(simulationMode === 'live' ? 'frozen' : 'live');
      }
    },
    [
      undo,
      redo,
      copySelection,
      pasteClipboard,
      removeNodes,
      removeEdges,
      selectedNodeIds,
      selectedEdgeIds,
      hideContextMenu,
      setSimulationMode,
      simulationMode,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
