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
        <defs>
          <filter id="gate-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g 
          className="group-hover:translate-x-1 transition-transform duration-700"
          stroke="currentColor" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path 
            d="M 30 20 H 50 C 70 20 85 35 85 50 C 85 65 70 80 50 80 H 30 V 20 Z" 
            className="group-hover:fill-accent-blue/5 transition-all duration-700"
          />
          
          <line x1="10" y1="35" x2="30" y2="35" className="opacity-40" />
          <line x1="10" y1="65" x2="30" y2="65" className="opacity-40" />
          
          <line x1="85" y1="50" x2="100" y2="50" className="opacity-60 group-hover:opacity-100" />
          
          <circle cx="10" cy="35" r="2.5" fill="currentColor" />
          <circle cx="10" cy="65" r="2.5" fill="currentColor" />
          <circle cx="100" cy="50" r="3" fill="currentColor" className="group-hover:scale-150 origin-center transition-transform" />
        </g>
        <rect 
          x="30" y="20" width="4" height="60" 
          fill="currentColor" 
          className="opacity-10 group-hover:opacity-30 transition-opacity" 
        />
      </svg>
    </div>
  );
}
