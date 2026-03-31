import { useState } from 'react';
import { CircuitBoard, Zap, Cpu, Globe } from 'lucide-react';

const FEATURES = [
  {
    icon: <CircuitBoard size={22} />,
    title: 'Visual Circuit Builder',
    description:
      'Drag and connect logic gates to create complex circuits on an infinite canvas.',
    color: 'var(--accent-blue)',
    bgColor: 'var(--accent-blue-light)',
  },
  {
    icon: <Zap size={22} />,
    title: 'Real-Time Simulation',
    description:
      'Signals propagate instantly so you can see how your circuit behaves.',
    color: 'var(--accent-green)',
    bgColor: 'var(--accent-green-light)',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Custom IC Blocks',
    description:
      'Group circuits into reusable components and build larger systems.',
    color: 'var(--accent-purple)',
    bgColor: 'var(--accent-purple-light)',
  },
  {
    icon: <Globe size={22} />,
    title: 'Browser-Based Lab',
    description:
      'No installation required. Everything runs directly in your browser.',
    color: 'var(--accent-yellow)',
    bgColor: 'var(--accent-yellow-light)',
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {FEATURES.map((feature, i) => (
        <FeatureCard key={i} {...feature} />
      ))}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  bgColor,
}: (typeof FEATURES)[number]) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="feature-card rounded-xl p-8 transition-all duration-200"
      style={{
        border: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-card)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'none',
        borderColor: hovered ? 'var(--border-main)' : 'var(--border-subtle)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
        style={{ backgroundColor: bgColor, color }}
      >
        {icon}
      </div>
      <h3
        className="text-base font-semibold mb-2"
        style={{ color: 'var(--text-main)' }}
      >
        {title}
      </h3>
      <p className="text-sm" style={{ color: 'var(--text-dim)', lineHeight: '1.6' }}>
        {description}
      </p>
    </div>
  );
}
