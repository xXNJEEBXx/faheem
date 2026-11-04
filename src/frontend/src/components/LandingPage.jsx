import React, { useState, useEffect } from "react";
import FaheemAvatar from "./FaheemAvatar";
import LiveChatDemo from "./LiveChatDemo";

const LandingPage = ({ onStartChat, onStartChallenge, onAbout, onResults }) => {
  const [avatarState, setAvatarState] = useState("wink");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAvatarState("idle");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden flex flex-col transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-b from-absher-light to-white text-gray-900'}`}>
      <header className="w-full p-6 flex justify-between items-center z-20">
        <div className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-absher-green'}`}>
          فهيم | Faheem
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:scale-105 transition-all shadow-sm flex items-center justify-center text-lg"
            title="تغيير الوضع المظلم"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          
          <button
            onClick={onResults}
            className={`text-sm transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            الإحصائيات
          </button>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>نسخة تجريبية (Demo)</div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-8 animate-fade-in-up order-1">
            <div
              className="relative group cursor-pointer self-center md:self-start"
              onClick={() => setAvatarState("wink")}
            >
              <FaheemAvatar state={avatarState} size="xl" />
              <div className="absolute bottom-0 right-0 bg-absher-green text-white text-xs px-2 py-1 rounded-full shadow-md transform translate-y-1/2">
                أنا فهيم!
              </div>
            </div>

            <div className="space-y-4">
              <h1 className={`text-4xl md:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                هلا، أنا <span className={isDark ? 'text-emerald-400' : 'text-absher-green'}>فهيم</span>
              </h1>
              <p className={`text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                مساعدك الذكي الجديد في أبشر. <br />
                أفهمك، وأخدمك بروح إنسانية، وبدون تعقيد.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full justify-center md:justify-start mt-8">
              <button
                onClick={onStartChallenge}
                className={`px-8 py-4 border-2 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${isDark ? 'bg-gray-800 text-emerald-400 border-emerald-500 hover:bg-gray-700' : 'bg-white text-absher-green border-absher-green hover:bg-gray-50'}`}
              >
                <span>تحدي أبشر</span>
                <span>🏆</span>
              </button>
              <button
                onClick={onAbout}
                className={`px-8 py-4 border-2 border-transparent rounded-xl text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${isDark ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/55' : 'bg-absher-green/10 text-absher-green hover:bg-absher-green/20'}`}
              >
                <span>عن فهيم</span>
              </button>
            </div>
          </div>

          <div className="relative order-2 flex justify-center md:justify-end">
            <div className="absolute -inset-4 bg-gradient-to-tr from-absher-green to-emerald-400 rounded-[2.5rem] opacity-20 blur-xl animate-pulse"></div>
            <div className="relative z-10 w-full max-w-md transform scale-90 md:scale-100 origin-top">
              <LiveChatDemo />
            </div>
          </div>
        </div>
      </main>

      <footer className={`w-full text-center py-4 text-xs mt-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        تطوير فريق فهيم © 2025
      </footer>
    </div>
  );
};

export default LandingPage;
