import { useState, useCallback, useMemo } from 'react';
import { X, Package, ArrowRight, Save, ChevronUp, ChevronDown } from 'lucide-react';
import { useUIStore } from '../../../store/uiStore';
import { useCircuitStore } from '../../../store/circuitStore';

export default function ICBuilderModal() {
  const showICBuilder = useUIStore((s: any) => s.showICBuilder);
  const setShowICBuilder = useUIStore((s: any) => s.setShowICBuilder);
  const selectedNodeIds = useUIStore((s: any) => s.selectedNodeIds);

  const nodes = useCircuitStore((s: any) => s.nodes);
  const createIC = useCircuitStore((s: any) => s.createIC);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [inputs, setInputs] = useState<string[]>([]);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [inputLabels, setInputLabels] = useState<Record<string, string>>({});
  const [outputLabels, setOutputLabels] = useState<Record<string, string>>({});

  const selectedNodes = useMemo(() => 
    nodes.filter((n: any) => selectedNodeIds.includes(n.id)),
  [nodes, selectedNodeIds]);

  const potentialPorts = useMemo(() =>
    selectedNodes.filter((n: any) => n.data.type === 'INPUT' || n.data.type === 'OUTPUT' || n.data.type === 'LED'),
  [selectedNodes]);

  const handleSave = useCallback(() => {
    if (!name.trim()) return;
    
    const inputMarkers = inputs.map(id => ({ id, label: inputLabels[id] || '' }));
    const outputMarkers = outputs.map(id => ({ id, label: outputLabels[id] || '' }));
    
    createIC(name, description, selectedNodeIds, inputMarkers, outputMarkers);
    setShowICBuilder(false);
    setName('');
    setDescription('');
    setStep(1);
    setInputs([]);
    setOutputs([]);
    setInputLabels({});
    setOutputLabels({});
  }, [name, selectedNodeIds, inputs, outputs, inputLabels, outputLabels, createIC, setShowICBuilder]);

  const toggleInput = (id: string) => {
    setInputs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleOutput = (id: string) => {
    setOutputs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const moveInput = (id: string, dir: -1 | 1) => {
    setInputs(prev => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const next = [...prev];
      if (dir === -1 && idx > 0) {
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      } else if (dir === 1 && idx < next.length - 1) {
        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      }
      return next;
    });
  };

  const moveOutput = (id: string, dir: -1 | 1) => {
    setOutputs(prev => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const next = [...prev];
      if (dir === -1 && idx > 0) {
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      } else if (dir === 1 && idx < next.length - 1) {
        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
      }
      return next;
    });
  };

  const sortedPotentialInputs = useMemo(() => {
    const arr = potentialPorts.filter((n: any) => n.data.type === 'INPUT');
    return arr.sort((a: any, b: any) => {
      const aIdx = inputs.indexOf(a.id);
      const bIdx = inputs.indexOf(b.id);
      if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
      if (aIdx >= 0) return -1;
      if (bIdx >= 0) return 1;
      return 0;
    });
  }, [potentialPorts, inputs]);

  const sortedPotentialOutputs = useMemo(() => {
    const arr = potentialPorts.filter((n: any) => n.data.type === 'OUTPUT' || n.data.type === 'LED');
    return arr.sort((a: any, b: any) => {
      const aIdx = outputs.indexOf(a.id);
      const bIdx = outputs.indexOf(b.id);
      if (aIdx >= 0 && bIdx >= 0) return aIdx - bIdx;
      if (aIdx >= 0) return -1;
      if (bIdx >= 0) return 1;
      return 0;
    });
  }, [potentialPorts, outputs]);

  if (!showICBuilder) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="text-blue-400" size={20} />
            <h2 className="text-lg font-bold text-white">Custom IC Builder</h2>
          </div>
          <button onClick={() => setShowICBuilder(false)} className="text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {selectedNodeIds.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-700 mb-4" />
              <p className="text-gray-400">No components selected.</p>
              <p className="text-sm text-gray-500 mt-2">Close this modal, select the components you want to group, and try again.</p>
            </div>
          ) : step === 1 ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">IC Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 4-Bit Adder"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">IC Subtitle (Optional)</label>
                  <input 
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., ALU Module"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Selected Components ({selectedNodeIds.length})</h3>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                  {selectedNodes.map((n: any) => (
                    <div key={n.id} className="bg-gray-800 border border-gray-700 rounded p-2 text-[10px] text-gray-400">
                      <div className="font-bold text-gray-200 truncate">{n.data.label}</div>
                      <div>{n.data.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 flex gap-3">
                <div className="bg-blue-500/20 p-2 rounded-full h-fit">
                  <ArrowRight size={16} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-300">Port Mapping</h4>
                  <p className="text-xs text-blue-400/80 mt-1">In the next step, you'll choose which Input/Output terminals will become the external pins of your IC.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Define External Pins</h3>
                <p className="text-xs text-gray-500 mb-4">Select the terminals that will be visible on the outside of the IC.</p>
                
                <div className="space-y-4">
                  {/* Inputs */}
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Inputs</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sortedPotentialInputs.map((n: any) => (
                        <div 
                          key={n.id}
                          className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                            inputs.includes(n.id) 
                              ? 'bg-emerald-900/20 border-emerald-500 text-emerald-400' 
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex flex-col gap-2 w-full pr-4">
                            <span 
                              className="text-xs font-medium cursor-pointer" 
                              onClick={() => toggleInput(n.id)}
                            >
                              {n.data.label}
                            </span>
                            {inputs.includes(n.id) && (
                              <div className="flex flex-col gap-2">
                                <input 
                                  type="text"
                                  placeholder="Custom Label..."
                                  value={inputLabels[n.id] || ''}
                                  onChange={(e) => setInputLabels(prev => ({ ...prev, [n.id]: e.target.value }))}
                                  className="w-full bg-black/30 border border-emerald-500/30 rounded px-2 py-1 text-xs text-white outline-none focus:border-emerald-500 transition-colors"
                                />
                                <div className="flex gap-1 mt-1">
                                  <button onClick={() => moveInput(n.id, -1)} disabled={inputs.indexOf(n.id) === 0} className="p-1 rounded bg-black/30 hover:bg-black/50 disabled:opacity-30 border border-emerald-500/30"><ChevronUp size={12}/></button>
                                  <button onClick={() => moveInput(n.id, 1)} disabled={inputs.indexOf(n.id) === inputs.length - 1} className="p-1 rounded bg-black/30 hover:bg-black/50 disabled:opacity-30 border border-emerald-500/30"><ChevronDown size={12}/></button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div 
                            className={`w-4 h-4 shrink-0 rounded-full border-2 cursor-pointer mt-0.5 ${inputs.includes(n.id) ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`}
                            onClick={() => toggleInput(n.id)}
                          />
                        </div>
                      ))}
                      {potentialPorts.filter((n: any) => n.data.type === 'INPUT').length === 0 && (
                        <div className="col-span-2 text-center py-4 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg text-xs text-gray-600">
                          No input terminals selected
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Outputs */}
                  <div>
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Outputs</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {sortedPotentialOutputs.map((n: any) => (
                        <div 
                          key={n.id}
                          className={`flex items-start justify-between p-3 rounded-lg border transition-all ${
                            outputs.includes(n.id) 
                              ? 'bg-blue-900/20 border-blue-500 text-blue-400' 
                              : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex flex-col gap-2 w-full pr-4">
                            <span 
                              className="text-xs font-medium cursor-pointer" 
                              onClick={() => toggleOutput(n.id)}
                            >
                              {n.data.label}
                            </span>
                            {outputs.includes(n.id) && (
                              <div className="flex flex-col gap-2">
                                <input 
                                  type="text"
                                  placeholder="Custom Label..."
                                  value={outputLabels[n.id] || ''}
                                  onChange={(e) => setOutputLabels(prev => ({ ...prev, [n.id]: e.target.value }))}
                                  className="w-full bg-black/30 border border-blue-500/30 rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500 transition-colors"
                                />
                                <div className="flex gap-1 mt-1">
                                  <button onClick={() => moveOutput(n.id, -1)} disabled={outputs.indexOf(n.id) === 0} className="p-1 rounded bg-black/30 hover:bg-black/50 disabled:opacity-30 border border-blue-500/30"><ChevronUp size={12}/></button>
                                  <button onClick={() => moveOutput(n.id, 1)} disabled={outputs.indexOf(n.id) === outputs.length - 1} className="p-1 rounded bg-black/30 hover:bg-black/50 disabled:opacity-30 border border-blue-500/30"><ChevronDown size={12}/></button>
                                </div>
                              </div>
                            )}
                          </div>
                          <div 
                            className={`w-4 h-4 shrink-0 rounded-full border-2 cursor-pointer mt-0.5 ${outputs.includes(n.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}
                            onClick={() => toggleOutput(n.id)}
                          />
                        </div>
                      ))}
                      {potentialPorts.filter((n: any) => n.data.type === 'OUTPUT' || n.data.type === 'LED').length === 0 && (
                        <div className="col-span-2 text-center py-4 bg-gray-800/50 border border-dashed border-gray-700 rounded-lg text-xs text-gray-600">
                          No output terminals selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800 flex justify-between">
          <button 
            onClick={() => setShowICBuilder(false)}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex gap-2">
            {step === 1 ? (
              <button 
                onClick={() => setStep(2)}
                disabled={selectedNodeIds.length === 0 || !name.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-50 text-sm font-bold disabled:opacity-40"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button 
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Back
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 text-sm font-bold"
                >
                  <Save size={16} /> Create IC
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
