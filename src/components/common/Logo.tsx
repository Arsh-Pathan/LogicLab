export default function Logo({ size = 40, className = "" }: { size?: number, className?: string }) {
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      style={{ width: size, height: size }}
    >
      {/* Logic backdrop (solid) */}
      <div className="absolute inset-0 bg-accent-orange/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <svg 
        viewBox="0 0 100 100" 
        width={size} 
        height={size} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 transition-transform duration-500 group-hover:scale-105"
      >
        {/* Input Wires with subtle gradients */}
        <defs>
          <linearGradient id="wire-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
          <linearGradient id="gate-grad" x1="30" y1="20" x2="80" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#fbbf24" />
          </linearGradient>
        </defs>

        <line x1="10" y1="35" x2="30" y2="35" stroke="url(#wire-grad)" strokeWidth="4" strokeLinecap="round" />
        <line x1="10" y1="65" x2="30" y2="65" stroke="url(#wire-grad)" strokeWidth="4" strokeLinecap="round" />
        
        {/* Terminals with inner depth */}
        <circle cx="15" cy="35" r="7" fill="#1e293b" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="15" cy="35" r="3" fill="#64748b" />
        
        <circle cx="15" cy="65" r="7" fill="#1e293b" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="15" cy="65" r="3" fill="#64748b" />

        {/* Gate Body - Precision ANSI Shape */}
        <path 
          d="M 30,20 L 55,20 A 30,30 0 0 1 55,80 L 30,80 Z" 
          fill="url(#gate-grad)" 
        />
        <path 
          d="M 30,20 L 38,20 L 38,80 L 30,80 Z" 
          fill="#d97706" 
        />
        
        {/* Internal Circuit Decoration */}
        <path 
          d="M 50,35 A 15,15 0 0 1 50,65" 
          stroke="rgba(255,255,255,0.3)" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />

        {/* Output Wire */}
        <line x1="80" y1="50" x2="90" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round" />
        
        {/* Output Node (Solid) */}
        <circle cx="85" cy="50" r="9" fill="#f97316" />
        <circle cx="85" cy="50" r="14" stroke="#f97316" strokeWidth="1" className="opacity-20" />
      </svg>
    </div>
  );
}
