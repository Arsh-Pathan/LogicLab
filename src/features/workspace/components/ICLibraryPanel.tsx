import { useState } from 'react';
import { Package, Trash2, Edit3, MoreVertical } from 'lucide-react';
import { useCircuitStore } from '../../../store/circuitStore';
import { useUIStore } from '../../../store/uiStore';
import { ComponentType } from '../../../types/circuit';

const COMMON_ICS = [
  { id: 'common-half-adder', name: 'Half Adder', type: 'HALF_ADDER' },
  { id: 'common-full-adder', name: 'Full Adder', type: 'FULL_ADDER' },
  { id: 'common-decoder', name: 'Decoder', type: 'DECODER' },
  { id: 'common-mux-2to1', name: '2:1 Multiplexer', type: 'MUX_2TO1' },
  { id: 'common-mux-4to1', name: '4:1 Multiplexer', type: 'MUX_4TO1' },
  { id: 'common-demux-1to4', name: '1:4 Demultiplexer', type: 'DEMUX_1TO4' },
  { id: 'common-sr-latch', name: 'SR Latch', type: 'SR_LATCH' },
  { id: 'common-d-flipflop', name: 'D Flip-Flop', type: 'D_FLIPFLOP' },
  { id: 'common-jk-flipflop', name: 'JK Flip-Flop', type: 'JK_FLIPFLOP' },
  { id: 'common-comparator', name: '1-Bit Comparator', type: 'COMPARATOR' },
  { id: 'common-bcd-7seg', name: 'BCD to 7-Segment', type: 'BCD_TO_7SEG' },
];

export default function ICLibraryPanel() {
  const customICs = useCircuitStore((s: any) => s.customICs);
  const addNode = useCircuitStore((s: any) => s.addNode);
  const deleteIC = useCircuitStore((s: any) => s.deleteIC);
  const renameIC = useCircuitStore((s: any) => s.renameIC);
  const setDragging = useUIStore((s: any) => s.setDragging);
  const showComponentPalette = useUIStore((s: any) => s.showComponentPalette);
  
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!showComponentPalette) return null;

  const handleDeleteIC = (e: React.MouseEvent, icId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (window.confirm('Delete this custom IC? This cannot be undone.')) {
      if (deleteIC) {
        deleteIC(icId);
      } else {
        // Fallback: remove from customICs array directly via store
        const store = useCircuitStore.getState() as any;
        if (store.customICs) {
          store.customICs = store.customICs.filter((ic: any) => ic.id !== icId);
          useCircuitStore.setState({ customICs: store.customICs });
        }
      }
    }
    setMenuOpenId(null);
  };

  const handleStartRename = (e: React.MouseEvent, ic: any) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingId(ic.id);
    setEditName(ic.name);
    setMenuOpenId(null);
  };

  const handleSaveRename = (icId: string) => {
    if (editName.trim()) {
      if (renameIC) {
        renameIC(icId, editName.trim());
      } else {
        // Fallback: rename directly via store
        const store = useCircuitStore.getState() as any;
        if (store.customICs) {
          const updated = store.customICs.map((ic: any) =>
            ic.id === icId ? { ...ic, name: editName.trim() } : ic
          );
          useCircuitStore.setState({ customICs: updated });
        }
      }
    }
    setEditingId(null);
    setEditName('');
  };

  return (
    <div
      className="h-full flex flex-col relative transition-all w-72 shrink-0 z-10 overflow-hidden"
      style={{
        borderRight: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-panel)',
        boxShadow: 'var(--shadow-lg)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <h2
          className="text-sm font-semibold"
          style={{ color: 'var(--text-main)' }}
        >
          IC Library
        </h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          Drag to deploy on canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Common ICs */}
        <div>
          <h3
            className="text-xs font-semibold uppercase tracking-wider mb-3 px-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Standard ICs
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {COMMON_ICS.map((ic) => (
              <button
                key={ic.id}
                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-all cursor-grab active:cursor-grabbing active:scale-95"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget.style as any).borderColor = 'var(--accent-blue)';
                  (e.currentTarget.style as any).backgroundColor = 'var(--accent-blue-light)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget.style as any).borderColor = 'var(--border-subtle)';
                  (e.currentTarget.style as any).backgroundColor = 'var(--bg-surface)';
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/logiclab-type', ic.type);
                  e.dataTransfer.effectAllowed = 'move';
                  setDragging(true, ic.type as ComponentType);
                }}
                onClick={() => addNode(ic.type as ComponentType, { x: 0, y: 0 }, ic.name, undefined)}
              >
                <Package size={18} style={{ color: 'var(--accent-blue)' }} />
                <span
                  className="text-[10px] font-medium text-center leading-tight"
                  style={{ color: 'var(--text-dim)' }}
                >
                  {ic.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom ICs */}
        <div>
          <h3
            className="text-xs font-semibold uppercase tracking-wider mb-3 px-1"
            style={{ color: 'var(--text-muted)' }}
          >
            Custom ICs ({customICs.length})
          </h3>
          {customICs.length === 0 ? (
            <div
              className="text-center p-6 rounded-lg"
              style={{
                border: '2px dashed var(--border-main)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <Package size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                No custom ICs yet.
              </p>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
                Select components & package them as an IC
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {customICs.map((ic: any) => (
                <div
                  key={ic.id}
                  className="relative group flex items-center gap-3 p-3 rounded-lg transition-all cursor-grab active:cursor-grabbing"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget.style as any).borderColor = 'var(--accent-blue)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget.style as any).borderColor = 'var(--border-subtle)';
                  }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/logiclab-type', 'IC');
                    e.dataTransfer.setData('application/logiclab-ic-id', ic.id);
                    e.dataTransfer.effectAllowed = 'move';
                    setDragging(true, 'IC');
                  }}
                  onClick={() => {
                    if (!editingId) {
                      addNode('IC', { x: 0, y: 0 }, ic.name, ic.id);
                    }
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }}
                  >
                    <Package size={16} />
                  </div>
                  
                  {editingId === ic.id ? (
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => handleSaveRename(ic.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(ic.id);
                        if (e.key === 'Escape') { setEditingId(null); setEditName(''); }
                      }}
                      className="flex-1 text-sm font-medium bg-transparent outline-none min-w-0 px-1"
                      style={{
                        color: 'var(--text-main)',
                        borderBottom: '2px solid var(--accent-blue)',
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex-1 min-w-0">
                      <span
                        className="text-sm font-medium truncate block"
                        style={{ color: 'var(--text-main)' }}
                      >
                        {ic.name}
                      </span>
                      {ic.description && (
                        <span
                          className="text-[10px] truncate block"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {ic.description}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Menu Button */}
                  {editingId !== ic.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setMenuOpenId(menuOpenId === ic.id ? null : ic.id);
                      }}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => {
                        (e.currentTarget.style as any).backgroundColor = 'var(--bg-hover)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget.style as any).backgroundColor = 'transparent';
                      }}
                    >
                      <MoreVertical size={14} />
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {menuOpenId === ic.id && (
                    <div
                      className="absolute top-full right-2 mt-1 z-50 rounded-lg overflow-hidden"
                      style={{
                        backgroundColor: 'var(--bg-panel)',
                        border: '1px solid var(--border-main)',
                        boxShadow: 'var(--shadow-xl)',
                        minWidth: '140px',
                      }}
                    >
                      <button
                        onClick={(e) => handleStartRename(e, ic)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left"
                        style={{ color: 'var(--text-dim)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Edit3 size={14} />
                        Rename
                      </button>
                      <button
                        onClick={(e) => handleDeleteIC(e, ic.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left"
                        style={{ color: 'var(--accent-red)' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--accent-red-light)')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
