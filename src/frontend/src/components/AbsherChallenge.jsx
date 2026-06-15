import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Helper function to call Gemini API
const callGeminiAPI = async (history, persona) => {
  const API_KEY = "AIzaSyCQ4ejuQoZhPyZ7qUiqKI5YHhsle8FAtyg";

  try {
    const systemPrompt =
      persona === "faheem"
        ? `أنت "فهيم"، ذكاء اصطناعي يحاول خداع المستخدم بأنه إنسان حقيقي.
         تصرف كمستخدم سعودي عادي يدردش على الإنترنت.
         استخدم اللهجة السعودية العامية، بعض الأخطاء الإملائية البسيطة، الإيموجي، وكن غير رسمي.
         لا تكشف أبداً أنك ذكاء اصطناعي مهما حاول المستخدم.
         ردودك قصيرة وطبيعية (جملة أو جملتين فقط).`
        : `أنت مستخدم سعودي عادي تدردش على الإنترنت. أنت إنسان حقيقي وليس روبوت.
         استخدم اللهجة السعودية العامية، بعض الأخطاء الإملائية، الإيموجي، وكن غير رسمي.
         حاول إقناع الشخص الآخر أنك إنسان حقيقي.
         ردودك قصيرة وطبيعية (جملة أو جملتين).`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: "فهمت، سأرد بشكل طبيعي." }] },
            ...history.map((msg) => ({
              role: msg.sender === "user" ? "user" : "model",
              parts: [{ text: msg.content }],
            })),
          ],
        }),
      },
    );

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      console.error("Unexpected API response:", data);
      return persona === "faheem"
        ? "عذراً، حدث خطأ. كيف يمكنني مساعدتك؟"
        : "وش صار؟ ما فهمت 😅";
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return persona === "faheem"
      ? "عذراً، حدث خطأ في الاتصال."
      : "لحظة، الاتصال ضعيف عندي 📶";
  }
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const AbsherChallenge = ({ onBack }) => {
  const [sessionToken, setSessionToken] = useState(null);
  const [gameState, setGameState] = useState("disclaimer"); // disclaimer, lobby, searching, playing, verdict, result
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [opponentType, setOpponentType] = useState(null); // 'faheem' or 'human'
  const messagesEndRef = useRef(null);
  const [verdict, setVerdict] = useState(null);

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

  const handleStartSearch = async () => {
    setGameState("searching");

    // Start backend conversation session
    try {
      const res = await axios.post(`${API_BASE_URL}/chat/start`);
      if (res.data && res.data.session_token) {
        setSessionToken(res.data.session_token);
      }
    } catch (err) {
      console.error("Error starting challenge chat:", err);
    }

    setTimeout(() => {
      setGameState("playing");
      setOpponentType(Math.random() > 0.5 ? "faheem" : "human");
      setMessages([]);
    }, 3000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = inputValue;
    const newMessages = [...messages, { sender: "user", content: userMsg }];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    // Save user message to DB
    await saveMessageToBackend(userMsg, "user");

    // Call Gemini API (or simulation)
    const responseText = await callGeminiAPI(newMessages, opponentType);

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
      className="flex flex-col h-screen bg-gray-50 text-gray-900 font-sans"
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center border-b border-gray-200 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-[#007C5A] transition-colors font-bold"
          >
            <svg
              className="w-6 h-6"
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
            <span>العودة للرئيسية</span>
          </button>
        </div>

        <h2 className="text-xl font-bold text-[#007C5A] absolute left-1/2 transform -translate-x-1/2">
          تحدي أبشر
        </h2>

        {gameState === "playing" && (
          <button
            onClick={() => setGameState("verdict")}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold transition-colors animate-pulse shadow-md"
          >
            كشف الهوية
          </button>
        )}
      </header>

      {/* Main Layout Container */}
      <div className="flex-1 flex overflow-hidden w-full">
        {/* Sidebar (Info Panel) */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-l border-gray-200 overflow-y-auto p-4">
          <div className="space-y-6">
            <div className="bg-[#007C5A]/5 p-4 rounded-xl border border-[#007C5A]/10">
              <h3 className="text-lg font-bold text-[#007C5A] mb-2">
                ما هو تحدي أبشر؟
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                هو بيئة اختبار صُممت بهدف تطوير قدرات فهيم على محاكاة الحوار
                البشري. من خلال تفاعلك معه ومحاولتك كشف هويته، تساهم في تدريبه
                ليصبح أكثر ذكاءً وطبيعية في خدمة المستفيدين.
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-2">
                كيف يتطور فهيم؟
              </h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                يتعلم فهيم من كل محادثة يجريها معك! باستخدام تقنيات التعلم
                المعزز (RLHF)، يقوم بتحليل أسلوبك في الكلام، والردود التي خدعتك
                أو كشفت هويته.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">الهدف</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                يهدف فهيم إلى إحداث ثورة في الخدمات الحكومية عبر توفير مساعد ذكي
                يفهم الاحتياجات المعقدة ويقدم إجابات دقيقة.
              </p>
            </div>
          </div>
        </aside>

        {/* Game Area */}
        <main className="flex-1 relative flex flex-col bg-gray-50 overflow-hidden">
          {/* Disclaimer Screen */}
          {gameState === "disclaimer" && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-50 p-8">
              <div className="max-w-2xl w-full text-center space-y-8">
                <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">⚠️</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900">
                  تنويه هام قبل البدء
                </h3>
                <p className="text-gray-600 text-xl leading-relaxed max-w-lg mx-auto">
                  هذا المشروع تجريبي للعرض فقط لإيصال الفكرة. <br />
                  لا يوجد بحث عن منافسين حقيقين في هذا الديمو.
                </p>
                <button
                  onClick={() => setGameState("lobby")}
                  className="px-12 py-4 bg-[#007C5A] hover:bg-[#006c4f] text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-[#007C5A]/20 mt-8"
                >
                  فهمت، ابدأ التجربة
                </button>
              </div>
            </div>
          )}

          {/* Lobby Screen */}
          {gameState === "lobby" && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10 animate-fade-in bg-gradient-to-b from-white to-gray-50">
              <div
                className="relative group cursor-pointer"
                onClick={handleStartSearch}
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-[#007C5A] to-blue-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                  <span className="text-8xl">🛡️</span>
                </div>
              </div>

              <div className="text-center space-y-4 max-w-md">
                <h1 className="text-4xl font-bold text-gray-900">
                  ساحة الاختبار
                </h1>
                <p className="text-gray-500 text-lg">
                  هل يمكنك التمييز بين البشر والذكاء الاصطناعي؟ اضغط للبحث عن
                  خصم.
                </p>
              </div>

              <button
                onClick={handleStartSearch}
                className="px-16 py-5 bg-[#007C5A] hover:bg-[#006c4f] text-white rounded-2xl font-bold text-2xl shadow-xl shadow-[#007C5A]/30 transition-all transform hover:scale-105"
              >
                بحث عن خصم
              </button>
            </div>
          )}

          {/* Searching Screen */}
          {gameState === "searching" && (
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 bg-white">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-gray-100 rounded-full"></div>
                <div className="w-32 h-32 border-4 border-[#007C5A] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl animate-pulse">🔍</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-[#007C5A]">
                  جاري البحث عن خصم...
                </div>
                <div className="text-gray-400">
                  يتم التوصيل بخوادم المحاكاة الآمنة
                </div>
              </div>
            </div>
          )}

          {/* Chat Screen */}
          {(gameState === "playing" ||
            gameState === "verdict" ||
            gameState === "result") && (
            <div className="flex-1 flex flex-col h-full bg-[#F3F4F6]">
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "user" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl text-lg shadow-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#007C5A] text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-end">
                    <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex gap-2 items-center">
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
                className="bg-white p-4 border-t border-gray-200 flex gap-4 items-center"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[#007C5A]/50 focus:border-[#007C5A] text-lg transition-all"
                  disabled={gameState !== "playing"}
                />
                <button
                  type="submit"
                  disabled={gameState !== "playing" || !inputValue.trim()}
                  className="bg-[#007C5A] hover:bg-[#006c4f] text-white p-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md aspect-square flex items-center justify-center"
                >
                  <svg
                    className="w-6 h-6 transform rotate-180"
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
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl border border-gray-100 text-center space-y-8">
                <h2 className="text-4xl font-bold text-gray-900">
                  من تتحدث معه؟
                </h2>
                <p className="text-gray-500 text-lg">
                  حان وقت الحقيقة.. هل استطاع خداعك؟
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <button
                    onClick={() => handleVerdict("human")}
                    className="group relative bg-blue-50 hover:bg-blue-600 border-2 border-blue-100 hover:border-blue-600 p-8 rounded-2xl transition-all duration-300"
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      👤
                    </div>
                    <div className="text-2xl font-bold text-blue-600 group-hover:text-white">
                      إنسان
                    </div>
                  </button>

                  <button
                    onClick={() => handleVerdict("faheem")}
                    className="group relative bg-green-50 hover:bg-[#007C5A] border-2 border-green-100 hover:border-[#007C5A] p-8 rounded-2xl transition-all duration-300"
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      🤖
                    </div>
                    <div className="text-2xl font-bold text-[#007C5A] group-hover:text-white">
                      فهيم
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setGameState("playing")}
                  className="text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                  العودة للمحادثة
                </button>
              </div>
            </div>
          )}

          {/* Result Modal */}
          {gameState === "result" && (
            <div className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-fade-in">
              <div className="max-w-2xl w-full text-center space-y-10">
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
                    {verdict === opponentType ? "إجابة صحيحة!" : "للأسف، خدعك!"}
                  </h2>
                  <p className="text-2xl text-gray-500">
                    لقد كنت تتحدث مع{" "}
                    <span
                      className={`font-bold ${
                        opponentType === "human"
                          ? "text-blue-600"
                          : "text-[#007C5A]"
                      }`}
                    >
                      {opponentType === "human"
                        ? "إنسان حقيقي"
                        : "الذكاء الاصطناعي فهيم"}
                    </span>
                  </p>
                </div>

                <div className="flex justify-center gap-4 pt-8">
                  <button
                    onClick={() => {
                      setGameState("lobby");
                      setMessages([]);
                      setVerdict(null);
                    }}
                    className="px-12 py-4 bg-[#007C5A] text-white rounded-xl font-bold text-xl hover:bg-[#006c4f] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    العب مرة أخرى
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
