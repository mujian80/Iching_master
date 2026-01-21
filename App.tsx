
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { TRIGRAMS, HEXAGRAMS, KING_WEN_HEXAGRAMS, EARLY_HEAVEN_POS, LATER_HEAVEN_POS, POSITIONAL_SOLAR_TERMS, POSITIONAL_SOLAR_TERMS_EN, ICHING_IDIOMS, TRANSLATIONS } from './constants';
import { PuzzleItem, GameState, Hexagram, GameRecord, Idiom, Language, User } from './types';
import { TrigramIcon } from './components/TrigramIcon';
import { BaguaCircle } from './components/BaguaCircle';
import { HexagramBoard } from './components/HexagramBoard';
import { HexagramModal } from './components/HexagramModal';
import { IdiomModal } from './components/IdiomModal';
import { AuthModal } from './components/AuthModal';
import { HexagramIcon } from './components/HexagramIcon';
import { getGeminiFeedback, getTrigramWisdom } from './services/geminiService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [lang, setLang] = useState<Language>('zh');
  
  const [mode, setMode] = useState<'Bagua' | 'Hexagram' | 'Idiom'>('Bagua');
  const [shuffledPool, setShuffledPool] = useState<PuzzleItem[]>([]);
  const [placedTrigrams, setPlacedTrigrams] = useState<Record<string, Record<string, PuzzleItem | null>>>({});
  const [placedHexagrams, setPlacedHexagrams] = useState<Record<number, PuzzleItem | null>>({});
  const [records, setRecords] = useState<GameRecord[]>([]);
  
  const [viewMode, setViewMode] = useState<'grid' | 'circle' | 'sequence'>('circle');
  const [baguaType, setBaguaType] = useState<'early' | 'later'>('early');
  const [zoom, setZoom] = useState(1.0);
  
  const [gameState, setGameState] = useState<GameState>({
    currentMode: 'Bagua',
    score: 0,
    isFinished: false,
    feedback: '',
    lang: 'zh'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<React.ReactNode | null>(null);
  const [activeModalHex, setActiveModalHex] = useState<Hexagram | null>(null);
  const [activeModalIdiom, setActiveModalIdiom] = useState<Idiom | null>(null);
  
  const [activePoolItem, setActivePoolItem] = useState<PuzzleItem | null>(null);
  const [sourceSlot, setSourceSlot] = useState<{ targetId: string | number, type: string } | null>(null);

  const t = TRANSLATIONS[lang];

  const currentHexList: Hexagram[] = useMemo(() => 
    viewMode === 'sequence' ? KING_WEN_HEXAGRAMS : HEXAGRAMS, 
  [viewMode]);

  const categorizedPool = useMemo(() => {
    return {
      symbol: shuffledPool.filter(i => i.type === 'symbol'),
      name: shuffledPool.filter(i => i.type === 'name'),
      nature: shuffledPool.filter(i => i.type === 'nature'),
      solarTerm: shuffledPool.filter(i => i.type === 'solarTerm'),
      hexName: shuffledPool.filter(i => i.type === 'hexName'),
      idiom: shuffledPool.filter(i => i.type === 'idiom'),
    };
  }, [shuffledPool]);

  useEffect(() => {
    const savedUser = localStorage.getItem('iching_user');
    if (savedUser) {
      const user = JSON.parse(savedUser) as User;
      setCurrentUser(user);
      setLang(user.preferredLang);
    }
  }, []);

  useEffect(() => {
    const username = currentUser?.username || 'guest';
    const saved = localStorage.getItem(`iching_records_${username}`);
    if (saved) {
      try { setRecords(JSON.parse(saved) as GameRecord[]); } catch (e) { console.error(e); }
    } else {
      setRecords([]);
    }
  }, [currentUser]);

  const saveRecord = useCallback((record: GameRecord) => {
    const username = currentUser?.username || 'guest';
    setRecords(prev => {
      const updated = [record, ...prev].slice(0, 30);
      localStorage.setItem(`iching_records_${username}`, JSON.stringify(updated));
      return updated;
    });
  }, [currentUser]);

  const clearRecords = useCallback(() => {
    if (window.confirm(lang === 'zh' ? '确定要清空所有演算记录吗？' : 'Are you sure to clear all records?')) {
      const username = currentUser?.username || 'guest';
      setRecords([]);
      localStorage.removeItem(`iching_records_${username}`);
    }
  }, [lang, currentUser]);

  const downloadRecords = useCallback(() => {
    if (records.length === 0) return;
    let content = lang === 'zh' 
      ? `易经大师 - 演算历程报告\n生成时间: ${new Date().toLocaleString()}\n用户: ${currentUser?.username || '游客'}\n\n` 
      : `I Ching Master - Practice Records Report\nGenerated at: ${new Date().toLocaleString()}\nUser: ${currentUser?.username || 'Guest'}\n\n`;
    records.forEach((r, idx) => {
      content += `--------------------------------------------------\n`;
      content += `${lang === 'zh' ? '记录' : 'Record'} #${idx + 1}\n`;
      content += `${lang === 'zh' ? '模式' : 'Mode'}: ${r.mode}\n`;
      content += `${lang === 'zh' ? '时间' : 'Time'}: ${r.timestamp}\n`;
      content += `${lang === 'zh' ? '评分' : 'Score'}: ${r.score}\n`;
      content += `${lang === 'zh' ? '反馈' : 'Feedback'}:\n${r.feedback}\n\n`;
    });
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = lang === 'zh' ? `易经演算历程_${new Date().toLocaleDateString()}.txt` : `IChing_Records_${new Date().toLocaleDateString()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [records, lang, currentUser]);

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    if (currentUser) {
      const updated: User = { ...currentUser, preferredLang: newLang };
      setCurrentUser(updated);
      localStorage.setItem('iching_user', JSON.stringify(updated));
    }
  };

  const initGame = useCallback(() => {
    setActivePoolItem(null);
    setSourceSlot(null);
    setGameState(prev => ({ ...prev, score: 0, isFinished: false, feedback: '' }));
    setSelectedInfo(null);
    const solarTermsList = lang === 'zh' ? POSITIONAL_SOLAR_TERMS : POSITIONAL_SOLAR_TERMS_EN;

    if (mode === 'Bagua') {
      const pool: PuzzleItem[] = [];
      const initialPlacements: Record<string, Record<string, PuzzleItem | null>> = {};
      const posMap = baguaType === 'early' ? EARLY_HEAVEN_POS : LATER_HEAVEN_POS;
      TRIGRAMS.forEach(trig => {
        const posIndex = posMap[trig.id];
        const correctSolarTerm = solarTermsList[posIndex];
        pool.push({ id: `name-${trig.id}`, type: 'name', content: lang === 'zh' ? trig.name : trig.nameEn, targetId: trig.id });
        pool.push({ id: `nature-${trig.id}`, type: 'nature', content: lang === 'zh' ? trig.nature : trig.natureEn, targetId: trig.id });
        pool.push({ id: `solar-${trig.id}`, type: 'solarTerm', content: correctSolarTerm, targetId: trig.id });
        pool.push({ id: `symbol-${trig.id}`, type: 'symbol', content: trig.id, targetId: trig.id });
        initialPlacements[trig.id] = { name: null, nature: null, solarTerm: null, symbol: null };
      });
      setShuffledPool(pool.sort(() => Math.random() - 0.5));
      setPlacedTrigrams(initialPlacements);
    } else if (mode === 'Hexagram') {
      const pool: PuzzleItem[] = currentHexList.map((h): PuzzleItem => ({
        id: `hex-${h.id}`, type: 'hexName' as const, content: lang === 'zh' ? h.name : h.nameEn, targetId: String(h.id)
      })).sort(() => Math.random() - 0.5);
      const initialHexPlacements: Record<number, PuzzleItem | null> = {};
      currentHexList.forEach(h => { initialHexPlacements[h.id] = null; });
      setShuffledPool(pool);
      setPlacedHexagrams(initialHexPlacements);
    } else if (mode === 'Idiom') {
      setShuffledPool([]);
    }
  }, [mode, baguaType, currentHexList, lang]);

  useEffect(() => { initGame(); }, [initGame]);

  const autoComplete = () => {
    if (gameState.isFinished) return;
    if (mode === 'Bagua') {
      const posMap = baguaType === 'early' ? EARLY_HEAVEN_POS : LATER_HEAVEN_POS;
      const solarTermsList = lang === 'zh' ? POSITIONAL_SOLAR_TERMS : POSITIONAL_SOLAR_TERMS_EN;
      const newPlacements: Record<string, Record<string, PuzzleItem | null>> = {};
      TRIGRAMS.forEach(trig => {
        newPlacements[trig.id] = {
          name: { id: `auto-n-${trig.id}`, type: 'name', content: lang === 'zh' ? trig.name : trig.nameEn, targetId: trig.id },
          nature: { id: `auto-na-${trig.id}`, type: 'nature', content: lang === 'zh' ? trig.nature : trig.natureEn, targetId: trig.id },
          solarTerm: { id: `auto-s-${trig.id}`, type: 'solarTerm', content: solarTermsList[posMap[trig.id]], targetId: trig.id },
          symbol: { id: `auto-sy-${trig.id}`, type: 'symbol', content: trig.id, targetId: trig.id }
        };
      });
      setPlacedTrigrams(newPlacements);
      setShuffledPool([]);
    } else if (mode === 'Hexagram') {
      const newPlacements: Record<number, PuzzleItem | null> = {};
      currentHexList.forEach(h => {
        newPlacements[h.id] = { id: `auto-h-${h.id}`, type: 'hexName', content: lang === 'zh' ? h.name : h.nameEn, targetId: String(h.id) };
      });
      setPlacedHexagrams(newPlacements);
      setShuffledPool([]);
    }
  };

  const handleSlotClick = (id: string | number, type: string) => {
    if (gameState.isFinished) return;
    if (activePoolItem) {
      placeItem(activePoolItem, id, type);
    } else {
      const existing = mode === 'Bagua' ? placedTrigrams[id as string][type] : placedHexagrams[id as number];
      if (existing) { 
        setSourceSlot({ targetId: id, type }); 
        setActivePoolItem(existing); 
      }
    }
  };

  const handleDropToPool = (e: React.DragEvent) => {
    e.preventDefault();
    if (activePoolItem && sourceSlot) {
      if (mode === 'Bagua') setPlacedTrigrams(p => ({ ...p, [sourceSlot.targetId]: { ...p[sourceSlot.targetId], [sourceSlot.type]: null } }));
      else setPlacedHexagrams(p => ({ ...p, [sourceSlot.targetId as number]: null }));
      setShuffledPool(p => [...p, activePoolItem]);
      setActivePoolItem(null); setSourceSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string | number, type: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('item');
    if (data) placeItem(JSON.parse(data), targetId, type);
  };

  const placeItem = (item: PuzzleItem, targetId: string | number, type: string) => {
    if (gameState.isFinished) return;
    const isCorrectType = item.type === type || (item.type === 'hexName' && type === 'hexName');
    if (!isCorrectType) {
      // If user taps an invalid slot while holding an item, just deselect
      setActivePoolItem(null);
      setSourceSlot(null);
      return;
    }

    if (sourceSlot) {
      if (mode === 'Bagua') setPlacedTrigrams(p => ({ ...p, [sourceSlot.targetId]: { ...p[sourceSlot.targetId], [sourceSlot.type]: null } }));
      else setPlacedHexagrams(p => ({ ...p, [sourceSlot.targetId as number]: null }));
    } else {
      setShuffledPool(p => p.filter(i => i.id !== item.id));
    }

    if (mode === 'Bagua') {
      const existing = placedTrigrams[targetId as string][type];
      if (existing) setShuffledPool(p => [...p, existing]);
      setPlacedTrigrams(p => ({ ...p, [targetId]: { ...p[targetId], [type]: item } }));
    } else {
      const existing = placedHexagrams[targetId as number];
      if (existing) setShuffledPool(p => [...p, existing]);
      setPlacedHexagrams(p => ({ ...p, [targetId as number]: item }));
    }
    setActivePoolItem(null); setSourceSlot(null);
  };

  const checkResults = async () => {
    let correct = 0, total = 0; const errs: string[] = [];
    const posMap = baguaType === 'early' ? EARLY_HEAVEN_POS : LATER_HEAVEN_POS;
    const solarTermsList = lang === 'zh' ? POSITIONAL_SOLAR_TERMS : POSITIONAL_SOLAR_TERMS_EN;

    if (mode === 'Bagua') {
      total = 32;
      TRIGRAMS.forEach(trig => {
        const p = placedTrigrams[trig.id];
        const trigName = lang === 'zh' ? trig.name : trig.nameEn;
        if (p.name?.content === trigName) correct++; else if (p.name) errs.push(`${trigName}卦名`);
        if (p.nature?.content === (lang === 'zh' ? trig.nature : trig.natureEn)) correct++;
        if (p.solarTerm?.content === solarTermsList[posMap[trig.id]]) correct++;
        if (p.symbol?.content === trig.id) correct++;
      });
    } else if (mode === 'Hexagram') {
      total = currentHexList.length;
      currentHexList.forEach(h => { if (placedHexagrams[h.id]?.content === (lang === 'zh' ? h.name : h.nameEn)) correct++; });
    }
    const finalScore = Math.round((correct / Math.max(1, total)) * 100);
    setIsLoading(true);
    const feedback = await getGeminiFeedback(finalScore, errs.slice(0, 5), lang);
    setIsLoading(false);
    saveRecord({ id: Date.now().toString(), timestamp: new Date().toLocaleString(), mode: t[mode.toLowerCase()], score: finalScore, feedback });
    setGameState(p => ({ ...p, score: finalScore, isFinished: true, feedback }));
  };

  const handleLogout = () => { setCurrentUser(null); localStorage.removeItem('iching_user'); setLang('zh'); };

  return (
    <div className="h-screen flex flex-col bg-[#fcfaf2] overflow-hidden" onClick={(e) => {
      // Deselect item when clicking background
      if (e.target === e.currentTarget) {
        setActivePoolItem(null);
        setSourceSlot(null);
      }
    }}>
      {/* Optimized Header for Mobile */}
      <header className="shrink-0 w-full bg-white/90 backdrop-blur-xl border-b border-gray-200 px-4 py-3 md:px-12 md:py-6 flex flex-col gap-3 md:flex-row items-center justify-between shadow-sm z-50">
        <div className="flex items-center gap-3 md:gap-5 self-start md:self-auto">
           <span className="text-3xl md:text-5xl">☯</span>
           <h1 className="text-xl md:text-3xl lg:text-5xl font-black text-gray-900 tracking-tighter">{t.title}</h1>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
          <div className="flex bg-gray-100 p-1 rounded-full border border-gray-200 shadow-inner">
             {(['Bagua', 'Hexagram', 'Idiom'] as const).map(m => (
               <button 
                 key={m} 
                 onClick={() => setMode(m)} 
                 className={`px-3 md:px-8 py-1.5 md:py-2.5 rounded-full text-sm md:text-xl font-black transition-all ${mode === m ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
               >
                 {t[m.toLowerCase()]}
               </button>
             ))}
          </div>
          
          {mode !== 'Idiom' && (
            <div className="flex gap-2">
              {mode === 'Bagua' && (
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                  {(['early', 'later'] as const).map(bt => (
                    <button key={bt} onClick={() => {setBaguaType(bt); setViewMode('circle');}} className={`px-3 py-1 rounded-lg text-xs md:text-base font-black transition-all ${viewMode === 'circle' && baguaType === bt ? 'bg-indigo-900 text-white' : 'text-gray-500'}`}>{t[bt]}</button>
                  ))}
                  <button onClick={() => setViewMode('grid')} className={`px-3 py-1 rounded-lg text-xs md:text-base font-black transition-all ${viewMode === 'grid' ? 'bg-indigo-900 text-white' : 'text-gray-500'}`}>{t.square}</button>
                </div>
              )}
              {mode === 'Hexagram' && (
                <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                  {(['circle', 'grid', 'sequence'] as const).map(m => (
                    <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1 rounded-lg text-xs md:text-base font-black transition-all ${viewMode === m ? 'bg-indigo-600 text-white' : 'text-gray-500'}`}>{t[m]}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <button onClick={toggleLang} className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 font-black text-sm border border-indigo-100 uppercase">{lang === 'zh' ? 'EN' : '中文'}</button>
          {currentUser ? (
            <div className="flex items-center gap-3 text-sm font-bold">
              <span>{currentUser.username}</span>
              <button onClick={handleLogout} className="text-red-500">退出</button>
            </div>
          ) : <button onClick={() => setShowAuth(true)} className="px-4 py-2 rounded-lg bg-gray-900 text-white font-black text-sm">登录</button>}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <main className="flex-1 overflow-auto flex flex-col items-center p-4 md:p-8" onClick={(e) => {
          if (e.target === e.currentTarget) {
            setActivePoolItem(null);
            setSourceSlot(null);
          }
        }}>
          {mode !== 'Idiom' && (
            <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
              <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.8))} className="w-10 h-10 md:w-14 md:h-14 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center justify-center text-xl font-black">＋</button>
              <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.4))} className="w-10 h-10 md:w-14 md:h-14 bg-white border border-gray-200 rounded-xl shadow-lg flex items-center justify-center text-xl font-black">－</button>
            </div>
          )}

          <div 
            className="transition-transform duration-300 origin-top flex items-center justify-center w-full" 
            style={{ transform: mode !== 'Idiom' ? `scale(${zoom})` : 'none' }}
          >
            {mode === 'Bagua' ? (
              viewMode === 'circle' ? <BaguaCircle type={baguaType} placedItems={placedTrigrams} isFinished={gameState.isFinished} onDrop={handleDrop} onSlotClick={handleSlotClick} onDragStartFromSlot={(e, id, type, item) => { setSourceSlot({targetId:id, type}); setActivePoolItem(item); e.dataTransfer.setData('item', JSON.stringify(item)); }} onTrigramClick={(n) => getTrigramWisdom(n, lang).then(setSelectedInfo)} lang={lang} />
              : <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 w-full max-w-5xl">
                  {TRIGRAMS.map(trig => {
                    const p = placedTrigrams[trig.id];
                    return (
                      <div key={trig.id} className="bg-white rounded-2xl p-4 md:p-8 shadow-xl border-2 border-transparent hover:border-indigo-100 transition-all">
                         <div onDrop={(e) => handleDrop(e, trig.id, 'symbol')} onDragOver={(e)=>e.preventDefault()} onClick={() => handleSlotClick(trig.id, 'symbol')} className="h-20 md:h-32 flex items-center justify-center border-dashed border-2 md:border-4 rounded-xl md:rounded-3xl mb-4 md:mb-6 bg-indigo-50/10">
                           {p.symbol ? <TrigramIcon lines={TRIGRAMS.find(it => it.id === p.symbol?.content)?.lines || []} size={60} /> : <span className="text-indigo-400 text-sm md:text-lg font-black">{t.symbol}</span>}
                         </div>
                         <div className="space-y-2 md:space-y-4">
                           {['name', 'nature', 'solarTerm'].map(type => (
                             <div key={type} onClick={() => handleSlotClick(trig.id, type)} onDrop={(e) => handleDrop(e, trig.id, type)} onDragOver={(e)=>e.preventDefault()} className={`h-10 md:h-16 border-2 rounded-xl flex items-center justify-center text-sm md:text-lg font-black transition-all ${p[type] ? (type === 'name' ? 'bg-red-50 text-red-900 border-red-200' : type === 'nature' ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-green-50 text-green-900 border-green-200') : 'border-dashed border-gray-200 text-gray-400'}`}>
                               {p[type]?.content || t[type]}
                             </div>
                           ))}
                         </div>
                      </div>
                    );
                  })}
                </div>
            ) : mode === 'Hexagram' ? <HexagramBoard view={viewMode} placedNames={placedHexagrams} isFinished={gameState.isFinished} onDrop={handleDrop} onSlotClick={handleSlotClick} onDragStartFromSlot={(e, id, type, item) => { setSourceSlot({targetId:id, type}); setActivePoolItem(item); e.dataTransfer.setData('item', JSON.stringify(item)); }} onHexClick={(hex) => setActiveModalHex(hex)} lang={lang} />
            : <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {ICHING_IDIOMS.map((idiom, idx) => {
                  const hex = KING_WEN_HEXAGRAMS.find(h => h.id === idiom.hexId);
                  return (
                    <div key={idx} onDoubleClick={() => setActiveModalIdiom(idiom)} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 cursor-pointer hover:shadow-xl transition-all active:scale-95 group">
                      <div className="pointer-events-none opacity-30 group-hover:opacity-100"><HexagramIcon lines={hex?.lines || []} size={30} color="#6366f1" /></div>
                      <span className="text-xl font-black text-gray-800 tracking-wider">{lang === 'zh' ? idiom.text : idiom.textEn}</span>
                      <span className="text-xs text-gray-400 font-bold">《{lang === 'zh' ? hex?.name : hex?.nameEn}》</span>
                    </div>
                  );
                })}
              </div>}
          </div>

          {/* AI Result Card */}
          {(gameState.isFinished || selectedInfo) && (
            <div className="mt-8 mb-12 bg-white rounded-3xl p-6 md:p-12 shadow-2xl border border-gray-100 max-w-4xl w-full">
              <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-4">{selectedInfo ? t.wisdom : `${t.score}: ${gameState.score}`}</h3>
              <div className="text-gray-800 italic leading-relaxed whitespace-pre-line bg-[#fdfcf7] p-6 rounded-2xl text-base md:text-xl border border-gray-100">
                {selectedInfo || gameState.feedback}
              </div>
              <button onClick={() => { setSelectedInfo(null); setGameState(p => ({...p, isFinished: false})) }} className="mt-6 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg active:scale-95 transition-all w-full md:w-auto">{t.realize}</button>
            </div>
          )}
        </main>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-96 shrink-0 flex-col gap-6 p-6 border-l bg-white/50 overflow-auto">
          {mode !== 'Idiom' && (
            <section className="bg-white p-6 rounded-3xl border shadow-lg flex flex-col gap-6">
              <h2 className="text-2xl font-black text-gray-800 flex items-center gap-3"><span className="w-2 h-8 bg-red-800 rounded-full"></span> {t.elementPool}</h2>
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2">
                {Object.entries(categorizedPool).map(([type, items]) => items.length > 0 && (
                  <div key={type} className="space-y-3">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t[type]}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map(item => (
                        <div 
                          key={item.id} 
                          draggable 
                          onDragStart={(e) => { setActivePoolItem(item); e.dataTransfer.setData('item', JSON.stringify(item)); }} 
                          onClick={() => setActivePoolItem(activePoolItem?.id === item.id ? null : item)} 
                          className={`px-3 py-1.5 rounded-xl text-sm font-black border-2 cursor-grab select-none transition-all ${activePoolItem?.id === item.id ? 'bg-indigo-600 text-white shadow-md scale-105' : 'bg-white border-gray-100'} ${item.type === 'name' ? 'bg-red-50 text-red-900' : item.type === 'nature' ? 'bg-blue-50 text-blue-900' : 'bg-green-50 text-green-900'}`}
                        >
                          {item.type === 'symbol' ? <div className="pointer-events-none scale-75"><TrigramIcon lines={TRIGRAMS.find(trig => trig.id === item.content)?.lines || []} size={30} color={activePoolItem?.id === item.id ? 'white' : 'currentColor'} /></div> : item.content}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t space-y-3">
                <button onClick={checkResults} disabled={gameState.isFinished || isLoading} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-lg active:scale-95 disabled:opacity-30">{t.submit}</button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={autoComplete} className="py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-black">{t.auto}</button>
                  <button onClick={initGame} className="py-2 bg-gray-50 text-gray-600 rounded-xl text-sm font-black">{t.reset}</button>
                </div>
              </div>
            </section>
          )}

          <section className="bg-white p-6 rounded-3xl border shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-gray-800">{t.records}</h3>
              <div className="flex gap-2">
                <button onClick={downloadRecords} className="p-2 hover:bg-gray-100 rounded-lg">📥</button>
                <button onClick={clearRecords} className="p-2 hover:bg-red-50 text-red-500 rounded-lg">🗑️</button>
              </div>
            </div>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {records.length === 0 ? <div className="text-center py-8 text-gray-400 italic">暂无记录</div>
              : records.map(r => (
                  <div key={r.id} className="p-3 bg-gray-50 rounded-xl border text-sm">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>{r.mode}</span><span>{r.timestamp}</span></div>
                    <div className="flex items-center gap-3"><span className="font-black text-lg">{r.score}</span><p className="truncate text-gray-500">{r.feedback}</p></div>
                  </div>
                ))}
            </div>
          </section>
        </aside>
      </div>

      {/* Mobile Element Pool Bottom Dock */}
      {mode !== 'Idiom' && (
        <div className="lg:hidden shrink-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-200 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.1)] z-40">
          {activePoolItem && (
            <div className="px-4 py-1.5 mb-2 bg-indigo-50 border border-indigo-200 rounded-xl flex justify-between items-center animate-in fade-in slide-in-from-bottom-2">
              <span className="text-xs font-bold text-indigo-700">正在放置: {activePoolItem.content}</span>
              <button onClick={() => setActivePoolItem(null)} className="text-indigo-400 text-xs font-black px-2">取消</button>
            </div>
          )}
          <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
            {shuffledPool.map(item => (
              <div 
                key={item.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePoolItem(activePoolItem?.id === item.id ? null : item);
                }}
                className={`shrink-0 px-4 py-2.5 rounded-xl text-base font-black border-2 transition-all active:scale-90 ${activePoolItem?.id === item.id ? 'bg-indigo-600 text-white border-indigo-600 ring-4 ring-indigo-200 shadow-xl' : 'bg-white border-gray-100'} ${item.type === 'name' ? 'bg-red-50 text-red-900' : item.type === 'nature' ? 'bg-blue-50 text-blue-900' : 'bg-green-50 text-green-900'}`}
              >
                {item.type === 'symbol' ? <div className="pointer-events-none scale-75"><TrigramIcon lines={TRIGRAMS.find(trig => trig.id === item.content)?.lines || []} size={28} color={activePoolItem?.id === item.id ? 'white' : 'currentColor'} /></div> : item.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={checkResults} disabled={gameState.isFinished || isLoading} className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-black text-base shadow-md active:scale-95 disabled:opacity-30">{t.submit}</button>
            <button onClick={autoComplete} className="px-5 py-3.5 bg-indigo-50 text-indigo-700 rounded-xl text-base font-black">{t.auto}</button>
            <button onClick={initGame} className="px-5 py-3.5 bg-gray-50 text-gray-600 rounded-xl text-base font-black">🔄</button>
          </div>
        </div>
      )}

      {activeModalHex && <HexagramModal hex={activeModalHex} onClose={() => setActiveModalHex(null)} lang={lang} />}
      {activeModalIdiom && <IdiomModal idiom={activeModalIdiom} onClose={() => setActiveModalIdiom(null)} lang={lang} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={(u) => { setCurrentUser(u); setLang(u.preferredLang); setShowAuth(false); }} lang={lang} />}
      {isLoading && <div className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-md flex items-center justify-center"><div className="bg-white p-10 rounded-[3rem] flex flex-col items-center gap-4"><div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div><p className="font-black text-xl">推演中...</p></div></div>}
    </div>
  );
};

export default App;
