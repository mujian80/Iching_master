
import React from 'react';
import { Idiom, Language } from '../types';
import { HEXAGRAMS, KING_WEN_HEXAGRAMS, TRANSLATIONS } from '../constants';
import { HexagramIcon } from './HexagramIcon';

interface IdiomModalProps {
  idiom: Idiom;
  onClose: () => void;
  lang: Language;
}

export const IdiomModal: React.FC<IdiomModalProps> = ({ idiom, onClose, lang }) => {
  const associatedHex = KING_WEN_HEXAGRAMS.find(h => h.id === idiom.hexId) || HEXAGRAMS.find(h => h.id === idiom.hexId);
  const t = TRANSLATIONS[lang];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="bg-indigo-900 p-8 text-white relative flex flex-col items-center text-center">
          <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-xl">✕</button>
          <div className="px-4 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            {lang === 'zh' ? '易道成语 · 经典领悟' : 'I Ching Wisdom · Insight'}
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            {lang === 'zh' ? idiom.text : idiom.textEn}
          </h2>
          <div className="flex items-center gap-2 text-indigo-200 text-sm font-bold">
            <span className="w-4 h-px bg-indigo-400"></span>
            {lang === 'zh' ? `源于《${associatedHex?.name}》卦` : `From ${associatedHex?.nameEn}`}
            <span className="w-4 h-px bg-indigo-400"></span>
          </div>
        </div>
        
        <div className="p-8 md:p-10 space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
              {lang === 'zh' ? '来源与卦意' : 'Origin & Insight'}
            </h3>
            <div className="text-lg md:text-xl font-serif italic text-gray-800 leading-relaxed bg-[#fdfcf7] p-6 rounded-3xl border border-gray-100 shadow-inner">
              {lang === 'zh' ? idiom.origin : idiom.originEn}
            </div>
          </div>

          {associatedHex && (
            <div className="space-y-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                {lang === 'zh' ? '关联卦象' : 'Related Hexagram'}
              </h3>
              <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-3xl border border-gray-100 group">
                <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                  <HexagramIcon lines={associatedHex.lines} size={48} color="#1e1b4b" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-xl font-black text-indigo-900">《{lang === 'zh' ? associatedHex.name : associatedHex.nameEn}》</div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">{associatedHex.pinyin}</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="px-10 pb-10">
          <button onClick={onClose} className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-xl hover:bg-black transition-all active:scale-95 shadow-xl">
            {t.realize}
          </button>
        </div>
      </div>
    </div>
  );
};
