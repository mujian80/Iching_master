
import React, { useState } from 'react';
import { User, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, lang }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(lang);
  const [error, setError] = useState('');

  const t = TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError(lang === 'zh' ? '请输入用户名和密码' : 'Please enter username and password');
      return;
    }

    const users = JSON.parse(localStorage.getItem('iching_users') || '[]');

    if (isSignup) {
      if (users.find((u: any) => u.username === username)) {
        setError(lang === 'zh' ? '用户名已存在' : 'Username already exists');
        return;
      }
      const newUser = { username, password, preferredLang: prefLang };
      users.push(newUser);
      localStorage.setItem('iching_users', JSON.stringify(users));
      localStorage.setItem('iching_user', JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      const user = users.find((u: any) => u.username === username && u.password === password);
      if (user) {
        localStorage.setItem('iching_user', JSON.stringify(user));
        onLogin(user);
      } else {
        setError(lang === 'zh' ? '用户名或密码错误' : 'Invalid username or password');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-8 border border-gray-100 animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-gray-900">{isSignup ? t.signup : t.login}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.username}</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none font-bold"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.password}</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-1">{t.prefLang}</label>
              <div className="flex gap-2">
                {(['zh', 'en'] as const).map(l => (
                  <button 
                    key={l}
                    type="button"
                    onClick={() => setPrefLang(l)}
                    className={`flex-1 py-2 rounded-xl border-2 font-black transition-all ${prefLang === l ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-100 text-gray-400'}`}
                  >
                    {l === 'zh' ? '中文' : 'EN'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

          <button type="submit" className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all mt-4">
            {isSignup ? t.signup : t.login}
          </button>
        </form>

        <p className="mt-6 text-center text-sm font-bold text-gray-400">
          {isSignup ? (lang === 'zh' ? '已有账号？' : 'Already have an account? ') : (lang === 'zh' ? '还没账号？' : 'No account? ')}
          <button onClick={() => setIsSignup(!isSignup)} className="text-indigo-600 hover:underline">
            {isSignup ? t.login : t.signup}
          </button>
        </p>
      </div>
    </div>
  );
};
