
import React from 'react';
import { Hexagram, Language } from '../types';
import { HexagramIcon } from './HexagramIcon';
import { TRANSLATIONS } from '../constants';

interface HexagramModalProps {
  hex: Hexagram;
  onClose: () => void;
  lang: Language;
}

export const HexagramModal: React.FC<HexagramModalProps> = ({ hex, onClose, lang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="bg-indigo-900 p-6 md:p-8 flex flex-col items-center text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">✕</button>
          <div className="mb-4 bg-white/10 p-4 rounded-2xl">
            <HexagramIcon lines={hex.lines} size={64} color="white" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-widest mb-1">《{lang === 'zh' ? hex.name : hex.nameEn}》</h2>
          <div className="text-indigo-200 font-bold uppercase text-xs md:text-sm tracking-widest">{hex.pinyin}</div>
        </div>
        
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              {lang === 'zh' ? '卦辞' : 'Judgement'}
            </h3>
            <p className="text-lg md:text-xl font-bold text-indigo-900 leading-relaxed bg-indigo-50/50 p-4 rounded-xl border border-indigo-50">
              {lang === 'zh' ? hex.guaCi : hex.meaning}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
              {lang === 'zh' ? '解释' : 'Explanation'}
            </h3>
            <div className="text-gray-700 leading-relaxed italic text-sm md:text-lg">
              {lang === 'zh' ? hex.explanation : hex.meaning}
            </div>
          </div>
        </div>
        
        <div className="px-6 md:px-8 pb-6 md:pb-8">
          <button onClick={onClose} className="w-full py-3 md:py-4 bg-gray-900 text-white rounded-xl md:rounded-2xl font-black md:text-lg hover:bg-black transition-all active:scale-95 shadow-lg">
            {t.realize}
          </button>
        </div>
      </div>
    </div>
  );
};
