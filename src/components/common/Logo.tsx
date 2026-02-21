export default function Logo({ size = 40, className = "" }: { size?: number, className?: string }) {
  return (
    <div 
      className={`relative flex items-center justify-center group ${className}`} 
      style={{ width: size, height: size }}
    >
      <svg 
        viewBox="0 0 100 100" 
        width={size} 
        height={size} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-all duration-700"
      >
        {/* Precision Center Mark */}
        <rect 
          x="35" y="35" width="30" height="30" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinejoin="round"
          className="group-hover:rotate-45 origin-center transition-transform duration-700"
        />
        
        {/* Signal Lines - Discrete Logic Path */}
        <path 
          d="M 10,50 L 35,50" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round"
          className="opacity-20 translate-x-[-10px] group-hover:translate-x-0 transition-transform duration-500"
        />
        <path 
          d="M 65,50 L 90,50" 
          stroke="currentColor" 
          strokeWidth="6" 
          strokeLinecap="round"
          className="opacity-40 translate-x-[10px] group-hover:translate-x-0 transition-transform duration-500"
        />

        {/* Binary Nodes */}
        <circle 
          cx="10" cy="50" r="4" 
          fill="currentColor" 
          className="opacity-10"
        />
        <circle 
          cx="90" cy="50" r="4" 
          fill="currentColor" 
          className="opacity-60"
        />
      </svg>
    </div>
  );
}

