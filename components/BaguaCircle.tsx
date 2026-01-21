
import React from 'react';
import { TRIGRAMS, EARLY_HEAVEN_POS, LATER_HEAVEN_POS, POSITIONAL_SOLAR_TERMS, POSITIONAL_SOLAR_TERMS_EN, TRANSLATIONS } from '../constants';
import { TrigramIcon } from './TrigramIcon';
import { PuzzleItem, Language } from '../types';

interface BaguaCircleProps {
  type: 'early' | 'later';
  placedItems: Record<string, Record<string, PuzzleItem | null>>;
  isFinished: boolean;
  onSlotClick: (id: string, type: string) => void;
  onDrop: (e: React.DragEvent, id: string, type: string) => void;
  onDragStartFromSlot: (e: React.DragEvent, trigramId: string, type: string, item: PuzzleItem) => void;
  onTrigramClick: (name: string) => void;
  lang: Language;
}

export const BaguaCircle: React.FC<BaguaCircleProps> = ({ 
  type, 
  placedItems, 
  isFinished, 
  onSlotClick,
  onDrop,
  onDragStartFromSlot,
  onTrigramClick,
  lang
}) => {
  const posMap = type === 'early' ? EARLY_HEAVEN_POS : LATER_HEAVEN_POS;
  const tStrings = TRANSLATIONS[lang];

  return (
    <div className="relative w-[85vmin] h-[85vmin] max-w-[700px] max-h-[700px] bg-white rounded-full border-[8px] md:border-[16px] border-gray-50 shadow-2xl flex items-center justify-center p-4 md:p-8">
      <div className="absolute w-[24%] h-[24%] rounded-full shadow-2xl z-20 bg-white border-2 md:border-4 border-gray-900 transition-transform duration-1000 hover:rotate-180 cursor-pointer">
         <svg viewBox="0 0 100 100" className="w-full h-full scale-105">
            <circle cx="50" cy="50" r="50" fill="white" />
            <path d="M 50,0 A 50,50 0 0 1 50,100 A 25,25 0 0 1 50,50 A 25,25 0 0 0 50,0" fill="black" />
            <circle cx="50" cy="25" r="8" fill="black" />
            <circle cx="50" cy="75" r="8" fill="white" />
         </svg>
      </div>

      {TRIGRAMS.map((trig) => {
        const posIndex = posMap[trig.id];
        const angle = (posIndex * 45) - 90; 
        const radius = 38; 
        const left = 50 + radius * Math.cos((angle * Math.PI) / 180);
        const top = 50 + radius * Math.sin((angle * Math.PI) / 180);
        const p = placedItems[trig.id] || {};
        const trigName = lang === 'zh' ? trig.name : trig.nameEn;

        return (
          <div 
            key={trig.id}
            style={{ left: `${left}%`, top: `${top}%`, transform: `translate(-50%, -50%) rotate(${angle + 90}deg)` }}
            className="absolute w-[20%] max-w-[150px] flex flex-col items-center gap-1 md:gap-3 z-10"
          >
            <div 
              draggable={!!p.symbol && !isFinished}
              onDragStart={(e) => p.symbol && onDragStartFromSlot(e, trig.id, 'symbol', p.symbol)}
              onClick={() => p.symbol ? onTrigramClick(trigName) : onSlotClick(trig.id, 'symbol')}
              onDrop={(e) => onDrop(e, trig.id, 'symbol')}
              onDragOver={(e) => e.preventDefault()}
              className={`cursor-pointer w-full aspect-square flex items-center justify-center rounded-xl md:rounded-3xl border-2 md:border-4 transition-all shadow-md ${p.symbol ? 'border-indigo-100 bg-white scale-110' : 'border-dashed border-indigo-200 bg-indigo-50/20 hover:bg-indigo-50/40 animate-pulse'}`}
            >
              {p.symbol ? <TrigramIcon lines={TRIGRAMS.find(it => it.id === p.symbol?.content)?.lines || []} size={window.innerWidth < 768 ? 40 : 64} color="#1f2937" /> : <span className="text-[10px] md:text-sm font-black text-indigo-400">{tStrings.symbol}</span>}
            </div>

            <div className="w-full space-y-1 md:space-y-2">
              {['name', 'nature', 'solarTerm'].map(type => (
                <div 
                  key={type}
                  onClick={() => onSlotClick(trig.id, type)}
                  onDrop={(e) => onDrop(e, trig.id, type)}
                  onDragOver={(e) => e.preventDefault()}
                  className={`h-5 md:h-11 border rounded-lg md:rounded-2xl flex items-center justify-center text-[8px] md:text-base font-black transition-all ${p[type] ? 'bg-indigo-50 text-indigo-900 border-indigo-200' : 'border-dashed border-gray-100 text-gray-300'}`}
                >
                  {p[type]?.content || tStrings[type]}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
