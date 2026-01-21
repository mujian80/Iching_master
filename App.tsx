
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

  // Auth & Lang effect
  useEffect(() => {
    const savedUser = localStorage.getItem('iching_user');
    if (savedUser) {
      const user = JSON.parse(savedUser) as User;
      setCurrentUser(user);
      setLang(user.preferredLang);
    }
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(`iching_records_${currentUser?.username || 'guest'}`);
    if (saved) {
      try { setRecords(JSON.parse(saved) as GameRecord[]); } catch (e) { console.error(e); }
    } else {
      setRecords([]);
    }
  }, [currentUser]);

  const saveRecord = useCallback((record: GameRecord) => {
    setRecords(prev => {
      const updated = [record, ...prev].slice(0, 30);
      localStorage.setItem(`iching_records_${currentUser?.username || 'guest'}`, JSON.stringify(updated));
      return updated;
    });
  }, [currentUser]);

  const clearRecords = useCallback(() => {
    if (window.confirm(lang === 'zh' ? '确定要清空所有演算记录吗？' : 'Are you sure to clear all records?')) {
      setRecords([]);
      localStorage.removeItem(`iching_records_${currentUser?.username || 'guest'}`);
    }
  }, [lang, currentUser]);

  const downloadRecords = useCallback(() => {
    if (records.length === 0) return;
    
    let content = lang === 'zh' 
      ? `易经大师 - 演算历程报告\n生成时间: ${new Date().toLocaleString()}\n用户: ${currentUser?.username || '游客'}\n\n` 
      : `I Ching Master - Practice Records Report\nGenerated at: ${new Date().toLocaleString()}\nUser: ${currentUser?.username || 'Guest'}\n\n`;
    
    records.forEach((r, idx) => {
      content += `--------------------------------------------------\n`;
      content += lang === 'zh' ? `记录 #${idx + 1}\n` : `Record #${idx + 1}\n`;
      content += lang === 'zh' ? `模式: ${r.mode}\n` : `Mode: ${r.mode}\n`;
      content += lang === 'zh' ? `时间: ${r.timestamp}\n` : `Timestamp: ${r.timestamp}\n`;
      content += lang === 'zh' ? `评分: ${r.score}\n` : `Score: ${r.score}\n`;
      content += lang === 'zh' ? `感悟反馈:\n${r.feedback}\n\n` : `Insight Feedback:\n${r.feedback}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = lang === 'zh' ? `易经演算历程_${new Date().toLocaleDateString()}.txt` : `IChing_Records_${new Date().toLocaleDateString()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [records, lang, currentUser]);

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    if (currentUser) {
      const updated: User = { ...currentUser, preferredLang: newLang };
      setCurrentUser(updated);
      localStorage.setItem('iching_user', JSON.stringify(updated));
      const users = JSON.parse(localStorage.getItem('iching_users') || '[]');
      const idx = users.findIndex((u: User) => u.username === currentUser.username);
      if (idx !== -1) {
        users[idx].preferredLang = newLang;
        localStorage.setItem('iching_users', JSON.stringify(users));
      }
    }
  };

  const initGame = useCallback(() => {
    setActivePoolItem(null);
    setSourceSlot(null);
    setGameState(prev => ({ ...prev, score: 0, isFinished: false, feedback: '' }));
    setSelectedInfo(null);
    setActiveModalHex(null);
    setActiveModalIdiom(null);

    const solarTermsList = lang === 'zh' ? POSITIONAL_SOLAR_TERMS : POSITIONAL_SOLAR_TERMS_EN;

    if (mode === 'Bagua') {
      const pool: PuzzleItem[] = [];
      const initialPlacements: Record<string, Record<string, PuzzleItem | null>> = {};
      const posMap = baguaType === 'early' ? EARLY_HEAVEN_POS : LATER_HEAVEN_POS;

      TRIGRAMS.forEach(trig => {
        const posIndex = posMap[trig.id];
        const correctSolarTerm = solarTermsList[posIndex];
        const trigName = lang === 'zh' ? trig.name : trig.nameEn;
        const trigNature = lang === 'zh' ? trig.nature : trig.natureEn;

        pool.push({ id: `name-${trig.id}`, type: 'name' as const, content: trigName, targetId: trig.id });
        pool.push({ id: `nature-${trig.id}`, type: 'nature' as const, content: trigNature, targetId: trig.id });
        pool.push({ id: `solar-${trig.id}`, type: 'solarTerm' as const, content: correctSolarTerm, targetId: trig.id });
        pool.push({ id: `symbol-${trig.id}`, type: 'symbol' as const, content: trig.id, targetId: trig.id });
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
      setPlacedHexagrams({});
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
        const posIndex = posMap[trig.id];
        const correctSolarTerm = solarTermsList[posIndex];
        const trigName = lang === 'zh' ? trig.name : trig.nameEn;
        const trigNature = lang === 'zh' ? trig.nature : trig.natureEn;

        newPlacements[trig.id] = {
          name: { id: `auto-name-${trig.id}`, type: 'name', content: trigName, targetId: trig.id },
          nature: { id: `auto-nature-${trig.id}`, type: 'nature', content: trigNature, targetId: trig.id },
          solarTerm: { id: `auto-solar-${trig.id}`, type: 'solarTerm', content: correctSolarTerm, targetId: trig.id },
          symbol: { id: `auto-symbol-${trig.id}`, type: 'symbol', content: trig.id, targetId: trig.id }
        };
      });
      setPlacedTrigrams(newPlacements);
      setShuffledPool([]);
    } else if (mode === 'Hexagram') {
      const newPlacements: Record<number, PuzzleItem | null> = {};
      currentHexList.forEach(h => {
        newPlacements[h.id] = { 
          id: `auto-hex-${h.id}`, 
          type: 'hexName', 
          content: lang === 'zh' ? h.name : h.nameEn, 
          targetId: String(h.id) 
        };
      });
      setPlacedHexagrams(newPlacements);
      setShuffledPool([]);
    }
  };

  const handleSlotClick = (id: string | number, type: string) => {
    if (mode === 'Idiom') return;
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
    if (mode === 'Idiom') return;
    if (activePoolItem && sourceSlot) {
      if (mode === 'Bagua') {
        setPlacedTrigrams(prev => ({
          ...prev,
          [sourceSlot.targetId]: { ...prev[sourceSlot.targetId], [sourceSlot.type]: null }
        }));
      } else {
        setPlacedHexagrams(prev => ({ ...prev, [sourceSlot.targetId as number]: null }));
      }
      setShuffledPool(prev => [...prev, activePoolItem]);
      setActivePoolItem(null);
      setSourceSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string | number, type: string) => {
    e.preventDefault();
    if (mode === 'Idiom') return;
    const data = e.dataTransfer.getData('item');
    if (!data) return;
    try {
      const item = JSON.parse(data) as PuzzleItem;
      placeItem(item, targetId, type);
    } catch (err) {
      console.error("Drop error:", err);
    }
  };

  const placeItem = (item: PuzzleItem, targetId: string | number, type: string) => {
    if (gameState.isFinished) return;
    const isValid = item.type === type || (item.type === 'idiom' && type === 'hexName') || (item.type === 'hexName' && type === 'hexName');
    if (!isValid) return;

    if (sourceSlot) {
      if (mode === 'Bagua') {
        setPlacedTrigrams(prev => ({ ...prev, [sourceSlot.targetId]: { ...prev[sourceSlot.targetId], [sourceSlot.type]: null } }));
      } else {
        setPlacedHexagrams(prev => ({ ...prev, [sourceSlot.targetId as number]: null }));
      }
    } else {
      setShuffledPool(prev => prev.filter(i => i.id !== item.id));
    }

    if (mode === 'Bagua') {
      const existing = placedTrigrams[targetId as string][type];
      if (existing) setShuffledPool(prev => [...prev, existing]);
      setPlacedTrigrams(prev => ({ ...prev, [targetId]: { ...prev[targetId], [type]: item } }));
    } else {
      const existing = placedHexagrams[targetId as number];
      if (existing) setShuffledPool(prev => [...prev, existing]);
      setPlacedHexagrams(prev => ({ ...prev, [targetId as number]: item }));
    }
    setActivePoolItem(null);
    setSourceSlot(null);
  };

  const checkResults = async () => {
    let correctCount = 0;
    let totalItems = 0;
    const errors: string[] = [];
    const posMap = baguaType === 'early' ? EARLY_HEAVEN_POS : LATER_HEAVEN_POS;
    const solarTermsList = lang === 'zh' ? POSITIONAL_SOLAR_TERMS : POSITIONAL_SOLAR_TERMS_EN;

    if (mode === 'Bagua') {
      totalItems = TRIGRAMS.length * 4;
      TRIGRAMS.forEach(trig => {
        const p = placedTrigrams[trig.id];
        const correctSolarTerm = solarTermsList[posMap[trig.id]];
        const trigName = lang === 'zh' ? trig.name : trig.nameEn;
        const trigNature = lang === 'zh' ? trig.nature : trig.natureEn;

        if (p.name?.content === trigName) correctCount++; else if (p.name) errors.push(`${trigName} name`);
        if (p.nature?.content === trigNature) correctCount++; else if (p.nature) errors.push(`${trigName} nature`);
        if (p.solarTerm?.content === correctSolarTerm) correctCount++; else if (p.solarTerm) errors.push(`${trigName} solar term`);
        if (p.symbol?.content === trig.id) correctCount++; else if (p.symbol) errors.push(`${trigName} symbol`);
      });
    } else if (mode === 'Hexagram') {
      totalItems = currentHexList.length;
      currentHexList.forEach(h => {
        const hexName = lang === 'zh' ? h.name : h.nameEn;
        if (placedHexagrams[h.id]?.content === hexName) correctCount++; else if (placedHexagrams[h.id]) errors.push(`${hexName}`);
      });
    }

    const finalScore = Math.round((correctCount / Math.max(1, totalItems)) * 100);
    setIsLoading(true);
    const feedback = await getGeminiFeedback(finalScore, errors.slice(0, 10), lang);
    setIsLoading(false);
    
    saveRecord({
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      mode: t[mode.toLowerCase()],
      score: finalScore,
      feedback: feedback
    });

    setGameState(prev => ({ ...prev, score: finalScore, isFinished: true, feedback }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('iching_user');
    setLang('zh');
  };

  const handleIdiomClick = (idiom: Idiom) => {
    setActiveModalIdiom(idiom);
  };

  return (
    <div className="min-h-screen pb-48 lg:pb-8 bg-[#fcfaf2] flex flex-col items-center overflow-x-hidden">
      <header className="w-full bg-white/70 backdrop-blur-lg border-b border-gray-100 px-6 py-4 md:py-8 sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
           <span className="text-4xl md:text-6xl">☯</span>
           <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">{t.title}</h1>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-3 mr-4">
            <button onClick={toggleLang} className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-sm border border-indigo-100 hover:bg-indigo-100 transition-colors uppercase">
              {lang === 'zh' ? 'EN' : '中文'}
            </button>
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">{t.welcome}, {currentUser.username}</span>
                <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700">{t.logout}</button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="px-4 py-1.5 rounded-lg bg-gray-900 text-white font-bold text-sm hover:bg-black transition-colors">
                {t.login} / {t.signup}
              </button>
            )}
          </div>

          <div className="flex bg-gray-100 p-2 rounded-full border border-gray-200">
             {(['Bagua', 'Hexagram', 'Idiom'] as const).map(m => (
               <button key={m} onClick={() => setMode(m)} className={`px-4 md:px-8 py-2.5 rounded-full text-base md:text-xl font-black transition-all ${mode === m ? 'bg-gray-800 text-white shadow-xl scale-105' : 'text-gray-400'}`}>
                 {t[m.toLowerCase()]}
               </button>
             ))}
          </div>
          
          <div className="h-10 w-px bg-gray-200 mx-2 hidden md:block"></div>
          
          {mode !== 'Idiom' && (
            <div className="flex flex-wrap gap-4">
              {/* Bagua Layout Selection: Early, Later, Square Map */}
              {mode === 'Bagua' && (
                <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                  <button 
                    onClick={() => { setBaguaType('early'); setViewMode('circle'); }} 
                    className={`px-5 py-2 rounded-xl text-sm md:text-lg font-black transition-all ${viewMode === 'circle' && baguaType === 'early' ? 'bg-indigo-900 text-white shadow-md' : 'text-gray-500'}`}
                  >
                    {t.early}
                  </button>
                  <button 
                    onClick={() => { setBaguaType('later'); setViewMode('circle'); }} 
                    className={`px-5 py-2 rounded-xl text-sm md:text-lg font-black transition-all ${viewMode === 'circle' && baguaType === 'later' ? 'bg-indigo-900 text-white shadow-md' : 'text-gray-500'}`}
                  >
                    {t.later}
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`px-5 py-2 rounded-xl text-sm md:text-lg font-black transition-all ${viewMode === 'grid' ? 'bg-indigo-900 text-white shadow-md' : 'text-gray-500'}`}
                  >
                    {t.square}
                  </button>
                </div>
              )}

              {/* Hexagram View Mode Switcher */}
              {mode === 'Hexagram' && (
                <div className="flex bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                  {(['circle', 'grid', 'sequence'] as const).map(m => (
                    <button key={m} onClick={() => setViewMode(m)} className={`px-5 py-2 rounded-xl text-sm md:text-lg font-black transition-all ${viewMode === m ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500'}`}>
                      {t[m]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="w-full max-w-[1600px] flex flex-col lg:grid lg:grid-cols-4 lg:gap-8 px-4 lg:px-8 mt-4 lg:mt-8 flex-1">
        <main className="lg:col-span-3 order-1 flex flex-col items-center relative min-h-[60vh]">
          {mode !== 'Idiom' && (
            <div className="absolute top-0 right-0 md:right-4 z-30 flex flex-col gap-3">
              <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center font-black">＋</button>
              <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="w-12 h-12 bg-white border border-gray-200 rounded-full shadow-lg flex items-center justify-center font-black">－</button>
            </div>
          )}

          <div className="transition-transform duration-300 origin-top flex items-center justify-center w-full" style={{ transform: mode !== 'Idiom' ? `scale(${zoom})` : 'none' }}>
            {mode === 'Bagua' ? (
              viewMode === 'circle' ? (
                <BaguaCircle 
                  type={baguaType} 
                  placedItems={placedTrigrams} 
                  isFinished={gameState.isFinished} 
                  onDrop={handleDrop} 
                  onSlotClick={handleSlotClick} 
                  onDragStartFromSlot={(e, id, type, item) => { setSourceSlot({targetId:id, type}); setActivePoolItem(item); e.dataTransfer.setData('item', JSON.stringify(item)); }} 
                  onTrigramClick={(name) => getTrigramWisdom(name, lang).then(setSelectedInfo)} 
                  lang={lang}
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
                  {TRIGRAMS.map(trig => {
                    const p = placedTrigrams[trig.id];
                    return (
                      <div key={trig.id} className="bg-white rounded-3xl p-6 shadow-md border-4 border-transparent">
                         <div onDrop={(e) => handleDrop(e, trig.id, 'symbol')} onDragOver={(e)=>e.preventDefault()} onClick={() => handleSlotClick(trig.id, 'symbol')} className="h-24 flex items-center justify-center border-dashed border-2 rounded-2xl mb-4 bg-indigo-50/10">
                           {p.symbol ? <TrigramIcon lines={TRIGRAMS.find(it => it.id === p.symbol?.content)?.lines || []} size={64} /> : <span className="text-indigo-400 text-xs font-black">{t.symbol}</span>}
                         </div>
                         <div className="space-y-3">
                           {['name', 'nature', 'solarTerm'].map(type => (
                             <div key={type} onClick={() => handleSlotClick(trig.id, type)} onDrop={(e) => handleDrop(e, trig.id, type)} onDragOver={(e)=>e.preventDefault()} className={`h-12 border-2 rounded-xl flex items-center justify-center text-sm font-black transition-all ${p[type] ? (type === 'name' ? 'bg-red-50 text-red-900 border-red-200' : type === 'nature' ? 'bg-blue-50 text-blue-900 border-blue-200' : 'bg-green-50 text-green-900 border-green-200') : 'border-dashed border-gray-100 text-gray-300'}`}>
                               {p[type]?.content || t[type]}
                             </div>
                           ))}
                         </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : mode === 'Hexagram' ? (
              <HexagramBoard view={viewMode} placedNames={placedHexagrams} isFinished={gameState.isFinished} onDrop={handleDrop} onSlotClick={handleSlotClick} onDragStartFromSlot={(e, id, type, item) => { setSourceSlot({targetId:id, type}); setActivePoolItem(item); e.dataTransfer.setData('item', JSON.stringify(item)); }} onHexClick={(hex) => setActiveModalHex(hex)} lang={lang} />
            ) : (
              /* Idiom Mode with Double Click interaction */
              <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
                {ICHING_IDIOMS.map((idiom, idx) => {
                  const hex = KING_WEN_HEXAGRAMS.find(h => h.id === idiom.hexId);
                  return (
                    <div 
                      key={idx} 
                      onDoubleClick={() => handleIdiomClick(idiom)}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 cursor-pointer hover:shadow-xl hover:scale-105 transition-all group select-none"
                    >
                      <div className="pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                         {hex && <HexagramIcon lines={hex.lines} size={24} color="#6366f1" />}
                      </div>
                      <span className="text-xl font-black text-gray-800 tracking-wider group-hover:text-indigo-600">{lang === 'zh' ? idiom.text : idiom.textEn}</span>
                      <span className="text-[10px] text-gray-400 font-bold group-hover:text-gray-600">《{lang === 'zh' ? hex?.name : hex?.nameEn}》</span>
                      <div className="text-[8px] text-gray-300 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         {lang === 'zh' ? '双击领悟' : 'Double click to learn'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {(gameState.isFinished || selectedInfo) && (
            <div className="mt-12 bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 max-w-4xl w-full">
              <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-6">{selectedInfo ? t.wisdom : `${t.score}: ${gameState.score}`}</h3>
              <div className="text-gray-800 italic leading-relaxed whitespace-pre-line bg-[#fdfcf7] p-8 rounded-3xl text-base md:text-xl shadow-inner">
                {selectedInfo || gameState.feedback}
              </div>
              <button onClick={() => { setSelectedInfo(null); setGameState(prev => ({...prev, isFinished: false})) }} className="mt-8 px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all">{t.realize}</button>
            </div>
          )}
        </main>

        <aside className="lg:col-span-1 space-y-8 h-full">
          {mode !== 'Idiom' ? (
            <section onDrop={handleDropToPool} onDragOver={(e) => e.preventDefault()} className="bg-white p-8 rounded-[2.5rem] border-2 shadow-2xl min-h-[400px]">
              <h2 className="text-2xl font-black text-gray-800 mb-6 flex items-center gap-4">
                 <span className="w-3 h-8 bg-red-800 rounded-full"></span> {t.elementPool}
              </h2>
              
              <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 no-scrollbar">
                {Object.entries(categorizedPool).map(([type, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={type} className="space-y-3">
                      <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">{t[type]}</h3>
                      <div className="flex flex-wrap gap-2.5">
                        {items.map(item => (
                          <div 
                            key={item.id} 
                            draggable 
                            onDragStart={(e) => { setActivePoolItem(item); e.dataTransfer.setData('item', JSON.stringify(item)); }} 
                            onClick={() => setActivePoolItem(activePoolItem?.id === item.id ? null : item)} 
                            className={`px-3.5 py-1.5 rounded-xl text-sm font-black border-2 cursor-grab transition-all select-none ${activePoolItem?.id === item.id ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-white border-gray-100'} ${item.type === 'name' ? 'bg-red-50 text-red-900 border-red-100' : item.type === 'nature' ? 'bg-blue-50 text-blue-900 border-blue-100' : 'bg-green-50 text-green-900 border-green-100'}`}
                          >
                             {item.type === 'symbol' ? (
                               <div className="pointer-events-none scale-75 -my-2">
                                 <TrigramIcon lines={TRIGRAMS.find(trig => trig.id === item.content)?.lines || []} size={40} color={activePoolItem?.id === item.id ? 'white' : 'currentColor'} />
                               </div>
                             ) : item.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 pt-8 border-t space-y-4">
                <button onClick={checkResults} disabled={gameState.isFinished || isLoading} className="w-full py-5 bg-gray-900 text-white rounded-3xl font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-20">{t.submit}</button>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={autoComplete} className="py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-black border border-indigo-100 hover:bg-indigo-100 transition-colors">{t.auto}</button>
                  <button onClick={initGame} className="py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-black border border-gray-100 hover:bg-gray-100 transition-colors">{t.reset}</button>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-indigo-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
              <h2 className="text-2xl font-black mb-4">{t.poolTitle}</h2>
              <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                {t.poolDesc}
              </p>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                 <div className="text-[10px] uppercase font-bold text-indigo-300 mb-2">{t.poolStat}</div>
                 <div className="w-full bg-indigo-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full w-[100%]"></div>
                 </div>
              </div>
            </section>
          )}

          <section className="bg-white p-8 rounded-[2.5rem] border-2 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">{t.records}</h3>
              <div className="flex gap-2">
                {records.length > 0 && (
                  <button 
                    onClick={downloadRecords} 
                    title={t.download}
                    className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors text-lg"
                  >
                    📥
                  </button>
                )}
                <button onClick={clearRecords} title="Clear history" className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors text-lg">🗑️</button>
              </div>
            </div>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {records.length === 0 ? (
                <div className="text-center py-10 text-gray-400 italic">{t.noRecords}</div>
              ) : (
                records.map(record => (
                  <div key={record.id} className="p-4 bg-[#fdfcf7] border rounded-2xl shadow-sm">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>{record.mode}</span>
                      <span>{record.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xl font-black ${record.score >= 80 ? 'text-green-600' : 'text-gray-800'}`}>{record.score}</span>
                      <p className="text-xs text-gray-600 line-clamp-1 flex-1">{record.feedback}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </aside>
      </div>
      
      {activeModalHex && <HexagramModal hex={activeModalHex} onClose={() => setActiveModalHex(null)} lang={lang} />}
      {activeModalIdiom && <IdiomModal idiom={activeModalIdiom} onClose={() => setActiveModalIdiom(null)} lang={lang} />}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={(u) => { setCurrentUser(u); setLang(u.preferredLang); setShowAuth(false); }} lang={lang} />}
      
      {isLoading && (
        <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-gray-800 tracking-widest">{lang === 'zh' ? '推演中...' : 'Thinking...'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
