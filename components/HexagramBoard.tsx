
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
  activeType?: string;
}

export const HexagramBoard: React.FC<HexagramBoardProps> = ({ 
  view, 
  placedNames, 
  isFinished, 
  onSlotClick,
  onDrop,
  onDragStartFromSlot,
  onHexClick,
  lang,
  activeType
}) => {
  const activeHexList = view === 'sequence' ? KING_WEN_HEXAGRAMS : HEXAGRAMS;

  if (view === 'grid' || view === 'sequence') {
    return (
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-6 p-4 md:p-8 bg-white/70 rounded-3xl shadow-inner border border-gray-100 mx-auto w-full max-w-5xl">
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
              className={`relative flex flex-col items-center p-1.5 md:p-4 rounded-xl md:rounded-3xl border-2 md:border-4 transition-all cursor-pointer group select-none ${isFinished ? (isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300') : 'bg-white border-transparent hover:border-indigo-100 hover:shadow-xl'} ${activeType === 'hexName' && !item ? 'ring-4 ring-indigo-400 border-indigo-400 bg-indigo-100/30 animate-pulse' : ''}`}
            >
              <div className="absolute top-1 left-1.5 text-[8px] md:text-xs text-gray-300 font-black">{idx + 1}</div>
              <div className="mb-1 md:mb-3 pointer-events-none mt-1">
                <HexagramIcon lines={hex.lines} size={window.innerWidth < 768 ? 24 : 42} color="#1f2937" />
              </div>
              <div className={`w-full text-[10px] md:text-base min-h-[1.5rem] md:min-h-[2.5rem] py-1 flex items-center justify-center rounded-lg transition-all truncate font-black ${item ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-200 italic border border-dashed border-gray-50'}`}>
                <span className="pointer-events-none">{item?.content || ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const circularSequence = [...Array.from({ length: 32 }, (_, i) => 63 - i), ...Array.from({ length: 32 }, (_, i) => i)];

  return (
    <div className="relative w-[90vmin] h-[90vmin] max-w-[850px] max-h-[850px] mx-auto flex items-center justify-center select-none bg-white/40 rounded-full border-[6px] md:border-[12px] border-white/50 shadow-2xl overflow-visible">
      <div className="absolute w-[22%] h-[22%] rounded-full shadow-2xl z-20 bg-white border-2 md:border-4 border-gray-900 transition-transform duration-1000 hover:rotate-180 cursor-default">
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
            onDrop={(e) => onDrop(e, hexId, 'hexName')}
            onDragOver={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation();
              onSlotClick(hexId, 'hexName');
            }}
            className={`absolute flex flex-col items-center group z-10 p-4 md:p-5 rounded-full cursor-pointer transition-all ${item ? 'scale-110' : ''} ${activeType === 'hexName' && !item ? 'bg-indigo-100/50 ring-4 ring-indigo-400 scale-125 animate-pulse shadow-lg' : ''}`}
          >
            <div 
              onDoubleClick={(e) => { e.stopPropagation(); onHexClick?.(hex); }} 
              className={`transition-transform pointer-events-none group-hover:scale-150 ${activeType === 'hexName' && !item ? 'scale-150' : ''}`}
            >
               <HexagramIcon lines={hex.lines} size={window.innerWidth < 768 ? 16 : 28} color="#1f2937" />
            </div>
            {item ? (
               <div className="text-[7px] md:text-sm px-2 py-0.5 rounded-md bg-indigo-700 text-white font-black whitespace-nowrap shadow-xl">
                 {item.content}
               </div>
            ) : (
               <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-indigo-200 bg-indigo-50 transition-all ${activeType === 'hexName' ? 'bg-indigo-500 border-white scale-125 shadow-md' : 'group-hover:bg-indigo-400 group-hover:border-indigo-500'}`}></div>
            )}
            <div className={`absolute -top-5 text-[8px] md:text-xs text-gray-500 font-black transition-opacity whitespace-nowrap ${activeType === 'hexName' || window.innerWidth > 768 ? 'opacity-100' : 'opacity-0'}`}>
               #{step + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};
