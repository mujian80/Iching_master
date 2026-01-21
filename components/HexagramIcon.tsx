
import React from 'react';

interface HexagramIconProps {
  lines: number[];
  size?: number;
  color?: string;
  active?: boolean;
}

export const HexagramIcon: React.FC<HexagramIconProps> = ({ lines, size = 100, color = 'currentColor', active = false }) => {
  // lines[0] is bottom, lines[5] is top
  const visualLines = [...lines].reverse();
  
  return (
    <div className="relative group flex items-center justify-center transition-transform duration-300 hover:scale-105">
      <div 
        className="absolute inset-0 rounded-lg border border-current opacity-0 group-hover:animate-ripple pointer-events-none"
        style={{ color: color }}
      ></div>
      
      <svg 
        width={size} 
        height={size * 1.2} 
        viewBox="0 0 100 120" 
        className={`relative z-10 transition-all duration-300 ${active ? 'scale-110' : ''}`}
      >
        {visualLines.map((lineType, index) => (
          <g key={index} transform={`translate(0, ${index * 18})`}>
            {lineType === 1 ? (
              <rect x="5" y="5" width="90" height="8" fill={color} rx="1.5" />
            ) : (
              <g>
                <rect x="5" y="5" width="40" height="8" fill={color} rx="1.5" />
                <rect x="55" y="5" width="40" height="8" fill={color} rx="1.5" />
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
};
