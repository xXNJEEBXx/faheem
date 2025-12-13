import React, { useState, useEffect } from "react";
import FaheemAvatar from "./FaheemAvatar";
import LiveChatDemo from "./LiveChatDemo";

const LandingPage = ({ onStartChat, onStartChallenge }) => {
  const [avatarState, setAvatarState] = useState("wink");
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    // Initial wink then switch to idle
    const timer = setTimeout(() => {
      setAvatarState("idle");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-absher-light to-white overflow-x-hidden flex flex-col">
      <header className="w-full p-6 flex justify-between items-center z-20">
        <div className="text-2xl font-bold text-absher-green">
          فهيم | Faheem
        </div>
        <div className="text-sm text-gray-500">نسخة تجريبية (Demo)</div>
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
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
                هلا، أنا <span className="text-absher-green">فهيم</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                مساعدك الذكي الجديد في أبشر. <br />
                أفهمك، وأخدمك بروح إنسانية، وبدون تعقيد.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center md:justify-start mt-8">
              <button
                onClick={onStartChallenge}
                className="px-8 py-4 bg-white text-absher-green border-2 border-absher-green rounded-xl text-lg font-bold shadow-lg hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>تحدي أبشر</span>
                <span>🏆</span>
              </button>
            </div>

            {/* About Section */}
            <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-bold text-gray-800">ما هو فهيم؟</h3>
                    <p className="text-gray-600 text-sm">مساعد ذكي يفهم احتياجاتك ويخدمك بطريقة طبيعية وسلسة.</p>
                  </div>
                </div>

                {showMore && (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🧠</span>
                      <div>
                        <h3 className="font-bold text-gray-800">كيف يتعلم؟</h3>
                        <p className="text-gray-600 text-sm">يستخدم تقنيات التعلم المعزز (RLHF) للتطور من كل محادثة.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <h3 className="font-bold text-gray-800">الهدف</h3>
                        <p className="text-gray-600 text-sm">تحسين تجربة الخدمات الحكومية الرقمية للجميع.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h3 className="font-bold text-gray-800">تنويه</h3>
                        <p className="text-gray-600 text-sm">هذا ديمو تجريبي، لا يتم حفظ أي بيانات حساسة.</p>
                      </div>
                    </div>
                  </>
                )}

                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-absher-green font-medium text-sm hover:underline flex items-center gap-1 mt-2"
                >
                  {showMore ? "إخفاء" : "اقرأ المزيد"}
                  <svg
                    className={`w-4 h-4 transition-transform ${showMore ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
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

      <footer className="w-full text-center py-4 text-gray-400 text-xs mt-auto">
        تطوير فريق فهيم © 2025
      </footer>
    </div>
  );
};

export default LandingPage;
