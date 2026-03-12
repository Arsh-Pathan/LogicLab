import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ChevronRight
} from 'lucide-react';

const DOCS_STRUCTURE = [
  {
    category: 'Getting Started',
    items: [
      { 
        id: 'overview', 
        title: 'Overview',
        content: `LogicLab is a free, open-source digital logic circuit simulator that runs entirely in your browser. It allows you to design, test, and learn about digital circuits using an intuitive visual interface.

**Key Capabilities:**
- Drag-and-drop circuit design on an infinite canvas
- Real-time simulation with instant signal propagation
- Custom IC (Integrated Circuit) packaging
- Community sharing and collaboration
- Dark mode and light mode support

LogicLab is designed for students learning digital electronics, educators creating interactive lessons, and hobbyists exploring circuit design.`
      },
      { 
        id: 'quickstart', 
        title: 'Quick Start Guide',
        content: `Follow these steps to build your first circuit:

**Step 1: Open the Simulator**
Navigate to the Simulator page from the top navigation bar. You'll see an empty canvas with a toolbar on the left.

**Step 2: Add Components**
Click the \`+\` button in the toolbar to open the component palette. Drag an INPUT switch and an AND gate onto the canvas.

**Step 3: Connect Components**
Click on an output port (right side of a component) and drag to an input port (left side) to create a wire connection.

**Step 4: Simulate**
Toggle the INPUT switches by clicking on them. Watch the signal propagate through your circuit in real-time.

**Step 5: Save Your Work**  
Click the save button in the toolbar to save your circuit. You can also export it as JSON for sharing.`
      },
      { 
        id: 'interface', 
        title: 'Interface Guide',
        content: `The LogicLab simulator interface consists of several key areas:

**Canvas** — The main design area where you place and connect components. Supports zoom (scroll), pan (middle-click drag), and selection.

**Toolbar** — Located on the left side, provides quick access to common gates, tools, and actions like save/load.

**Component Palette** — Opened via the \`+\` button, shows all available logic gates and ICs organized by category.

**Properties Panel** — Shows details about the currently selected component, including its type, label, and current signal values.

**Status Bar** — At the bottom, shows the current zoom level, component count, and simulation status.`
      },
    ]
  },
  {
    category: 'Logic Gates',
    items: [
      { 
        id: 'basic-gates', 
        title: 'Basic Gates (AND, OR, NOT)',
        content: `These are the fundamental building blocks of all digital circuits.

**AND Gate**
Outputs 1 (HIGH) only when ALL inputs are 1.
| A | B | Output |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

**OR Gate**
Outputs 1 (HIGH) when ANY input is 1.
| A | B | Output |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

**NOT Gate (Inverter)**
Outputs the opposite of its input.
| Input | Output |
|-------|--------|
| 0 | 1 |
| 1 | 0 |`
      },
      { 
        id: 'compound-gates', 
        title: 'Compound Gates (NAND, NOR, XOR)',
        content: `Compound gates combine basic operations for more complex logic.

**NAND Gate (NOT-AND)**
The universal gate — any other gate can be built from NAND gates.
Outputs 0 only when ALL inputs are 1.

**NOR Gate (NOT-OR)**
Another universal gate. Outputs 1 only when ALL inputs are 0.

**XOR Gate (Exclusive OR)**
Outputs 1 when inputs DIFFER. Essential for arithmetic circuits.
| A | B | Output |
|---|---|--------|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

**XNOR Gate (Exclusive NOR)**
Outputs 1 when inputs are the SAME. Used in comparator circuits.`
      },
      { 
        id: 'buffers', 
        title: 'Buffers & Special Gates',
        content: `**BUFFER**
Simply passes the input to the output without modification. Useful for signal routing and debugging.

**CLOCK**
Generates a periodic square wave signal that alternates between 0 and 1 at a configurable frequency. Essential for sequential circuits.

**Tri-State Buffer**
Outputs the input signal when enabled, but enters a high-impedance state (Z) when disabled. Used in bus architectures.`
      },
    ]
  },
  {
    category: 'Circuit Design',
    items: [
      { 
        id: 'ic-design', 
        title: 'Custom IC Packaging',
        content: `One of LogicLab's powerful features is the ability to package sub-circuits into reusable ICs.

**Creating a Custom IC:**
1. Build and test your sub-circuit on the canvas
2. Select all the components you want to include
3. Click the "Package IC" button in the toolbar
4. The IC Builder opens — click on INPUT/OUTPUT terminals to define pins
5. Name your IC and save it

**Using Custom ICs:**
Once created, your custom IC appears in the IC Library panel. You can drag it onto the canvas like any other component.

**Benefits:**
- Reduces visual complexity of large designs
- Creates reusable building blocks
- Enables hierarchical design methodology
- ICs can contain other ICs (nested hierarchy)`
      },
      { 
        id: 'wiring', 
        title: 'Wiring & Connections',
        content: `**Creating Connections:**
Click on a source port (output) and drag to a target port (input). A smooth bezier curve will be drawn.

**Wire Colors:**
- Gray: No signal (disconnected or idle)
- Blue: Active HIGH signal (1)
- Dim: Active LOW signal (0)

**Tips:**
- You can connect one output to multiple inputs (fan-out)
- Each input can only have one connection
- Click on a wire and press Delete to remove it
- Use the Junction node to branch connections`
      },
      { 
        id: 'saving', 
        title: 'Saving & Sharing',
        content: `**Local Save:**
Your circuits are saved to your browser's local storage. Click the save icon in the toolbar to save your current project.

**Export as JSON:**
Export your circuit as a JSON file that can be shared with others or imported later.

**Community Sharing:**
Publish your circuit to the community gallery so other users can discover, learn from, and fork your designs.

**Import:**
Import circuits from JSON files shared by others. The circuit's components, connections, and custom ICs will be fully restored.`
      },
    ]
  },
];

export default function DocsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('overview');

  const activeItem = DOCS_STRUCTURE.flatMap(g => g.items).find(i => i.id === activeSection);

  // Filter docs based on search
  const filteredDocs = searchQuery
    ? DOCS_STRUCTURE.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.content.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter(group => group.items.length > 0)
    : DOCS_STRUCTURE;

  return (
    <div className="page-enter flex" style={{ backgroundColor: 'var(--bg-app)', minHeight: 'calc(100vh - var(--nav-height))' }}>
      
      {/* Sidebar */}
      <aside
        className="w-72 shrink-0 overflow-y-auto hidden lg:block"
        style={{
          borderRight: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface)',
          position: 'sticky',
          top: 'var(--nav-height)',
          height: 'calc(100vh - var(--nav-height))',
        }}
      >
        <div className="p-5">
          {/* Sidebar Search */}
          <div className="mb-6">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                placeholder="Search docs..."
                className="input-field pl-10 text-sm"
                style={{ padding: '8px 12px 8px 36px', fontSize: '13px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-6">
            {filteredDocs.map((group) => (
              <div key={group.category}>
                <h3
                  className="text-xs font-semibold uppercase tracking-wider mb-2 px-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {group.category}
                </h3>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between"
                      style={{
                        color: activeSection === item.id ? 'var(--accent-blue)' : 'var(--text-dim)',
                        backgroundColor: activeSection === item.id ? 'var(--accent-blue-light)' : 'transparent',
                        fontWeight: activeSection === item.id ? 600 : 400,
                      }}
                      onMouseEnter={e => {
                        if (activeSection !== item.id) {
                          (e.currentTarget.style as any).backgroundColor = 'var(--bg-hover)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (activeSection !== item.id) {
                          (e.currentTarget.style as any).backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {item.title}
                      {activeSection === item.id && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-3xl mx-auto px-6 md:px-12 py-10">
          {activeItem && (
            <>
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
                <button onClick={() => navigate('/docs')} className="hover:underline">Docs</button>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--text-dim)' }}>
                  {DOCS_STRUCTURE.find(g => g.items.some(i => i.id === activeSection))?.category}
                </span>
                <ChevronRight size={14} />
                <span style={{ color: 'var(--text-main)' }}>{activeItem.title}</span>
              </div>

              {/* Title */}
              <h1
                className="text-3xl font-bold mb-8"
                style={{ color: 'var(--text-main)' }}
              >
                {activeItem.title}
              </h1>

              {/* Content */}
              <div
                className="prose max-w-none"
                style={{
                  color: 'var(--text-dim)',
                  lineHeight: '1.8',
                  fontSize: '15px',
                }}
              >
                {activeItem.content.split('\n\n').map((paragraph, i) => {
                  // Handle headers
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    const text = paragraph.slice(2, -2);
                    return (
                      <h3 key={i} className="text-lg font-semibold mt-8 mb-3" style={{ color: 'var(--text-main)' }}>
                        {text}
                      </h3>
                    );
                  }

                  // Handle tables
                  if (paragraph.includes('|') && paragraph.includes('---')) {
                    const rows = paragraph.trim().split('\n').filter(r => !r.includes('---'));
                    const headers = rows[0]?.split('|').filter(Boolean).map(h => h.trim());
                    const data = rows.slice(1).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
                    
                    return (
                      <div key={i} className="my-4 overflow-auto">
                        <table
                          className="w-full text-sm"
                          style={{ borderCollapse: 'collapse' }}
                        >
                          <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-main)' }}>
                              {headers?.map((h, j) => (
                                <th
                                  key={j}
                                  className="text-left py-2 px-4 text-xs font-semibold uppercase"
                                  style={{ color: 'var(--text-muted)' }}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {data.map((row, j) => (
                              <tr
                                key={j}
                                style={{ borderBottom: '1px solid var(--border-subtle)' }}
                              >
                                {row.map((cell, k) => (
                                  <td
                                    key={k}
                                    className="py-2 px-4 font-mono text-sm"
                                    style={{ color: 'var(--text-main)' }}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  // Handle list items (lines starting with -)
                  if (paragraph.includes('\n-')) {
                    const lines = paragraph.split('\n');
                    const intro = lines.find(l => !l.startsWith('-'));
                    const items = lines.filter(l => l.startsWith('-')).map(l => l.slice(2));
                    
                    return (
                      <div key={i} className="my-4">
                        {intro && <p className="mb-2">{renderBold(intro)}</p>}
                        <ul className="space-y-1.5">
                          {items.map((item, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span style={{ color: 'var(--accent-blue)', marginTop: '4px' }}>•</span>
                              <span>{renderBold(item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }

                  // Handle numbered lists
                  if (/^\d+\./.test(paragraph.split('\n')[0])) {
                    const items = paragraph.split('\n').filter(l => /^\d+\./.test(l));
                    return (
                      <ol key={i} className="my-4 space-y-2">
                        {items.map((item, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-sm"
                          >
                            <span
                              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5"
                              style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}
                            >
                              {j + 1}
                            </span>
                            <span>{renderBold(item.replace(/^\d+\.\s*/, ''))}</span>
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  // Regular paragraph
                  return (
                    <p key={i} className="my-3">
                      {renderBold(paragraph)}
                    </p>
                  );
                })}
              </div>

              {/* Navigation */}
              <div
                className="mt-16 pt-8 flex justify-between"
                style={{ borderTop: '1px solid var(--border-subtle)' }}
              >
                {(() => {
                  const allItems = DOCS_STRUCTURE.flatMap(g => g.items);
                  const idx = allItems.findIndex(i => i.id === activeSection);
                  const prev = idx > 0 ? allItems[idx - 1] : null;
                  const next = idx < allItems.length - 1 ? allItems[idx + 1] : null;
                  return (
                    <>
                      {prev ? (
                        <button
                          onClick={() => setActiveSection(prev.id)}
                          className="text-sm font-medium flex items-center gap-2 transition-colors"
                          style={{ color: 'var(--accent-blue)' }}
                        >
                          <ChevronRight size={16} className="rotate-180" />
                          {prev.title}
                        </button>
                      ) : <div />}
                      {next ? (
                        <button
                          onClick={() => setActiveSection(next.id)}
                          className="text-sm font-medium flex items-center gap-2 transition-colors"
                          style={{ color: 'var(--accent-blue)' }}
                        >
                          {next.title}
                          <ChevronRight size={16} />
                        </button>
                      ) : <div />}
                    </>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// Helper to render bold text (**text**)
function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text-main)', fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
    }
    // Handle inline code (`code`)
    const codeParts = part.split(/(`[^`]+`)/g);
    return codeParts.map((cp, j) => {
      if (cp.startsWith('`') && cp.endsWith('`')) {
        return (
          <code
            key={`${i}-${j}`}
            className="text-sm px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--accent-blue)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85em',
            }}
          >
            {cp.slice(1, -1)}
          </code>
        );
      }
      return cp;
    });
  });
}
