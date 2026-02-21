import { DragEvent, useCallback } from 'react';
import {
  Cpu,
  ToggleLeft,
  Monitor,
  Clock,
  Lightbulb,
  Hash,
  CircuitBoard,
  Minus,
} from 'lucide-react';
import { ComponentType } from '../../../types/circuit';
import { useUIStore } from '../../../store/uiStore';
import { useCircuitStore } from '../../../store/circuitStore';

interface PaletteItem {
  type: ComponentType;
  label: string;
  icon: React.ReactNode;
  category: string;
  icId?: string;
}

const PALETTE_ITEMS: PaletteItem[] = [
  // Gates
  { type: 'AND', label: 'AND', icon: <Cpu size={16} />, category: 'Logic Gates' },
  { type: 'OR', label: 'OR', icon: <Cpu size={16} />, category: 'Logic Gates' },
  { type: 'NOT', label: 'NOT', icon: <Cpu size={16} />, category: 'Logic Gates' },
  { type: 'NAND', label: 'NAND', icon: <Cpu size={16} />, category: 'Logic Gates' },
  { type: 'NOR', label: 'NOR', icon: <Cpu size={16} />, category: 'Logic Gates' },
  { type: 'XOR', label: 'XOR', icon: <Cpu size={16} />, category: 'Logic Gates' },
  { type: 'XNOR', label: 'XNOR', icon: <Cpu size={16} />, category: 'Logic Gates' },
  { type: 'BUFFER', label: 'BUFFER', icon: <Minus size={16} />, category: 'Logic Gates' },
  // Terminals
  { type: 'INPUT', label: 'Input', icon: <ToggleLeft size={16} />, category: 'Terminals' },
  { type: 'OUTPUT', label: 'Output', icon: <Monitor size={16} />, category: 'Terminals' },
  { type: 'CLOCK', label: 'Clock', icon: <Clock size={16} />, category: 'Terminals' },
  // Displays
  { type: 'LED', label: 'LED', icon: <Lightbulb size={16} />, category: 'Displays' },
  { type: 'SEVEN_SEGMENT', label: '7-Segment', icon: <Hash size={16} />, category: 'Displays' },
  // Built-in ICs
  { type: 'HALF_ADDER', label: 'Half Adder', icon: <CircuitBoard size={16} />, category: 'Built-in ICs' },
  { type: 'FULL_ADDER', label: 'Full Adder', icon: <CircuitBoard size={16} />, category: 'Built-in ICs' },
  { type: 'DECODER', label: '2:4 Decoder', icon: <CircuitBoard size={16} />, category: 'Built-in ICs' },
];

function PaletteItemComponent({ item }: { item: PaletteItem }) {
  const setDragging = useUIStore((s: any) => s.setDragging);

  const onDragStart = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData('application/logiclab-type', item.type);
      if (item.icId) {
        event.dataTransfer.setData('application/logiclab-ic-id', item.icId);
      }
      event.dataTransfer.effectAllowed = 'move';
      setDragging(true, item.type);
    },
    [item.type, item.icId, setDragging]
  );

  const onDragEnd = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-grab active:cursor-grabbing
        bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-blue-500/30
        transition-all duration-200 select-none group"
    >
      <div className="text-white/30 group-hover:text-blue-400 transition-colors">
        {item.icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">
        {item.label}
      </span>
    </div>
  );
}

export default function ComponentPalette() {
  const showPalette = useUIStore((s: any) => s.showComponentPalette);
  const customICs = useCircuitStore((s: any) => s.customICs);

  if (!showPalette) return null;

  const customItems: PaletteItem[] = customICs.map((ic: any) => ({
    type: 'IC' as ComponentType,
    label: ic.name,
    icon: <CircuitBoard size={16} />,
    category: 'Custom Circuits',
    icId: ic.id,
  }));

  const allItems = [...PALETTE_ITEMS, ...customItems];
  const categories = [...new Set(allItems.map((item) => item.category))];

  return (
    <div className="w-56 bg-panel border-r border-border-muted flex flex-col overflow-hidden transition-theme">
      <div className="px-5 py-4 flex items-center justify-between shrink-0">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted">Library</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide pb-10">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-[9px] font-black uppercase tracking-widest text-muted/60 mb-3 px-1">
              {category}
            </h3>
            <div className="space-y-1.5 px-0.5">
              {allItems.filter((item) => item.category === category).map((item, i) => (
                <PaletteItemComponent key={`${item.type}-${item.icId ?? i}`} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
