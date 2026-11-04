import React, { useState, useEffect } from "react";
import FaheemAvatar from "./FaheemAvatar";
import LiveChatDemo from "./LiveChatDemo";

const LandingPage = ({ onStartChat, onStartChallenge, onAbout, onResults }) => {
  const [avatarState, setAvatarState] = useState("wink");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // التأكد أن البداية دائماً بيضاء (Light Mode) عند تحميل الصفحة
    document.documentElement.classList.remove("dark");
    setIsDark(false);

    const timer = setTimeout(() => {
      setAvatarState("idle");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    const htmlEl = document.documentElement;
    htmlEl.classList.toggle("dark");
    setIsDark(htmlEl.classList.contains("dark"));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-absher-light to-white dark:from-gray-950 dark:to-gray-900 dark:text-gray-100 overflow-x-hidden flex flex-col transition-colors duration-300">
      <header className="w-full p-6 flex justify-between items-center z-20">
        <div className="text-2xl font-bold text-absher-green dark:text-emerald-400">
          فهيم | Faheem
        </div>
        <div className="flex items-center gap-4">
          {/* زر تبديل الدارك مود */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-yellow-400 hover:scale-105 transition-all shadow-sm flex items-center justify-center text-lg"
            title="تغيير الوضع المظلم"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          
          <button
            onClick={onResults}
            className="text-sm text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white transition-colors"
          >
            الإحصائيات
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400">نسخة تجريبية (Demo)</div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Right Column: Intro & Actions */}
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
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white">
                هلا، أنا <span className="text-absher-green dark:text-emerald-400">فهيم</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                مساعدك الذكي الجديد في أبشر. <br />
                أفهمك، وأخدمك بروح إنسانية، وبدون تعقيد.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full justify-center md:justify-start mt-8">
              <button
                onClick={onStartChallenge}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-absher-green dark:text-emerald-400 border-2 border-absher-green dark:border-emerald-500 rounded-xl text-lg font-bold shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>تحدي أبشر</span>
                <span>🏆</span>
              </button>
              <button
                onClick={onAbout}
                className="px-8 py-4 bg-absher-green/10 dark:bg-emerald-950/40 text-absher-green dark:text-emerald-400 border-2 border-transparent rounded-xl text-lg font-bold hover:bg-absher-green/20 dark:hover:bg-emerald-900/55 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>عن فهيم</span>
              </button>
            </div>
          </div>

          {/* Left Column: Live Chat Demo */}
          <div className="relative order-2 flex justify-center md:justify-end">
            {/* Phone Frame Effect */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-absher-green to-emerald-400 rounded-[2.5rem] opacity-20 blur-xl animate-pulse"></div>
            <div className="relative z-10 w-full max-w-md transform scale-90 md:scale-100 origin-top">
              <LiveChatDemo />
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full text-center py-4 text-gray-400 dark:text-gray-500 text-xs mt-auto">
        تطوير فريق فهيم © 2025
      </footer>
    </div>
  );
};

export default LandingPage;
