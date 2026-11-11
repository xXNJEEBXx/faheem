import React, { useState, useEffect } from "react";
import FaheemAvatar from "./FaheemAvatar";
import LiveChatDemo from "./LiveChatDemo";

const LandingPage = ({
  onStartChallenge,
  onAbout,
  onResults,
  isDark,
  toggleDarkMode,
  lang = "en",
  toggleLang,
}) => {
  const [avatarState, setAvatarState] = useState("wink");
  const isEn = lang === "en";

  useEffect(() => {
    const timer = setTimeout(() => {
      setAvatarState("idle");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className={`min-h-screen overflow-x-hidden flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-absher-light to-white text-gray-900"
      }`}
    >
      <header className="w-full p-6 flex justify-between items-center z-20">
        <div
          className={`text-2xl font-bold ${
            isDark ? "text-emerald-400" : "text-absher-green"
          }`}
        >
          فهيم | Faheem
        </div>
        <div className="flex items-center gap-3">
          {toggleLang && (
            <button
              onClick={toggleLang}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${
                isDark
                  ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              title={isEn ? "تغيير اللغة للعربية" : "Switch to English"}
            >
              {isEn ? "عربي" : "EN"}
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all shadow-sm border flex items-center justify-center text-lg ${
              isDark
                ? "bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
            title={isEn ? "Toggle Dark Mode" : "تغيير الوضع المظلم"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          <button
            onClick={onResults}
            className={`text-sm font-medium transition-colors px-2 py-1 rounded-lg ${
              isDark
                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            Admin
          </button>
          <div
            className={`text-sm hidden sm:block ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {isEn ? "Demo Version" : "نسخة تجريبية (Demo)"}
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-12 items-center">
          <div
            className={`flex flex-col items-center md:items-start text-center ${
              isEn ? "md:text-left" : "md:text-right"
            } space-y-8 animate-fade-in-up order-1`}
          >
            <div
              className="relative group cursor-pointer self-center md:self-start"
              onClick={() => setAvatarState("wink")}
            >
              <FaheemAvatar state={avatarState} size="xl" />
              <div
                className={`absolute bottom-0 ${
                  isEn ? "left-0" : "right-0"
                } bg-absher-green text-white text-xs px-2 py-1 rounded-full shadow-md transform translate-y-1/2`}
              >
                {isEn ? "I'm Faheem!" : "أنا فهيم!"}
              </div>
            </div>

            <div className="space-y-4">
              <h1
                className={`text-4xl md:text-6xl font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {isEn ? "Hello, I'm " : "هلا، أنا "}
                <span
                  className={isDark ? "text-emerald-400" : "text-absher-green"}
                >
                  {isEn ? "Faheem" : "فهيم"}
                </span>
              </h1>
              <p
                className={`text-xl leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {isEn ? (
                  <>
                    Your new human-centric AI assistant for Absher. <br />I
                    understand your intent and serve you naturally, without
                    complexity.
                  </>
                ) : (
                  <>
                    مساعدك الذكي الجديد في أبشر. <br />
                    أفهمك، وأخدمك بروح إنسانية، وبدون تعقيد.
                  </>
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4 w-full justify-center md:justify-start mt-8">
              <button
                onClick={onStartChallenge}
                className={`px-8 py-4 border-2 rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-gray-800 text-emerald-400 border-emerald-500 hover:bg-gray-700"
                    : "bg-white text-absher-green border-absher-green hover:bg-gray-50"
                }`}
              >
                <span>{isEn ? "Absher Challenge" : "تحدي أبشر"}</span>
                <span>🏆</span>
              </button>
              <button
                onClick={onAbout}
                className={`px-8 py-4 border-2 border-transparent rounded-xl text-lg font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                  isDark
                    ? "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/55"
                    : "bg-absher-green/10 text-absher-green hover:bg-absher-green/20"
                }`}
              >
                <span>{isEn ? "About Faheem" : "عن فهيم"}</span>
              </button>
            </div>
          </div>

          <div className="relative order-2 flex justify-center md:justify-end">
            <div className="absolute -inset-4 bg-gradient-to-tr from-absher-green to-emerald-400 rounded-[2.5rem] opacity-20 blur-xl animate-pulse"></div>
            <div className="relative z-10 w-full max-w-md transform scale-90 md:scale-100 origin-top">
              <LiveChatDemo key={lang} isDark={isDark} lang={lang} />
            </div>
          </div>
        </div>
      </main>

      <footer
        className={`w-full text-center py-4 text-xs mt-auto ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {isEn
          ? "Developed by Faheem Team © 2026"
          : "تطوير فريق فهيم © 2026"}
      </footer>
    </div>
  );
};

export default LandingPage;
