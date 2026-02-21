import GateNode from './GateNode';
import InputNode from './InputNode';
import OutputNode from './OutputNode';
import ClockNode from './ClockNode';
import LEDNode from './LEDNode';
import SevenSegmentNode from './SevenSegmentNode';
import ICNode from './ICNode';
import JunctionNode from './JunctionNode';

export const nodeTypes = {
  gate: GateNode,
  inputTerminal: InputNode,
  outputTerminal: OutputNode,
  clockSource: ClockNode,
  led: LEDNode,
  sevenSegment: SevenSegmentNode,
  ic: ICNode,
  junction: JunctionNode,
};
