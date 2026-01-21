
import React from 'react';

interface TrigramIconProps {
  lines: number[];
  size?: number;
  color?: string;
  active?: boolean;
}

export const TrigramIcon: React.FC<TrigramIconProps> = ({ lines, size = 100, color = 'currentColor', active = false }) => {
  // lines are ordered bottom to top (I Ching convention)
  // We render them top to bottom visually
  const visualLines = [...lines].reverse();
  
  return (
    <div className="relative group flex items-center justify-center transition-transform duration-300 hover:scale-110">
      {/* Ripple Element - Only visible on hover */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-current opacity-0 group-hover:animate-ripple pointer-events-none"
        style={{ color: color }}
      ></div>
      
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 60" 
        className={`relative z-10 transition-all duration-300 ${active ? 'scale-110' : ''}`}
      >
        {visualLines.map((lineType, index) => (
          <g key={index} transform={`translate(0, ${index * 20})`}>
            {lineType === 1 ? (
              // Yang: Solid line
              <rect x="5" y="5" width="90" height="10" fill={color} rx="2" />
            ) : (
              // Yin: Broken line
              <g>
                <rect x="5" y="5" width="40" height="10" fill={color} rx="2" />
                <rect x="55" y="5" width="40" height="10" fill={color} rx="2" />
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};