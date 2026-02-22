import { Package } from 'lucide-react';
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
  const setDragging = useUIStore((s: any) => s.setDragging);
  const showComponentPalette = useUIStore((s: any) => s.showComponentPalette);

  if (!showComponentPalette) return null;

  return (
    <div className="h-full flex flex-col relative transition-theme border-r border-border-main bg-panel w-72 shrink-0 z-10 shadow-[5px_0_20px_rgba(0,0,0,0.1)]">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border-main shrink-0">
        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-dim">IC Library</h2>
        <p className="text-[9px] text-muted mt-2 uppercase tracking-wide">Drag to deploy</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        
        {/* Common ICs */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-4 opacity-50">Common ICs</h3>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_ICS.map((ic) => (
              <button
                key={ic.id}
                className="bg-app border border-border-main p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-main hover:text-main hover:bg-neutral-50 transition-all group active:scale-95 cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('application/logiclab-type', ic.type);
                  e.dataTransfer.effectAllowed = 'move';
                  setDragging(true, ic.type as ComponentType);
                }}
                onClick={() => addNode(ic.type as ComponentType, { x: 0, y: 0 }, ic.name, undefined)}
              >
                <Package size={20} className="text-dim group-hover:text-blue-500 transition-colors" />
                <span className="text-[9px] font-bold text-dim group-hover:text-main uppercase text-center">{ic.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom ICs */}
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted mb-4 opacity-50">Custom ICs</h3>
          {customICs.length === 0 ? (
            <div className="text-center p-6 border border-dashed border-border-main rounded-xl">
              <span className="text-[9px] font-bold uppercase tracking-widest text-muted">No custom ICs yet. Build one from components!</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {customICs.map((ic: any) => (
                <button
                  key={ic.id}
                  className="bg-app border border-border-main p-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-main hover:text-main hover:bg-neutral-50 transition-all group active:scale-95 cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/logiclab-type', 'IC');
                    e.dataTransfer.setData('application/logiclab-ic-id', ic.id);
                    e.dataTransfer.effectAllowed = 'move';
                    setDragging(true, 'IC');
                  }}
                  onClick={() => addNode('IC', { x: 0, y: 0 }, ic.name, ic.id)}
                >
                  <Package size={20} className="text-blue-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-[9px] font-bold text-dim group-hover:text-main uppercase text-center">{ic.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
