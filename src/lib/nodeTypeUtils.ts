import type { ComponentType } from '@/types/circuit';

/**
 * Map a ComponentType to its React Flow node type string.
 * Single source of truth — used by circuitStore, importProject, undo/redo.
 */
export function getNodeType(type: ComponentType | string): string {
  switch (type) {
    case 'INPUT':
      return 'inputTerminal';
    case 'OUTPUT':
      return 'outputTerminal';
    case 'CLOCK':
      return 'clockSource';
    case 'LED':
      return 'led';
    case 'SEVEN_SEGMENT':
      return 'sevenSegment';
    case 'HALF_ADDER':
    case 'FULL_ADDER':
    case 'DECODER':
    case 'BCD_TO_7SEG':
    case 'MUX_2TO1':
    case 'MUX_4TO1':
    case 'DEMUX_1TO4':
    case 'SR_LATCH':
    case 'D_FLIPFLOP':
    case 'JK_FLIPFLOP':
    case 'COMPARATOR':
    case 'IC':
      return 'ic';
    case 'JUNCTION':
      return 'junction';
    default:
      return 'gate';
  }
}
