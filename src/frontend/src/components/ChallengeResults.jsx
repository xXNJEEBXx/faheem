import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminRegistration from "./AdminRegistration";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const ChallengeResults = ({
  onBack,
  token,
  onUnauthorized,
  isDark = false,
  toggleDarkMode,
  lang = "en",
  toggleLang,
}) => {
  const isEn = lang === "en";
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    setError("");
    try {
      await axios.post(
        `${API_BASE_URL}/admin/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUnauthorized();
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) onUnauthorized();
      else
        setError(
          isEn
            ? "Unable to sign out. Please try again."
            : "تعذر تسجيل الخروج. حاول مرة أخرى."
        );
    } finally {
      setLoggingOut(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_BASE_URL}/chat/challenges`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then((res) => {
        setChallenges(res.data.challenges);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;
        if ([401, 403].includes(err.response?.status)) {
          onUnauthorized();
          return;
        }
        setError(
          isEn
            ? "Unable to load results. Please try again."
            : "تعذر تحميل النتائج. حاول مرة أخرى."
        );
        setLoading(false);
      });
    return () => controller.abort();
  }, [token, onUnauthorized, isEn]);

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      dir={isEn ? "ltr" : "rtl"}
    >
      <header className="max-w-5xl mx-auto flex flex-wrap items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`flex items-center text-sm gap-2 font-bold px-4 py-2 rounded-xl shadow-sm border transition-colors ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-200 hover:text-emerald-400"
              : "bg-white border-transparent text-gray-500 hover:text-absher-green"
          }`}
        >
          <svg
            className={`w-5 h-5 ${isEn ? "transform rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
          {isEn ? "Back" : "العودة"}
        </button>

        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          {isEn ? "Statistics 📊" : "الإحصائيات 📊"}
        </h1>

        <div
          className={`${
            isEn ? "ml-auto" : "mr-auto"
          } flex items-center gap-3`}
        >
          {toggleLang && (
            <button
              onClick={toggleLang}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold border shadow-sm transition-all ${
                isDark
                  ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {isEn ? "عربي" : "EN"}
            </button>
          )}
          {toggleDarkMode && (
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl border shadow-sm transition-all flex items-center justify-center ${
                isDark
                  ? "bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          )}
          <button
            onClick={logout}
            disabled={loggingOut}
            className={`text-sm font-bold px-3 py-1.5 rounded-xl border transition-colors disabled:opacity-50 ${
              isDark
                ? "text-red-400 border-red-900/50 hover:bg-red-950/40"
                : "text-red-700 border-red-100 hover:bg-red-50"
            }`}
          >
            {loggingOut
              ? isEn
                ? "Signing out..."
                : "جاري الخروج..."
              : isEn
              ? "Sign out"
              : "تسجيل الخروج"}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        <AdminRegistration
          token={token}
          onUnauthorized={onUnauthorized}
          isDark={isDark}
          lang={lang}
        />
        {error && (
          <p
            role="alert"
            className={`mb-6 rounded-xl p-4 ${
              isDark
                ? "bg-red-950/60 text-red-300 border border-red-900/50"
                : "bg-red-50 text-red-700"
            }`}
          >
            {error}
          </p>
        )}
        {loading ? (
          <div
            className={`text-center py-20 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {isEn ? "Loading results..." : "جاري تحميل النتائج..."}
          </div>
        ) : error ? null : challenges.length === 0 ? (
          <div
            className={`text-center py-20 rounded-2xl shadow-sm border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-gray-400"
                : "bg-white border-transparent text-gray-500"
            }`}
          >
            {isEn
              ? "No challenges have been played yet."
              : "لا توجد تحديات ملعوبة حتى الآن."}
          </div>
        ) : (
          <div className="grid gap-6">
            {challenges.map((challenge, index) => (
              <div
                key={challenge.id}
                className={`p-6 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-6 items-start transition-colors ${
                  isDark
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                {/* Result Summary Card */}
                <div
                  className={`w-full md:w-1/3 flex flex-col gap-3 p-4 rounded-xl border ${
                    isDark
                      ? "bg-gray-900/60 border-gray-700"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {isEn
                      ? `Challenge #${challenges.length - index}`
                      : `تحدي رقم #${challenges.length - index}`}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      {isEn ? "Detected correctly?" : "هل اكتشف الخدعة؟"}
                    </span>
                    {challenge.is_correct ? (
                      <span
                        className={`font-bold px-2 py-1 rounded-lg ${
                          isDark
                            ? "bg-green-950/60 text-green-300 border border-green-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isEn ? "Yes ✅" : "نعم ✅"}
                      </span>
                    ) : (
                      <span
                        className={`font-bold px-2 py-1 rounded-lg ${
                          isDark
                            ? "bg-red-950/60 text-red-300 border border-red-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {isEn ? "No ❌" : "لا ❌"}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      {isEn ? "Actual Opponent:" : "الخصم الحقيقي:"}
                    </span>
                    <span
                      className={`font-bold ${
                        isDark ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {challenge.actual_identity === "ai"
                        ? isEn
                          ? "🤖 Faheem (AI)"
                          : "🤖 فهيم (AI)"
                        : isEn
                        ? "👤 Human"
                        : "👤 إنسان"}
                    </span>
                  </div>

                  <div
                    className={`flex justify-between items-center text-sm border-b pb-2 ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                    >
                      {isEn ? "Player Guess:" : "توقع اللاعب:"}
                    </span>
                    <span
                      className={`font-bold ${
                        isDark ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      {challenge.user_guess === "ai"
                        ? isEn
                          ? "🤖 Faheem (AI)"
                          : "🤖 فهيم (AI)"
                        : isEn
                        ? "👤 Human"
                        : "👤 إنسان"}
                    </span>
                  </div>

                  <div
                    className={`text-xs mt-2 ${
                      isEn ? "text-right" : "text-left"
                    } ${isDark ? "text-gray-500" : "text-gray-400"}`}
                  >
                    {new Date(challenge.created_at).toLocaleString(
                      isEn ? "en-US" : "ar-SA",
                      {
                        dateStyle: "short",
                        timeStyle: "short",
                      }
                    )}
                  </div>
                </div>

                {/* Conversation Output */}
                <div className="w-full md:w-2/3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  <h3
                    className={`text-sm font-bold mb-3 sticky top-0 pb-2 ${
                      isDark
                        ? "bg-gray-800 text-gray-400"
                        : "bg-white text-gray-400"
                    }`}
                  >
                    {isEn ? "Conversation Log:" : "سجل المحادثة:"}
                  </h3>
                  {challenge.conversation?.messages?.length > 0 ? (
                    <div className="space-y-3">
                      {challenge.conversation.messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            msg.sender_type === "user"
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          <div
                            className={`text-sm px-4 py-2 rounded-2xl max-w-[85%] ${
                              msg.sender_type === "user"
                                ? isDark
                                  ? "bg-gray-700 text-gray-100 rounded-tr-sm"
                                  : "bg-gray-100 text-gray-800 rounded-tr-sm"
                                : isDark
                                ? "bg-emerald-950/50 text-emerald-200 rounded-tl-sm border border-emerald-800/50"
                                : "bg-[#007C5A]/10 text-gray-800 rounded-tl-sm border border-[#007C5A]/20"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      className={`text-sm ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      {isEn
                        ? "No messages recorded in this session."
                        : "لا يوجد رسائل أو انتهت بدون حديث."}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ChallengeResults;
