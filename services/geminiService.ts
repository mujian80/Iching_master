
import { GoogleGenAI } from "@google/genai";

export const getGeminiFeedback = async (score: number, errors: string[], lang: 'zh' | 'en' = 'zh') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = lang === 'zh' 
      ? `我正在学习周易八卦。在刚才的拼图互动中，我得到了 ${score} 分（总分 100）。
         我犯了以下错误：${errors.length > 0 ? errors.join('、') : '没有错误' }。
         请以一位睿智而和蔼的国学导师的身份，对我进行点评：
         1. 鼓励我的学习。
         2. 针对我的错误，用简单易懂的话语解释相关的卦象、自然规律或节气联系。
         3. 给出一个关于周易的小知识点作为今日的学习彩蛋。
         字数控制在200字以内，语气要儒雅。`
      : `I am learning the I Ching. In a recent interactive puzzle, I scored ${score} out of 100.
         Errors I made: ${errors.length > 0 ? errors.join(', ') : 'None'}.
         Please act as a wise and kind I Ching mentor and provide feedback:
         1. Encourage my learning progress.
         2. Explain the related trigrams, natural laws, or solar term connections for my mistakes in simple terms.
         3. Provide a small interesting fact about I Ching as a "learning egg."
         Keep it under 150 words, using a graceful and scholarly tone.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || (lang === 'zh' ? "卦象微妙，勤学必有大成。继续加油。" : "The signs are subtle; diligence leads to greatness. Keep going.");
  } catch (error) {
    console.error("Gemini Error:", error);
    return lang === 'zh' 
      ? "天行健，君子以自强不息。学习周易是一个循序渐进的过程。" 
      : "The Heaven moves with vigor; the superior man strengthens himself ceaselessly. Learning I Ching is a step-by-step journey.";
  }
};

export const getTrigramWisdom = async (trigramName: string, lang: 'zh' | 'en' = 'zh') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = lang === 'zh'
      ? `简短解释《易经》中“${trigramName}”卦的含义、象数特点以及它在现代生活中的启示。`
      : `Briefly explain the meaning, symbol characteristics, and modern life insights of the trigram "${trigramName}" in the I Ching.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return lang === 'zh' ? "易道广大，不可须臾离也。" : "The Way of Change is vast and ever-present.";
  }
};

export const getIdiomWisdom = async (idiom: string, lang: 'zh' | 'en' = 'zh') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = lang === 'zh'
      ? `成语“${idiom}”出自《易经》哪里？它的原始卦意是什么？在现代为人处世中有什么智慧启示？字数控制在150字。`
      : `Where does the idiom "${idiom}" originate in the I Ching? What is its original hexagram meaning? What wisdom does it offer for modern conduct? Limit to 100 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    return lang === 'zh' ? "成语中蕴含着深邃的周易智慧。" : "Deep wisdom is contained within these idioms.";
  }
};
