
export enum ElementType {
  HEAVEN = '天',
  EARTH = '地',
  THUNDER = '雷',
  WIND = '风',
  WATER = '水',
  FIRE = '火',
  MOUNTAIN = '山',
  LAKE = '泽'
}

export type Language = 'zh' | 'en';

export interface User {
  username: string;
  password?: string;
  preferredLang: Language;
}

export interface Trigram {
  id: string;
  name: string;
  nameEn: string;
  pinyin: string;
  symbol: string; 
  lines: number[]; 
  nature: ElementType;
  natureEn: string;
  solarTerms: string[];
  direction: string;
  directionEn: string;
  meaning: string;
  meaningEn: string;
}

export interface Hexagram {
  id: number;
  name: string;
  nameEn: string;
  pinyin: string;
  guaCi: string;
  explanation: string;
  upper: string; // trigram id
  lower: string; // trigram id
  lines: number[];
  meaning: string;
}

export interface Idiom {
  text: string;
  textEn: string;
  hexId: number; 
  origin: string; 
  originEn: string;
}

export interface GameRecord {
  id: string;
  timestamp: string;
  mode: string;
  score: number;
  feedback: string;
}

export interface GameState {
  currentMode: 'Bagua' | 'Hexagram' | 'Idiom';
  score: number;
  isFinished: boolean;
  feedback: string;
  lang: Language;
}

export interface PuzzleItem {
  id: string;
  type: 'name' | 'nature' | 'solarTerm' | 'symbol' | 'hexName' | 'idiom';
  content: string;
  targetId: string;
}
