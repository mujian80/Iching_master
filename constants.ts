
import { Trigram, ElementType, Hexagram, Idiom, Language } from './types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  zh: {
    title: '易经大师',
    bagua: '八卦',
    hexagram: '六十四卦',
    idiom: '易道成语',
    early: '先天',
    later: '后天',
    square: '方图',
    circle: '圆图',
    grid: '方图',
    sequence: '后天序',
    elementPool: '元素池',
    submit: '提交演算',
    auto: '一键到位',
    reset: '重置模式',
    records: '演算历程',
    login: '登录',
    signup: '注册',
    logout: '退出',
    username: '用户名',
    password: '密码',
    prefLang: '首选语言',
    welcome: '欢迎回来',
    wisdom: '易经智慧解析',
    score: '演算评分',
    realize: '感悟易理',
    poolTitle: '学而时习之',
    poolDesc: '这里的 64 条成语与金句完整对应《周易》六十四卦体系。无需繁杂的推算，点击卡片即可直接领悟先贤留下的处世智慧。',
    poolStat: '已收录 64 / 64 金句',
    noRecords: '暂无演算记录',
    history: '演算历程',
    symbol: '卦象',
    name: '卦名',
    nature: '物象',
    solarTerm: '节气',
    hexName: '卦名',
    classic: '经典金句',
    download: '下载记录'
  },
  en: {
    title: 'I Ching Master',
    bagua: 'Bagua',
    hexagram: '64 Hexagrams',
    idiom: 'Wisdom Idioms',
    early: 'Early Heaven',
    later: 'Later Heaven',
    square: 'Square Map',
    circle: 'Circle',
    grid: 'Grid',
    sequence: 'Sequence',
    elementPool: 'Element Pool',
    submit: 'Submit Result',
    auto: 'Auto Fill',
    reset: 'Reset Mode',
    records: 'Learning History',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout',
    username: 'Username',
    password: 'Password',
    prefLang: 'Preferred Language',
    welcome: 'Welcome Back',
    wisdom: 'I Ching Insight',
    score: 'Performance Score',
    realize: 'Enlighten',
    poolTitle: 'Practice & Learn',
    poolDesc: 'These 64 idioms correspond to the complete I Ching system. No complex calculations needed, just click to understand the wisdom of the sages.',
    poolStat: 'Collected 64 / 64 Idioms',
    noRecords: 'No history records yet',
    history: 'Practice History',
    symbol: 'Symbol',
    name: 'Name',
    nature: 'Nature',
    solarTerm: 'Term',
    hexName: 'Hex Name',
    classic: 'Classic Wisdom',
    download: 'Download'
  }
};

export const TRIGRAMS: Trigram[] = [
  { id: 'qian', name: '乾', nameEn: 'Qian', pinyin: 'Qián', symbol: '☰', lines: [1, 1, 1], nature: ElementType.HEAVEN, natureEn: 'Heaven', solarTerms: [], direction: '西北', directionEn: 'NW', meaning: '健', meaningEn: 'Creative' },
  { id: 'kun', name: '坤', nameEn: 'Kun', pinyin: 'Kūn', symbol: '☷', lines: [0, 0, 0], nature: ElementType.EARTH, natureEn: 'Earth', solarTerms: [], direction: '西南', directionEn: 'SW', meaning: '顺', meaningEn: 'Receptive' },
  { id: 'zhen', name: '震', nameEn: 'Zhen', pinyin: 'Zhèn', symbol: '☳', lines: [1, 0, 0], nature: ElementType.THUNDER, natureEn: 'Thunder', solarTerms: [], direction: '东', directionEn: 'East', meaning: '动', meaningEn: 'Arousing' },
  { id: 'xun', name: '巽', nameEn: 'Xun', pinyin: 'Xùn', symbol: '☴', lines: [0, 1, 1], nature: ElementType.WIND, natureEn: 'Wind', solarTerms: [], direction: '东南', directionEn: 'SE', meaning: '入', meaningEn: 'Gentle' },
  { id: 'kan', name: '坎', nameEn: 'Kan', pinyin: 'Kǎn', symbol: '☵', lines: [0, 1, 0], nature: ElementType.WATER, natureEn: 'Water', solarTerms: [], direction: '北', directionEn: 'North', meaning: '陷', meaningEn: 'Abysmal' },
  { id: 'li', name: '离', nameEn: 'Li', pinyin: 'Lí', symbol: '☲', lines: [1, 0, 1], nature: ElementType.FIRE, natureEn: 'Fire', solarTerms: [], direction: '南', directionEn: 'South', meaning: '丽', meaningEn: 'Clinging' },
  { id: 'gen', name: '艮', nameEn: 'Gen', pinyin: 'Gèn', symbol: '☶', lines: [0, 0, 1], nature: ElementType.MOUNTAIN, natureEn: 'Mountain', solarTerms: [], direction: '东北', directionEn: 'NE', meaning: '止', meaningEn: 'Keeping Still' },
  { id: 'dui', name: '兑', nameEn: 'Dui', pinyin: 'Duì', symbol: '☱', lines: [1, 1, 0], nature: ElementType.LAKE, natureEn: 'Lake', solarTerms: [], direction: '西', directionEn: 'West', meaning: '悦', meaningEn: 'Joyous' }
];

export const POSITIONAL_SOLAR_TERMS: Record<number, string> = {
  0: '夏至', 1: '立秋', 2: '秋分', 3: '立冬', 4: '冬至', 5: '立春', 6: '春分', 7: '立夏'  
};

export const POSITIONAL_SOLAR_TERMS_EN: Record<number, string> = {
  0: 'Summer Solstice', 1: 'Autumn Begins', 2: 'Autumn Equinox', 3: 'Winter Begins', 4: 'Winter Solstice', 5: 'Spring Begins', 6: 'Spring Equinox', 7: 'Summer Begins'  
};

export const EARLY_HEAVEN_POS: Record<string, number> = { 
  qian: 0, dui: 7, li: 6, zhen: 5, kun: 4, gen: 3, kan: 2, xun: 1 
};

export const LATER_HEAVEN_POS: Record<string, number> = { 
  li: 0, kun: 1, dui: 2, qian: 3, kan: 4, gen: 5, zhen: 6, xun: 7 
};

const HEX_DETAILS: Record<string, { p: string, g: string, e: string, en: string }> = {
  '乾': { p: 'Qián', g: '元，亨，利，贞。', e: '天行健，君子以自强不息。象征刚健进取。', en: 'The Creative. Perseverance furthers.' },
  '坤': { p: 'Kūn', g: '元，亨，利牝马之贞。', e: '地势坤，君子以厚德载物。象征包容承载。', en: 'The Receptive. Sublime success.' },
  '屯': { p: 'Zhūn', g: '元，亨，利，贞。', e: '草木初生，艰难而充满生机。', en: 'Difficulty at the Beginning.' },
  '蒙': { p: 'Méng', g: '亨。匪我求童蒙。', e: '启蒙教育，旨在教化无知。', en: 'Youthful Folly.' },
  '需': { p: 'Xū', g: '有孚，光亨。', e: '等待时机，饮食宴乐以待变化。', en: 'Waiting (Nourishment).' },
  '讼': { p: 'Sòng', g: '有孚，窒，惕。', e: '慎对争执，凡事预则立，和为贵。', en: 'Conflict.' },
  '师': { p: 'Shī', g: '贞，丈人吉。', e: '兵众之事，需以正义和纪律统领。', en: 'The Army.' },
  '比': { p: 'Bǐ', g: '吉。原筮。', e: '亲近辅佐，上下团结一致。', en: 'Holding Together (Union).' },
  '小畜': { p: 'Xiǎo Xù', g: '亨。密云不雨。', e: '积蓄微小，力量尚不足以大成。', en: 'The Taming Power of the Small.' },
  '履': { p: 'Lǚ', g: '履虎尾，不咥人。', e: '如履薄冰，礼仪之规范与审慎。', en: 'Treading (Conduct).' },
  '泰': { p: 'Tài', g: '小往大来，吉。', e: '天地交泰，阴阳和谐，万事顺遂。', en: 'Peace.' },
  '否': { p: 'Pǐ', g: '否之匪人。', e: '阴阳不交，闭塞不通，艰难时期。', en: 'Standstill (Stagnation).' },
  '同人': { p: 'Tóng Rén', g: '同人于野。', e: '天下大同，志同道合，广结善缘。', en: 'Fellowship with Men.' },
  '大有': { p: 'Dà Yǒu', g: '元亨。', e: '如日中天，大获所有，富有而德高。', en: 'Possession in Great Measure.' },
  '谦': { p: 'Qiān', g: '亨，君子有终。', e: '卑以自牧，谦逊待人，最终获吉。', en: 'Modesty.' },
  '豫': { p: 'Yù', g: '利建侯行师。', e: '和悦安乐，居安思危，提前准备。', en: 'Enthusiasm.' },
  '随': { p: 'Suí', g: '元亨，利贞。', e: '顺时而动，随时而迁，不固执己见。', en: 'Following.' },
  '蛊': { p: 'Gǔ', g: '元亨。', e: '整治腐败，拨乱反正，革故鼎新。', en: 'Work on what has been spoiled.' },
  '临': { p: 'Lín', g: '元亨，利贞。', e: '以上临下，亲民视事，充满希望。', en: 'Approach.' },
  '观': { p: '观', g: '盥而不荐。', e: '观察思考，垂范后人，静观其变。', en: 'Contemplation (View).' },
  '噬嗑': { p: 'Shì Hé', g: '亨。利用狱。', e: '咬合障碍，严明法度，惩治不公。', en: 'Biting Through.' },
  '贲': { p: 'Bì', g: '亨。小利有攸往。', e: '文饰装点，质朴与华美的平衡。', en: 'Grace.' },
  '剥': { p: 'Bō', g: '不利有攸往。', e: '剥落倾覆，阳气消尽，需持重。', en: 'Splitting Apart.' },
  '复': { p: 'Fù', g: '亨。出入无疾。', e: '生机重现，一阳来复，万物复苏。', en: 'Return (The Turning Point).' },
  '无妄': { p: 'Wú Wàng', g: '元亨，利贞。', e: '真实无欺，顺应自然，不求妄想。', en: 'Innocence (The Unexpected).' },
  '大畜': { p: 'Dà Xù', g: '利贞。', e: '大量积蓄，蓄德养才，志向高远。', en: 'The Taming Power of the Great.' },
  '颐': { p: 'Yí', g: '贞吉。', e: '颐养之道，注意言行，自求口实。', en: 'Corners of the Mouth (Providing Nourishment).' },
  '大过': { p: 'Dà Guò', g: '栋桡，亨。', e: '重大变革，非常之才，承担重任。', en: 'Preponderance of the Great.' },
  '坎': { p: 'Kǎn', g: '习坎，有孚。', e: '重重险阻，心中诚信，行而有获。', en: 'The Abysmal (Water).' },
  '离': { p: 'Lí', g: '利贞，亨。', e: '附着光明，智慧洞察，内心依傍。', en: 'The Clinging, Fire.' },
  '咸': { p: 'Xián', g: '亨，利贞。', e: '相互感应，至诚相待，婚姻美满。', en: 'Influence (Wooing).' },
  '恒': { p: 'Héng', g: '亨，无咎。', e: '持之之恒，守正不渝，长久之道。', en: 'Duration.' },
  '遁': { p: 'Dùn', g: '亨，小利贞。', e: '隐退保存，不宜进取，明哲保身。', en: 'Retreat.' },
  '大壮': { p: 'Dà Zhuàng', g: '利贞。', e: '阳刚盛大，严于律己，不可轻举。', en: 'The Power of the Great.' },
  '晋': { p: 'Jìn', g: '康侯用锡马。', e: '积极进取，如日升空，德望日增。', en: 'Progress.' },
  '明夷': { p: 'Míng Yí', g: '利艰贞。', e: '光明受损，隐忍智慧，内心清明。', en: 'Darkening of the Light.' },
  '家人': { p: 'Jiā Rén', g: '利女贞。', e: '治家有方，伦理有序，内外有别。', en: 'The Family.' },
  '睽': { p: 'Kuí', g: '小事吉。', e: '异中求同，和而不同，矛盾中寻契机。', en: 'Opposition.' },
  '蹇': { p: 'Jiǎn', g: '利西南。', e: '跋涉艰难，反求诸己，寻求援手。', en: 'Obstruction.' },
  '解': { p: 'Xiè', g: '利西南。', e: '缓解压力，灾难消散，宜休养。', en: 'Deliverance.' },
  '损': { p: 'Sǔn', g: '有孚，元吉。', e: '减损欲望，增益内涵，损益相依。', en: 'Decrease.' },
  '益': { p: 'Yì', g: '利有攸往。', e: '造福大众，自我提升，积极进取。', en: 'Increase.' },
  '夬': { p: 'Guài', g: '扬于王庭。', e: '果断决策，剪除邪恶，正义伸张。', en: 'Break-through (Resoluteness).' },
  '姤': { p: 'Gòu', g: '女壮。', e: '邂逅相遇，柔能克刚，警惕微变。', en: 'Coming to Meet.' },
  '萃': { p: 'Cuì', g: '亨。', e: '精英荟萃，团结凝聚，祭祀先祖。', en: 'Gathering Together (Massing).' },
  '升': { p: 'Shēng', g: '元亨。', e: '顺势上升，积小成大，寻求助力。', en: 'Pushing Upward.' },
  '困': { p: 'Kùn', g: '亨，贞。', e: '身处逆境，守正不挠，言辞不信。', en: 'Oppression (Exhaustion).' },
  '井': { p: 'Jǐng', g: '改邑不改井。', e: '泉源不竭，服务大众，修德为本。', en: 'The Well.' },
  '革': { p: 'Gé', g: '已日乃孚。', e: '顺应天命，改弦更张，革新旧俗。', en: 'Revolution (Molting).' },
  '鼎': { p: 'Dǐng', g: '元吉，亨。', e: '革故鼎新，稳重权威，任用贤能。', en: 'The Cauldron.' },
  '震': { p: 'Zhèn', g: '亨。', e: '雷霆震撼，警醒自省，处变不惊。', en: 'The Arousing (Shock, Thunder).' },
  '艮': { p: 'Gèn', g: '艮其背。', e: '止其当止，知行合一，内心安静。', en: 'Keeping Still, Mountain.' },
  '渐': { p: 'Jiàn', g: '女归吉。', e: '循序渐进，持之以恒，必有大成。', en: 'Development (Gradual Progress).' },
  '归妹': { p: 'Guī Mèi', g: '征凶。', e: '少女出嫁，不循法度，慎终追远。', en: 'The Marrying Maiden.' },
  '丰': { p: 'Fēng', g: '亨，王假之。', e: '丰盛盛大，日中必昃，居安善思。', en: 'Abundance (Fullness).' },
  '旅': { p: 'Lǚ', g: '小亨。', e: '羁旅漂泊，守持正道，小心行事。', en: 'The Wanderer.' },
  '巽': { p: 'Xùn', g: '小亨。', e: '顺从渗透，无孔不入，重申法度。', en: 'The Gentle (The Penetrating, Wind).' },
  '兑': { p: 'Duì', g: '亨，利贞。', e: '喜悦交流，和睦待人，诚信为本。', en: 'The Joyous, Lake.' },
  '涣': { p: 'Huàn', g: '亨。', e: '人心涣散，凝聚力量，破除隔阂。', en: 'Dispersion (Dissolution).' },
  '节': { p: 'Jié', g: '亨。', e: '节制适度，遵守规则，不可过苦。', en: 'Limitation.' },
  '中孚': { p: 'Zhōng Fú', g: '豚鱼吉。', e: '至诚感物，内心诚信，万事亨通。', en: 'Inner Truth.' },
  '小过': { p: 'Xiǎo Guò', g: '亨，利贞。', e: '微有过失，小事可行，注意细节。', en: 'Preponderance of the Small.' },
  '既济': { p: 'Jì Jì', g: '亨，小利贞。', e: '功德圆满，慎终如始，防患未然。', en: 'After Completion.' },
  '未济': { p: 'Wèi Jì', g: '亨。', e: '事业未竟，充满希望，继续努力。', en: 'Before Completion.' }
};

const shaoyongSquareNames = [
  '坤', '剥', '比', '观', '豫', '晋', '萃', '否',
  '谦', '艮', '蹇', '渐', '小过', '旅', '咸', '遁',
  '师', '蒙', '坎', '涣', '解', '未济', '困', '讼',
  '升', '蛊', '井', '巽', '恒', '鼎', '大过', '姤',
  '复', '颐', '屯', '益', '震', '噬嗑', '随', '无妄',
  '明夷', '贲', '既济', '家人', '丰', '离', '革', '同人',
  '临', '损', '节', '中孚', '归妹', '睽', '兑', '履',
  '泰', '大畜', '需', '小畜', '大壮', '大有', '夬', '乾'
];

export const KING_WEN_NAMES = [
  '乾', '坤', '屯', '蒙', '需', '讼', '师', '比', '小畜', '履',
  '泰', '否', '同人', '大有', '谦', '豫', '随', '蛊', '临', '观',
  '噬嗑', '贲', '剥', '复', '无妄', '大畜', '颐', '大过', '坎', '离',
  '咸', '恒', '遁', '大壮', '晋', '明夷', '家人', '睽', '蹇', '解',
  '损', '益', '夬', '姤', '萃', '升', '困', '井', '革', '鼎',
  '震', '艮', '渐', '归妹', '丰', '旅', '巽', '兑', '涣', '节',
  '中孚', '小过', '既济', '未济'
];

const trigramMap: Record<string, number[]> = {
  kun: [0, 0, 0], gen: [0, 0, 1], kan: [0, 1, 0], xun: [0, 1, 1],
  zhen: [1, 0, 0], li: [1, 0, 1], dui: [1, 1, 0], qian: [1, 1, 1]
};

const trigramIds = ['kun', 'gen', 'kan', 'xun', 'zhen', 'li', 'dui', 'qian'];

const hexPool: Record<string, { upper: string, lower: string, lines: number[] }> = {};

for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    const lowerId = trigramIds[i]; 
    const upperId = trigramIds[j];
    const lines = [...trigramMap[lowerId], ...trigramMap[upperId]];
    const name = shaoyongSquareNames[i * 8 + j];
    hexPool[name] = { upper: upperId, lower: lowerId, lines: lines };
  }
}

export const HEXAGRAMS: Hexagram[] = shaoyongSquareNames.map((name, index) => ({
  id: index,
  name: name,
  nameEn: HEX_DETAILS[name]?.en || name,
  pinyin: HEX_DETAILS[name]?.p || '',
  guaCi: HEX_DETAILS[name]?.g || '',
  explanation: HEX_DETAILS[name]?.e || '',
  upper: hexPool[name].upper,
  lower: hexPool[name].lower,
  lines: hexPool[name].lines,
  meaning: HEX_DETAILS[name]?.e || "I Ching Hexagram"
}));

export const KING_WEN_HEXAGRAMS: Hexagram[] = KING_WEN_NAMES.map((name, index) => {
  const hex = HEXAGRAMS.find(h => h.name === name);
  return {
    id: index + 1000,
    name: name,
    nameEn: HEX_DETAILS[name]?.en || name,
    pinyin: HEX_DETAILS[name]?.p || '',
    guaCi: HEX_DETAILS[name]?.g || '',
    explanation: HEX_DETAILS[name]?.e || '',
    upper: hex?.upper || 'qian',
    lower: hex?.lower || 'qian',
    lines: hex?.lines || [1,1,1,1,1,1],
    meaning: HEX_DETAILS[name]?.e || `King Wen Sequence #${index + 1}`
  };
});

/**
 * Full collection of 64 Idioms
 */
export const ICHING_IDIOMS: Idiom[] = [
  { text: '自强不息', textEn: 'Self-Improvement', hexId: 1000, origin: '《乾·象传》：天行健，君子以自强不息。', originEn: 'The Creative. The superior man makes himself strong.' },
  { text: '厚德载物', textEn: 'Profound Virtue', hexId: 1001, origin: '《坤·象传》：地势坤，君子以厚德载物。', originEn: 'The Receptive. The superior man supports all with virtue.' },
  { text: '潜龙勿用', textEn: 'Hidden Dragon', hexId: 1000, origin: '《乾·初九》：潜龙勿用。', originEn: 'Hidden dragon. Do not act.' },
  { text: '亢龙有悔', textEn: 'Arrogant Dragon', hexId: 1000, origin: '《乾·上九》：上九，亢龙有悔。', originEn: 'Arrogant dragon will have cause to repent.' },
  { text: '朝乾夕惕', textEn: 'Daily Vigilance', hexId: 1000, origin: '《乾·九三》：君子终日乾乾，夕惕若。', originEn: 'Active all day, vigilant at night.' },
  { text: '积善余庆', textEn: 'Accumulated Good', hexId: 1001, origin: '《坤·文言》：积善之家，必有余庆。', originEn: 'House that accumulates good will have surplus joy.' },
  { text: '见微知著', textEn: 'Recognize the Slight', hexId: 1001, origin: '《坤·文言》：履霜，坚冰至。', originEn: 'When there is hoarfrost, solid ice is near.' },
  { text: '龙战于野', textEn: 'Dragons Battle', hexId: 1001, origin: '《坤·上六》：龙战于野，其血玄黄。', originEn: 'Dragons fight in the meadow. Their blood is black and yellow.' },
  { text: '防微杜渐', textEn: 'Nip in the Bud', hexId: 1001, origin: '《坤·初六》：履霜坚冰至。', originEn: 'Prevent problems while they are small.' },
  { text: '黄裳元吉', textEn: 'Yellow Robe', hexId: 1001, origin: '《坤·六五》：黄裳元吉。', originEn: 'A yellow lower garment brings supreme good fortune.' },
  { text: '不速之客', textEn: 'Uninvited Guest', hexId: 1004, origin: '《需·上六》：有不速之客三人来。', originEn: 'Three uninvited guests arrive.' },
  { text: '履险如夷', textEn: 'Walk on Danger', hexId: 1009, origin: '《履·象传》：幽人贞吉，中不自乱。', originEn: 'Treading as if on flat ground despite danger.' },
  { text: '否极泰来', textEn: 'Peace follows Standstill', hexId: 1010, origin: '《否/泰》：事物发展到极端必会逆转。', originEn: 'When the bad ends, the good begins.' },
  { text: '三阳开泰', textEn: 'Three Yangs Bring Peace', hexId: 1010, origin: '《泰》：万象更新。', originEn: 'The spring returns with all things fresh.' },
  { text: '谦谦君子', textEn: 'Modest Superior Man', hexId: 1014, origin: '《谦·初六》：谦谦君子，用涉大川。', originEn: 'A modest man may cross the great water.' },
  { text: '出入无疾', hexId: 1023, textEn: 'No Illness Going Out', origin: '《复·卦辞》：出入无疾，朋来无咎。', originEn: 'Coming and going without illness.' },
  { text: '虎视眈眈', textEn: 'Tiger Glaring', hexId: 1026, origin: '《颐·六四》：虎视眈眈，其欲逐逐。', originEn: 'Glaring like a tiger with insatiable desire.' },
  { text: '枯杨生稊', textEn: 'New Shoots on Dry Tree', hexId: 1027, origin: '《大过·九二》：枯杨生稊。', originEn: 'A withered willow puts forth new shoots.' },
  { text: '突如其来', textEn: 'Sudden Arrival', hexId: 1029, origin: '《离·九四》：突如其来如，焚如。', originEn: 'It comes suddenly, like fire.' },
  { text: '见险而止', textEn: 'Stop at Danger', hexId: 1038, origin: '《蹇·彖传》：见险而止，知矣哉。', originEn: 'To stop when danger is seen is true wisdom.' },
  { text: '改邑不改井', textEn: 'Change Village not Well', hexId: 1047, origin: '《井·卦辞》：改邑不改井。', originEn: 'The village may be moved, but not the well.' },
  { text: '革故鼎新', textEn: 'Reform and Renewal', hexId: 1048, origin: '《革/鼎》：废除旧制，建立新象。', originEn: 'Remove the old and establish the new.' },
  { text: '洗心革面', textEn: 'Wash Heart Change Face', hexId: 1048, origin: '《革·象传》：小人革面。', originEn: 'The inferior man changes his face (reforms).' },
  { text: '君子豹变', textEn: 'Leopard Change', hexId: 1048, origin: '《革·上六》：君子豹变。', originEn: 'The superior man changes like a leopard.' },
  { text: '涣然冰释', textEn: 'Melt Like Ice', hexId: 1058, origin: '《涣·卦辞》：涣，亨。', originEn: 'Doubts melt away like thawing ice.' },
  { text: '信及豚鱼', textEn: 'Faith to Fish', hexId: 1060, origin: '《中孚·卦辞》：中孚，豚鱼吉。', originEn: 'Truth reaches even to pigs and fishes.' },
  { text: '错综复杂', textEn: 'Interwoven and Complex', hexId: 1063, origin: '《系辞上》：错综其数。', originEn: 'Intricate and complicated patterns.' },
  { text: '殊途同归', textEn: 'Different Paths Same Goal', hexId: 1063, origin: '《系辞下》：天下同归而殊途。', originEn: 'All paths lead to the same destination.' },
  { text: '乐天知命', textEn: 'Content with Fate', hexId: 1063, origin: '《系辞上》：乐天知命，故不忧。', originEn: 'Joyful in heaven, aware of destiny.' },
  { text: '物以类聚', textEn: 'Things Flock Together', hexId: 1063, origin: '《系辞上》：方以类聚，物以群分。', originEn: 'Like attracts like.' },
  { text: '穷则思变', textEn: 'Change in Adversity', hexId: 1063, origin: '《系辞下》：穷则变，变则通。', originEn: 'When at an impasse, change occurs.' },
  { text: '触类旁通', textEn: 'Analogy and Insight', hexId: 1063, origin: '《系辞上》：触类而长之。', originEn: 'Understanding one thing leads to many.' },
  { text: '极数知来', textEn: 'Knowing the Future', hexId: 1063, origin: '《系辞上》：极数知来。', originEn: 'Reaching the numbers to know the future.' },
  { text: '安不忘危', textEn: 'Safe not Forgetting Peril', hexId: 1063, origin: '《系辞下》：安而不忘危。', originEn: 'Stay alert even when secure.' },
  { text: '原始要终', textEn: 'Trace the End', hexId: 1063, origin: '《系辞下》：原始要终。', originEn: 'Trace the beginning to know the end.' },
  { text: '开物成务', textEn: 'Fulfill Tasks', hexId: 1063, origin: '《系辞上》：开物成务。', originEn: 'Opening up things to accomplish tasks.' },
  { text: '神机妙算', textEn: 'Divine Calculation', hexId: 1063, origin: '《系辞下》：知微知彰。', originEn: 'Profound foresight and planning.' },
  { text: '以此类推', textEn: 'And so On', hexId: 1063, origin: '《系辞下》：引而伸之。', originEn: 'Extending by analogy.' },
  { text: '刚柔并济', textEn: 'Balance Firm and Soft', hexId: 1063, origin: '《系辞上》：刚柔相推。', originEn: 'The firm and soft interact.' },
  { text: '神而明之', textEn: 'Divine Understanding', hexId: 1063, origin: '《系辞上》：神而明之。', originEn: 'Profoundly understanding and applying.' },
  { text: '蒙以养正', textEn: 'Correct Nourishment', hexId: 1003, origin: '《蒙·彖传》：蒙以养正。', originEn: 'Cultivating correctness in the young.' },
  { text: '密云不雨', textEn: 'Clouds but No Rain', hexId: 1008, origin: '《小畜·卦辞》：密云不雨。', originEn: 'Dense clouds, no rain.' },
  { text: '如履薄冰', textEn: 'Treading on Thin Ice', hexId: 1009, origin: '《履·九四》：履虎尾，愬愬终吉。', originEn: 'Treading as if on thin ice.' },
  { text: '同人于野', textEn: 'Fellowship in the Open', hexId: 1012, origin: '《同人·卦辞》：同人于野。', originEn: 'Fellowship with men in the open.' },
  { text: '自天佑之', textEn: 'Heaven Blesses', hexId: 1013, origin: '《大有·上九》：自天佑之。', originEn: 'Blessing from heaven.' },
  { text: '卑以自牧', textEn: 'Self-Cultivation in Humility', hexId: 1014, origin: '《谦·象传》：卑以自牧。', originEn: 'Keeping oneself in check through humility.' },
  { text: '雷出地奋', textEn: 'Thunder Arouses', hexId: 1015, origin: '《豫·象传》：雷出地奋。', originEn: 'Thunder comes forth from the earth.' },
  { text: '随时之义', textEn: 'Meaning of Time', hexId: 1016, origin: '《随·彖传》：随时之义。', originEn: 'The meaning of the time is great.' },
  { text: '拨乱反正', textEn: 'Rectify Chaos', hexId: 1017, origin: '《蛊·象传》：振民育德。', originEn: 'Restoring order from chaos.' },
  { text: '观国之光', textEn: 'View Glory of Kingdom', hexId: 1019, origin: '《观·六四》：观国之光。', originEn: 'Viewing the glory of the kingdom.' },
  { text: '刚柔相济', textEn: 'Firm Soft Interplay', hexId: 1063, origin: '《系辞传》：刚柔相推。', originEn: 'Interplay of firm and soft.' },
  { text: '一阳来复', textEn: 'Return of the One Yang', hexId: 1023, origin: '《复·卦辞》：七日来复。', originEn: 'The return of light.' },
  { text: '多识前言', textEn: 'Extensive Learning', hexId: 1025, origin: '《大畜·象传》：多识前言。', originEn: 'Acquiring knowledge of the past.' },
  { text: '颐养天年', textEn: 'Nourish Life', hexId: 1026, origin: '《颐·卦辞》：观颐。', originEn: 'Nourishing oneself properly.' },
  { text: '独立不惧', textEn: 'Fearless Independence', hexId: 1027, origin: '《大过·象传》：独立不惧。', originEn: 'Standing alone without fear.' },
  { text: '化成天下', textEn: 'Transform the World', hexId: 1021, origin: '《贲·彖传》：化成天下。', originEn: 'Transforming and completing the world.' },
  { text: '慎终如始', textEn: 'Careful to the End', hexId: 1062, origin: '《既济·象传》：慎终如始。', originEn: 'Caring for the end as for the beginning.' },
  { text: '终日乾乾', textEn: 'Active All Day', hexId: 1000, origin: '《乾·九三》：终日乾乾。', originEn: 'Creative and active all day.' },
  { text: '知微知彰', textEn: 'Knowing the Small and Clear', hexId: 1063, origin: '《系辞下》：知微知彰。', originEn: 'Knowing both the minute and the manifest.' },
  { text: '舍尔灵龟', textEn: 'Abandon the Magic Tortoise', hexId: 1026, origin: '《颐·初九》：舍尔灵龟。', originEn: 'Abandoning your own magic tortoise.' },
  { text: '进德修业', textEn: 'Improve Virtue', hexId: 1000, origin: '《乾·文言》：进德修业。', originEn: 'Advancing in virtue and work.' },
  { text: '损益相间', textEn: 'Increase and Decrease', hexId: 1040, origin: '《损·益》：损益，盛衰之始。', originEn: 'Alternating loss and gain.' },
  { text: '精义入神', textEn: 'Profound Meaning', hexId: 1063, origin: '《系辞下》：精义入神。', originEn: 'Essential meaning penetrates the spirit.' },
  { text: '有备无患', textEn: 'Prepared No Peril', hexId: 1015, origin: '《豫·象传》：有备无患。', originEn: 'Being prepared avoids calamity.' }
];
