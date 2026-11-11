import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const escapeHtml = (unsafe) => {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const AbsherChallenge = ({
  onBack,
  isDark = false,
  toggleDarkMode,
  lang = "en",
  toggleLang,
}) => {
  const isEn = lang === "en";
  const [sessionToken, setSessionToken] = useState(null);
  const [gameState, setGameState] = useState("disclaimer"); // disclaimer, lobby, searching, playing, verdict, result
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [opponentType, setOpponentType] = useState(null); // 'faheem' or 'human'
  const messagesEndRef = useRef(null);
  const [verdict, setVerdict] = useState(null);
  const [requestError, setRequestError] = useState("");

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const recognitionRef = useRef(null);

  const saveMessageToBackend = async (content, senderType) => {
    if (!sessionToken) return;
    try {
      await axios.post(`${API_BASE_URL}/chat/message`, {
        session_token: sessionToken,
        message: content,
        sender_type: senderType,
      });
    } catch (error) {
      console.error(`Error saving ${senderType} message:`, error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Clean up speech synthesis when component unmounts or state changes
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const toggleListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        isEn
          ? "Speech recognition is not supported in this browser. Please use Chrome or Edge."
          : "ميزة التعرف على الصوت غير مدعومة في هذا المتصفح. يرجى استخدام متصفح Chrome أو Edge."
      );
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = lang === "en" ? "en-US" : "ar-SA";
      recognition.interimResults = false;
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (err) {
      console.error("Speech recognition error:", err);
      setIsListening(false);
    }
  };

  const speakText = (text, idx) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      alert(
        isEn
          ? "Text-to-speech is not supported in your browser."
          : "ميزة تحويل النص إلى صوت غير مدعومة في متصفحك."
      );
      return;
    }

    if (speakingIdx === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIdx(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "en" ? "en-US" : "ar-SA";
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingIdx(null);
    utterance.onerror = () => setSpeakingIdx(null);
    setSpeakingIdx(idx);
    window.speechSynthesis.speak(utterance);
  };

  const exportReport = () => {
    if (messages.length === 0) return;
    const dateStr = new Date().toLocaleString(isEn ? "en-US" : "ar-SA");

    const reportHtml = `<!DOCTYPE html>
<html dir="${isEn ? "ltr" : "rtl"}" lang="${lang}">
<head>
  <meta charset="UTF-8">
  <title>${isEn ? "Faheem - Absher Challenge Report" : "فهيم - تقرير تحدي أبشر"}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Tajawal", sans-serif; padding: 40px; color: #1f2937; background: #fff; margin: 0; }
    .header { border-bottom: 3px solid #007C5A; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .brand { font-size: 26px; font-weight: bold; color: #007C5A; }
    .subbrand { font-size: 14px; color: #4b5563; margin-top: 4px; }
    .meta { font-size: 13px; color: #6b7280; text-align: ${isEn ? "right" : "left"}; }
    .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 6px; font-weight: bold; font-size: 13px; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-fail { background: #fee2e2; color: #991b1b; }
    .message { margin-bottom: 14px; padding: 14px 18px; border-radius: 12px; max-width: 80%; }
    .user-msg { background: #007C5A; color: white; margin-${isEn ? "right" : "left"}: auto; }
    .opponent-msg { background: #f3f4f6; color: #1f2937; border: 1px solid #e5e7eb; margin-${isEn ? "left" : "right"}: auto; }
    .msg-sender { font-size: 12px; font-weight: bold; margin-bottom: 6px; opacity: 0.85; }
    .print-bar { margin-bottom: 24px; display: flex; gap: 12px; }
    .print-btn { background: #007C5A; color: white; border: none; padding: 10px 22px; border-radius: 8px; font-weight: bold; font-size: 14px; cursor: pointer; }
    .print-btn:hover { background: #005a41; }
    @media print { .no-print { display: none !important; } body { padding: 15px; } }
  </style>
</head>
<body>
  <div class="no-print print-bar">
    <button class="print-btn" onclick="window.print()">${isEn ? "🖨️ Print / Save as PDF" : "🖨️ طباعة / حفظ كـ PDF"}</button>
  </div>

  <div class="header">
    <div>
      <div class="brand">فهيم | Faheem</div>
      <div class="subbrand">${isEn ? "Human-Centric AI Simulation & Evaluation Report" : "تقرير محاكاة وتقييم الذكاء الاصطناعي الإنساني لمنصة أبشر"}</div>
    </div>
    <div class="meta">
      <div><strong>${isEn ? "Date:" : "التاريخ:"}</strong> ${dateStr}</div>
      <div><strong>${isEn ? "Session Token:" : "رمز الجلسة:"}</strong> ${sessionToken || "N/A"}</div>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-top: 0; margin-bottom: 14px; color: #111827;">${isEn ? "Challenge Outcome & Summary" : "ملخص ونتائج التحدي"}</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr>
        <td style="padding: 6px 0; color: #6b7280; width: 40%;">${isEn ? "Player Guess:" : "تخمين المستخدم:"}</td>
        <td style="font-weight: bold;">${
          verdict
            ? verdict === "faheem"
              ? isEn
                ? "Faheem (AI)"
                : "فهيم (AI)"
              : isEn
              ? "Human"
              : "إنسان"
            : isEn
            ? "Session in progress"
            : "المحادثة قيد التقدم"
        }</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">${isEn ? "Actual Opponent:" : "الخصم الفعلي:"}</td>
        <td style="font-weight: bold;">${
          opponentType === "faheem"
            ? isEn
              ? "Faheem (AI)"
              : "فهيم (AI)"
            : isEn
            ? "Human"
            : "إنسان"
        }</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">${isEn ? "Outcome:" : "النتيجة:"}</td>
        <td>
          ${
            verdict
              ? verdict === opponentType
                ? `<span class="badge badge-success">${isEn ? "Correct Guess ✅" : "إجابة صحيحة ✅"}</span>`
                : `<span class="badge badge-fail">${isEn ? "Fooled by AI ❌" : "تم خداع المستخدم بنجاح ❌"}</span>`
              : "-"
          }
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">${isEn ? "Total Messages:" : "إجمالي الرسائل:"}</td>
        <td style="font-weight: bold;">${messages.length}</td>
      </tr>
    </table>
  </div>

  <h3 style="margin-bottom: 16px; color: #111827;">${isEn ? "Conversation Steps & Transcript" : "سجل المحادثة والخطوات بالتفصيل"}</h3>
  <div style="display: flex; flex-direction: column;">
    ${messages
      .map(
        (m, idx) => `
      <div class="message ${m.sender === "user" ? "user-msg" : "opponent-msg"}">
        <div class="msg-sender">${isEn ? "Step" : "الخطوة"} ${idx + 1} • ${
          m.sender === "user"
            ? isEn
              ? "User"
              : "المستخدم"
            : isEn
            ? "Opponent"
            : "الخصم"
        }</div>
        <div style="white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${escapeHtml(
          m.content
        )}</div>
      </div>
    `
      )
      .join("")}
  </div>

  <div style="margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center;">
    ${
      isEn
        ? "Faheem AI for Absher • Human Intent Evaluation Project © 2026"
        : "مشروع فهيم • الذكاء الاصطناعي الإنساني لمنصة أبشر © 2026"
    }
  </div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `faheem-report-${Date.now()}.html`;
      a.click();
    }
  };

  const handleStartSearch = async () => {
    setRequestError("");
    setGameState("searching");

    try {
      const res = await axios.post(`${API_BASE_URL}/chat/start`);
      if (res.data && res.data.session_token) {
        setSessionToken(res.data.session_token);
      }
    } catch (err) {
      console.error("Error starting challenge chat:", err);
      setRequestError(
        isEn
          ? "Could not start session. Check your connection and try again."
          : "تعذر بدء الجلسة. تحقق من الاتصال وحاول مرة أخرى."
      );
      setGameState("lobby");
      return;
    }

    setTimeout(() => {
      setGameState("playing");
      setOpponentType(Math.random() > 0.5 ? "faheem" : "human");
      setMessages([]);
    }, 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (
      !inputValue.trim() ||
      isTyping ||
      !sessionToken ||
      gameState !== "playing"
    )
      return;

    const userMsg = inputValue;
    const newMessages = [...messages, { sender: "user", content: userMsg }];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);
    setRequestError("");

    // Stop listening if mic was still on
    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }

    // Save user message to DB
    await saveMessageToBackend(userMsg, "user");

    // Only Laravel contacts provider proxy
    let responseText;
    try {
      const history = newMessages.slice(-40);
      while (
        history.reduce((total, message) => total + message.content.length, 0) >
        12000
      ) {
        history.shift();
      }
      const { data } = await axios.post(
        `${API_BASE_URL}/chat/generate`,
        {
          session_token: sessionToken,
          persona: opponentType,
          history,
        },
        { timeout: 35000 }
      );
      responseText = data.reply;
    } catch {
      setRequestError(
        isEn
          ? "Unable to reach the assistant right now. Please try again shortly."
          : "تعذر الاتصال بالمساعد الآن. حاول مرة أخرى بعد قليل."
      );
      setIsTyping(false);
      return;
    }

    setMessages((prev) => [
      ...prev,
      { sender: "opponent", content: responseText },
    ]);
    setIsTyping(false);

    // Save AI response to DB
    await saveMessageToBackend(responseText, "ai");
  };

  const handleVerdict = async (guess) => {
    setVerdict(guess);
    setGameState("result");

    if (sessionToken) {
      try {
        await axios.post(`${API_BASE_URL}/chat/challenge`, {
          session_token: sessionToken,
          user_guess: guess === "faheem" ? "ai" : "human",
          actual_identity: opponentType === "faheem" ? "ai" : "human",
        });
      } catch (error) {
        console.error("Error submitting challenge result:", error);
      }
    }
  };

  return (
    <div
      className={`flex flex-col h-screen font-sans transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      dir={isEn ? "ltr" : "rtl"}
    >
      {requestError && (
        <p
          role="alert"
          className={`p-4 text-center ${
            isDark ? "bg-red-950/60 text-red-300" : "bg-red-50 text-red-700"
          }`}
        >
          {requestError}
        </p>
      )}

      {/* Header */}
      <header
        className={`p-4 shadow-sm flex justify-between items-center border-b z-10 transition-colors duration-300 ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 transition-colors font-bold ${
              isDark
                ? "text-gray-300 hover:text-emerald-400"
                : "text-gray-500 hover:text-[#007C5A]"
            }`}
          >
            <svg
              className={`w-6 h-6 ${isEn ? "transform rotate-180" : ""}`}
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
            <span>{isEn ? "Back to Home" : "العودة للرئيسية"}</span>
          </button>
        </div>

        <h2
          className={`text-xl font-bold absolute left-1/2 transform -translate-x-1/2 ${
            isDark ? "text-emerald-400" : "text-[#007C5A]"
          }`}
        >
          {isEn ? "Absher Challenge" : "تحدي أبشر"}
        </h2>

        <div className="flex items-center gap-2 sm:gap-3">
          {messages.length > 0 && (
            <button
              onClick={exportReport}
              className={`px-3 py-2 rounded-xl text-sm font-bold shadow-sm border transition-all flex items-center gap-1.5 ${
                isDark
                  ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
              title={
                isEn
                  ? "Export conversation report & steps"
                  : "تصدير تقرير المحادثة والخطوات"
              }
            >
              <span>📄</span>
              <span className="hidden sm:inline">
                {isEn ? "Report" : "تقرير"}
              </span>
            </button>
          )}

          {toggleLang && (
            <button
              onClick={toggleLang}
              className={`px-3 py-2 rounded-xl text-sm font-bold shadow-sm border transition-all ${
                isDark
                  ? "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
              }`}
              title={isEn ? "تغيير اللغة للعربية" : "Switch to English"}
            >
              {isEn ? "عربي" : "EN"}
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className={`px-3 py-2 rounded-xl text-lg font-bold shadow-sm transition-all flex items-center justify-center ${
              isDark
                ? "bg-gray-800 text-yellow-400"
                : "bg-gray-200 text-gray-700"
            }`}
            title={isEn ? "Toggle Dark Mode" : "تغيير الوضع المظلم"}
          >
            {isDark ? "☀️" : "🌙"}
          </button>

          {gameState === "playing" && (
            <button
              onClick={() => setGameState("verdict")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors animate-pulse shadow-md"
            >
              {isEn ? "Reveal Identity" : "كشف الهوية"}
            </button>
          )}
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Sidebar (Info Panel) */}
        <aside
          className={`hidden lg:flex flex-col w-72 ${
            isEn ? "border-r" : "border-l"
          } overflow-y-auto p-4 transition-colors duration-300 ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
          }`}
        >
          <div className="space-y-6">
            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-emerald-950/30 border-emerald-800/40"
                  : "bg-[#007C5A]/5 border-[#007C5A]/10"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-emerald-400" : "text-[#007C5A]"
                }`}
              >
                {isEn ? "What is Absher Challenge?" : "ما هو تحدي أبشر؟"}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {isEn
                  ? "A test arena designed to train Faheem on emulating natural human conversation. By interacting with it and trying to uncover its identity, you help it become smarter and more natural."
                  : "هو بيئة اختبار صُممت بهدف تطوير قدرات فهيم على محاكاة الحوار البشري. من خلال تفاعلك معه ومحاولتك كشف هويته، تساهم في تدريبه ليصبح أكثر ذكاءً وطبيعية في خدمة المستفيدين."}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-blue-950/30 border-blue-800/40"
                  : "bg-blue-50 border-blue-100"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-blue-400" : "text-blue-800"
                }`}
              >
                {isEn ? "How Does Faheem Evolve?" : "كيف يتطور فهيم؟"}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-blue-200" : "text-blue-700"
                }`}
              >
                {isEn
                  ? "Faheem learns from every conversation! Using Reinforcement Learning from Human Feedback (RLHF), it analyzes conversational patterns and replies that fooled you or revealed its identity."
                  : "يتعلم فهيم من كل محادثة يجريها معك! باستخدام تقنيات التعلم المعزز (RLHF)، يقوم بتحليل أسلوبك في الكلام، والردود التي خدعتك أو كشفت هويته."}
              </p>
            </div>

            <div
              className={`p-4 rounded-xl border ${
                isDark
                  ? "bg-gray-800/50 border-gray-700"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-2 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                {isEn ? "The Goal" : "الهدف"}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {isEn
                  ? "Faheem aims to transform government digital services by providing an AI assistant that understands complex human needs and responds naturally."
                  : "يهدف فهيم إلى إحداث ثورة في الخدمات الحكومية عبر توفير مساعد ذكي يفهم الاحتياجات المعقدة ويقدم إجابات دقيقة."}
              </p>
            </div>
          </div>
        </aside>

        {/* Game Area */}
        <main
          className={`flex-1 relative flex flex-col overflow-hidden transition-colors duration-300 ${
            isDark ? "bg-gray-950" : "bg-gray-50"
          }`}
        >
          {/* Disclaimer Screen */}
          {gameState === "disclaimer" && (
            <div
              className={`absolute inset-0 flex items-center justify-center z-50 p-8 transition-colors duration-300 ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className="max-w-2xl w-full text-center space-y-8">
                <div className="w-24 h-24 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">⚠️</span>
                </div>
                <h3
                  className={`text-3xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {isEn
                    ? "Important Notice Before Starting"
                    : "تنويه هام قبل البدء"}
                </h3>
                <p
                  className={`text-xl leading-relaxed max-w-lg mx-auto ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {isEn ? (
                    <>
                      This is an experimental demo to illustrate the concept.{" "}
                      <br />
                      There is no live matchmaking with real human players in
                      this demo.
                    </>
                  ) : (
                    <>
                      هذا المشروع تجريبي للعرض فقط لإيصال الفكرة. <br />
                      لا يوجد بحث عن منافسين حقيقين في هذا الديمو.
                    </>
                  )}
                </p>
                <button
                  onClick={() => setGameState("lobby")}
                  className="px-12 py-4 bg-[#007C5A] hover:bg-[#006c4f] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#007C5A]/20 mt-8"
                >
                  {isEn ? "Got it, Start Experience" : "فهمت، ابدأ التجربة"}
                </button>
              </div>
            </div>
          )}

          {/* Lobby Screen */}
          {gameState === "lobby" && (
            <div
              className={`flex-1 flex flex-col items-center justify-center p-8 space-y-10 animate-fade-in transition-colors duration-300 ${
                isDark
                  ? "bg-gradient-to-b from-gray-900 to-gray-950"
                  : "bg-gradient-to-b from-white to-gray-50"
              }`}
            >
              <div
                className="relative group cursor-pointer"
                onClick={handleStartSearch}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#007C5A] to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div
                  className={`relative w-48 h-48 rounded-full flex items-center justify-center shadow-xl border-4 ${
                    isDark
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-white"
                  }`}
                >
                  <span className="text-8xl">🛡️</span>
                </div>
              </div>

              <div className="text-center space-y-4 max-w-md">
                <h1
                  className={`text-4xl font-bold ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {isEn ? "The Testing Arena" : "ساحة الاختبار"}
                </h1>
                <p
                  className={`text-lg ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {isEn
                    ? "Can you distinguish between a human and AI? Click below to find an opponent."
                    : "هل يمكنك التمييز بين البشر والذكاء الاصطناعي؟ اضغط للبحث عن خصم."}
                </p>
              </div>

              <button
                onClick={handleStartSearch}
                className="px-16 py-5 bg-[#007C5A] hover:bg-[#006c4f] text-white rounded-2xl font-bold text-2xl shadow-xl shadow-[#007C5A]/30 transition-all transform hover:scale-105"
              >
                {isEn ? "Find Opponent" : "بحث عن خصم"}
              </button>
            </div>
          )}

          {/* Searching Screen */}
          {gameState === "searching" && (
            <div
              className={`flex-1 flex flex-col items-center justify-center space-y-8 transition-colors duration-300 ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-32 h-32 border-4 rounded-full ${
                    isDark ? "border-gray-800" : "border-gray-100"
                  }`}
                ></div>
                <div className="w-32 h-32 border-4 border-[#007C5A] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-pulse">🔍</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-[#007C5A]">
                  {isEn ? "Searching for an opponent..." : "جاري البحث عن خصم..."}
                </div>
                <div className={isDark ? "text-gray-500" : "text-gray-400"}>
                  {isEn
                    ? "Connecting to secure simulation servers"
                    : "يتم التوصيل بخوادم المحاكاة الآمنة"}
                </div>
              </div>
            </div>
          )}

          {/* Chat Screen */}
          {(gameState === "playing" ||
            gameState === "verdict" ||
            gameState === "result") && (
            <div
              className={`flex-1 flex flex-col h-full transition-colors duration-300 ${
                isDark ? "bg-gray-950" : "bg-[#F3F4F6]"
              }`}
            >
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex items-end gap-2 ${
                      msg.sender === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl text-lg shadow-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#007C5A] text-white rounded-br-none"
                          : isDark
                          ? "bg-gray-800 text-gray-100 border border-gray-700 rounded-bl-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {msg.sender !== "user" && (
                      <button
                        type="button"
                        onClick={() => speakText(msg.content, index)}
                        className={`p-2 rounded-full text-base transition-colors ${
                          speakingIdx === index
                            ? "bg-emerald-500 text-white animate-pulse"
                            : isDark
                            ? "text-gray-400 hover:text-emerald-400 hover:bg-gray-800"
                            : "text-gray-500 hover:text-[#007C5A] hover:bg-gray-200"
                        }`}
                        title={
                          speakingIdx === index
                            ? isEn
                              ? "Stop speaking"
                              : "إيقاف الصوت"
                            : isEn
                            ? "Read aloud"
                            : "استماع للرسالة"
                        }
                      >
                        {speakingIdx === index ? "🔊" : "🔈"}
                      </button>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-end">
                    <div
                      className={`p-4 rounded-2xl rounded-bl-none shadow-sm border flex gap-2 items-center ${
                        isDark
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className={`p-4 border-t flex gap-3 items-center transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-900 border-gray-800"
                    : "bg-white border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={gameState !== "playing" || isTyping}
                  className={`p-4 rounded-xl transition-all shadow-md aspect-square flex items-center justify-center text-xl ${
                    isListening
                      ? "bg-red-600 text-white animate-pulse shadow-red-500/50"
                      : isDark
                      ? "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                  title={
                    isListening
                      ? isEn
                        ? "Stop listening"
                        : "إيقاف المايكروفون"
                      : isEn
                      ? "Voice input (Speak)"
                      : "التحدث بالصوت"
                  }
                >
                  {isListening ? "🛑" : "🎤"}
                </button>

                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    isListening
                      ? isEn
                        ? "Listening... Speak now..."
                        : "جاري الاستماع... تحدث الآن..."
                      : isEn
                      ? "Type or speak your message..."
                      : "اكتب أو تحدث برسالتك هنا..."
                  }
                  maxLength={2000}
                  className={`flex-1 border rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#007C5A]/50 focus:border-[#007C5A] text-lg transition-all ${
                    isDark
                      ? "bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-500"
                      : "bg-gray-50 text-gray-900 border-gray-200"
                  }`}
                  disabled={
                    gameState !== "playing" || isTyping || !sessionToken
                  }
                />

                <button
                  type="submit"
                  disabled={gameState !== "playing" || !inputValue.trim()}
                  className="bg-[#007C5A] hover:bg-[#006c4f] text-white p-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md aspect-square flex items-center justify-center"
                >
                  <svg
                    className={`w-6 h-6 transform ${
                      isEn ? "rotate-90" : "rotate-180"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </button>
              </form>
            </div>
          )}

          {/* Verdict Modal */}
          {gameState === "verdict" && (
            <div
              className={`absolute inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in ${
                isDark ? "bg-gray-950/80" : "bg-white/80"
              }`}
            >
              <div
                className={`rounded-3xl p-10 max-w-lg w-full shadow-2xl border text-center space-y-8 ${
                  isDark
                    ? "bg-gray-900 border-gray-800 text-white"
                    : "bg-white border-gray-100 text-gray-900"
                }`}
              >
                <h2 className="text-4xl font-bold">
                  {isEn ? "Who Are You Talking To?" : "من تتحدث معه؟"}
                </h2>
                <p
                  className={
                    isDark ? "text-gray-400 text-lg" : "text-gray-500 text-lg"
                  }
                >
                  {isEn
                    ? "Moment of truth.. Did it manage to fool you?"
                    : "حان وقت الحقيقة.. هل استطاع خداعك؟"}
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => handleVerdict("human")}
                    className={`group relative border-2 p-8 rounded-2xl transition-all duration-300 ${
                      isDark
                        ? "bg-blue-950/30 hover:bg-blue-600 border-blue-900/50 hover:border-blue-600"
                        : "bg-blue-50 hover:bg-blue-600 border-blue-100 hover:border-blue-600"
                    }`}
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      👤
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        isDark
                          ? "text-blue-400 group-hover:text-white"
                          : "text-blue-600 group-hover:text-white"
                      }`}
                    >
                      {isEn ? "Human" : "إنسان"}
                    </div>
                  </button>

                  <button
                    onClick={() => handleVerdict("faheem")}
                    className={`group relative border-2 p-8 rounded-2xl transition-all duration-300 ${
                      isDark
                        ? "bg-emerald-950/30 hover:bg-[#007C5A] border-emerald-900/50 hover:border-[#007C5A]"
                        : "bg-green-50 hover:bg-[#007C5A] border-green-100 hover:border-[#007C5A]"
                    }`}
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      🤖
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        isDark
                          ? "text-emerald-400 group-hover:text-white"
                          : "text-[#007C5A] group-hover:text-white"
                      }`}
                    >
                      {isEn ? "Faheem (AI)" : "فهيم"}
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setGameState("playing")}
                  className={`font-medium transition-colors ${
                    isDark
                      ? "text-gray-400 hover:text-gray-200"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {isEn ? "Return to Conversation" : "العودة للمحادثة"}
                </button>
              </div>
            </div>
          )}

          {/* Result Modal */}
          {gameState === "result" && (
            <div
              className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-8 animate-fade-in transition-colors duration-300 ${
                isDark ? "bg-gray-900" : "bg-white"
              }`}
            >
              <div className="max-w-2xl w-full text-center space-y-8">
                <div className="relative inline-block">
                  <div
                    className={`text-9xl animate-bounce ${
                      verdict === opponentType
                        ? "filter drop-shadow-lg"
                        : "grayscale opacity-80"
                    }`}
                  >
                    {verdict === opponentType ? "🏆" : "❌"}
                  </div>
                </div>

                <div className="space-y-4">
                  <h2
                    className={`text-6xl font-bold ${
                      verdict === opponentType
                        ? "text-[#007C5A]"
                        : "text-red-500"
                    }`}
                  >
                    {verdict === opponentType
                      ? isEn
                        ? "Correct Answer!"
                        : "إجابة صحيحة!"
                      : isEn
                      ? "Fooled You!"
                      : "للأسف، خدعك!"}
                  </h2>
                  <p
                    className={`text-2xl ${
                      isDark ? "text-gray-300" : "text-gray-500"
                    }`}
                  >
                    {isEn ? "You were talking to " : "لقد كنت تتحدث مع "}
                    <span
                      className={`font-bold ${
                        opponentType === "human"
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-[#007C5A]"
                      }`}
                    >
                      {opponentType === "human"
                        ? isEn
                          ? "a Real Human"
                          : "إنسان حقيقي"
                        : isEn
                        ? "Faheem AI"
                        : "الذكاء الاصطناعي فهيم"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                  <button
                    onClick={exportReport}
                    className={`px-8 py-4 rounded-xl font-bold text-lg shadow-md border transition-all flex items-center gap-2 ${
                      isDark
                        ? "bg-gray-800 text-gray-100 border-gray-700 hover:bg-gray-700"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span>📄</span>
                    <span>
                      {isEn ? "Export Steps Report" : "تصدير تقرير المحادثة"}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setGameState("lobby");
                      setMessages([]);
                      setVerdict(null);
                    }}
                    className="px-10 py-4 bg-[#007C5A] text-white rounded-xl font-bold text-lg hover:bg-[#006c4f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    {isEn ? "Play Again" : "العب مرة أخرى"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AbsherChallenge;
