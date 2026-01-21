
import React from 'react';
import { HEXAGRAMS, KING_WEN_HEXAGRAMS } from '../constants';
import { HexagramIcon } from './HexagramIcon';
import { Hexagram, PuzzleItem, Language } from '../types';

interface HexagramBoardProps {
  view: 'grid' | 'circle' | 'sequence';
  placedNames: Record<number, PuzzleItem | null>;
  isFinished: boolean;
  onDrop: (e: React.DragEvent, hexId: number, type: string) => void;
  onSlotClick: (hexId: number, type: string) => void;
  onDragStartFromSlot: (e: React.DragEvent, hexId: number, type: string, item: PuzzleItem) => void;
  onHexClick?: (hex: Hexagram) => void;
  lang: Language;
}

export const HexagramBoard: React.FC<HexagramBoardProps> = ({ 
  view, 
  placedNames, 
  isFinished, 
  onSlotClick,
  onDrop,
  onDragStartFromSlot,
  onHexClick,
  lang
}) => {
  const activeHexList = view === 'sequence' ? KING_WEN_HEXAGRAMS : HEXAGRAMS;

  if (view === 'grid' || view === 'sequence') {
    return (
      <div className={`grid grid-cols-5 md:grid-cols-8 gap-3 md:gap-4 p-5 bg-white/60 rounded-[2.5rem] shadow-inner border border-gray-100 mx-auto w-full max-w-4xl`}>
        {activeHexList.map((hex, idx) => {
          const item = placedNames[hex.id];
          const isCorrect = isFinished && item?.content === (lang === 'zh' ? hex.name : hex.nameEn);
          return (
            <div 
              key={hex.id}
              onClick={() => onSlotClick(hex.id, 'hexName')}
              onDrop={(e) => onDrop(e, hex.id, 'hexName')}
              onDragOver={(e) => e.preventDefault()}
              onDoubleClick={(e) => { e.stopPropagation(); onHexClick?.(hex); }}
              className={`relative flex flex-col items-center p-2.5 rounded-2xl border-2 transition-all cursor-pointer group select-none ${isFinished ? (isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300') : 'bg-white border-transparent hover:border-indigo-100 hover:shadow-md'}`}
            >
              {/* Position hint */}
              <div className="absolute top-1 left-1.5 text-[10px] md:text-xs text-gray-300 font-bold group-hover:text-indigo-300">
                {idx + 1}
              </div>
              <div className="mb-2 pointer-events-none mt-2">
                <HexagramIcon lines={hex.lines} size={32} color="#374151" />
              </div>
              <div className={`w-full text-xs md:text-sm min-h-[1.5rem] py-1 flex items-center justify-center rounded-lg transition-all truncate font-black ${item ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-300 italic border border-dashed border-gray-100'}`}>
                {item?.content || ''}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const circularSequence = [...Array.from({ length: 32 }, (_, i) => 63 - i), ...Array.from({ length: 32 }, (_, i) => i)];

  return (
    <div className="relative w-[95vmin] h-[95vmin] max-w-[850px] max-h-[850px] mx-auto flex items-center justify-center select-none bg-white/30 rounded-full">
      <div className="absolute w-[20%] h-[20%] rounded-full shadow-2xl z-10 flex items-center justify-center bg-white border-4 border-gray-800 transition-transform duration-1000 hover:rotate-180">
         <svg viewBox="0 0 100 100" className="w-full h-full scale-110">
            <circle cx="50" cy="50" r="50" fill="white" />
            <path d="M 50,0 A 50,50 0 0 1 50,100 A 25,25 0 0 1 50,50 A 25,25 0 0 0 50,0" fill="black" />
            <circle cx="50" cy="25" r="8" fill="black" />
            <circle cx="50" cy="75" r="8" fill="white" />
         </svg>
      </div>

      {circularSequence.map((hexId, step) => {
        const hex = HEXAGRAMS[hexId];
        const angle = -90 - step * (360 / 64);
        const radius = 43; 
        const left = 50 + radius * Math.cos((angle * Math.PI) / 180);
        const top = 50 + radius * Math.sin((angle * Math.PI) / 180);
        const item = placedNames[hexId];

        return (
          <div 
            key={hexId}
            style={{ left: `${left}%`, top: `${top}%`, transform: `translate(-50%, -50%) rotate(${angle + 90}deg)` }}
            className="absolute flex flex-col items-center gap-1 group"
          >
            <div 
              onClick={() => onSlotClick(hexId, 'hexName')} 
              onDoubleClick={(e) => { e.stopPropagation(); onHexClick?.(hex); }} 
              className="cursor-pointer hover:scale-125 transition-transform"
            >
               <HexagramIcon lines={hex.lines} size={24} color="#374151" />
            </div>
            {item ? (
               <div className="text-[8px] md:text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-600 text-white font-black whitespace-nowrap shadow-md">
                 {item.content}
               </div>
            ) : (
               <div className="text-[6px] text-gray-200 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                 {step + 1}
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
