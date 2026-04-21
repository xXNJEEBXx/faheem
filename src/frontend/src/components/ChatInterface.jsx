import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import FaheemAvatar from "./FaheemAvatar";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const ChatInterface = ({ onBack }) => {
  const [sessionToken, setSessionToken] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "faheem",
      text: "حياك الله! أنا فهيم، كيف أقدر أخدمك اليوم؟ 👋",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Start backend conversation session
    axios
      .post(`${API_BASE_URL}/chat/start`)
      .then((res) => {
        if (res.data && res.data.session_token) {
          setSessionToken(res.data.session_token);
        }
      })
      .catch((err) => console.error("Error starting chat:", err));
  }, []);

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

  const [isTyping, setIsTyping] = useState(false);
  const [avatarState, setAvatarState] = useState("idle");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsgText = inputValue;
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      text: userMsgText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    await saveMessageToBackend(userMsgText, "user");

    processResponse(userMsgText);
  };

  const processResponse = (text) => {
    setIsTyping(true);
    setAvatarState("thinking");

    // Simulate "Natural Timing" based on text length
    const thinkingTime = Math.min(Math.max(text.length * 50, 1500), 4000);

    setTimeout(() => {
      let responseText = "";
      let nextAvatarState = "idle";
      let actionCard = null;

      // Simple keyword matching for demo scenarios
      if (text.includes("رخصة") || text.includes("تجديد")) {
        responseText =
          "وعليكم السلام ورحمة الله ... هلا حياك يا أحمد 👋. ظاهر لي الان من خلال بياناتك تحتاج تسوي فحص طبي فقط وبعدها تجدد الرخصة حسب المدة الي تناسبك:\n\n• 40 ريال لسنة واحدة\n• 80 ريال لسنتين\n• إلى 200 ريال لخمس سنوات\n• و400 ريال لعشر سنوات\n\nسعيد جدا بخدمتكم اي استفسار اخر انا بخدمتكم✨";
        nextAvatarState = "idle"; // Should smile
      } else if (text.includes("مولود") || text.includes("كرت العائلة")) {
        responseText =
          "ألف مبروك يا علي! يتربى في عزكم، والله يجعله من مواليد السعادة ويحفظه لكم يا رب ❤️.\n\n(جاري التحقق من البيانات...)\n\nخلاص أمورك طيبة يا علي المستشفى رفع البلاغ إلكترونياً. الطلب جاهز طال عمرك، باقي عندك فقط تسديد رسوم إصدار الشهادة وراح توصلك لعند باب البيت.";
        nextAvatarState = "wink";
      } else if (text.includes("تفويض") || text.includes("محمد")) {
        responseText =
          "هلا فيك مرة ثانية فهيم بالخدمة 😎👍. بما أن محمد مضاف عندك كتابع وعنده رخصة سارية، الإجراء بياخذ دقيقة. تبي التفويض (داخل المملكة) فقط؟ وحدد لي التاريخ من متى لمتى؟";
        nextAvatarState = "idle";
      } else if (text.includes("بكرة") || text.includes("أسبوع")) {
        // Smart Action Card Scenario
        setAvatarState("thinking"); // Keep thinking while preparing card
        setTimeout(() => {
          const cardMessage = {
            id: messages.length + 2,
            sender: "faheem",
            text: "",
            isCard: true,
            cardData: {
              title: "تأكيد طلب تفويض",
              details: "هل توافق على إصدار تفويض داخلي للمركبة التالية؟",
              vehicle: "ف ن ه 5515 (سوزوكي ديزاير)",
              authorized: "محمد (هوية وطنية: 112003212)",
              date: "من: 13-12-2025 إلى: 20-12-2025",
            },
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, cardMessage]);
          setIsTyping(false);
          setAvatarState("idle");
        }, 2000);
        return; // Exit early as we handled it in timeout
      } else {
        responseText =
          "أعتذر منك، ما فهمت عليك زين. ممكن توضح أكثر؟ أنا لسا أتعلم 😅";
      }

      const botMessage = {
        id: messages.length + 2,
        sender: "faheem",
        text: responseText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      setAvatarState(nextAvatarState);

      saveMessageToBackend(responseText, "ai");

      // Reset avatar to idle after a while if it was winking
      if (nextAvatarState === "wink") {
        setTimeout(() => setAvatarState("idle"), 3000);
      }
    }, thinkingTime);
  };

  const handleCardAction = (action) => {
    if (action === "confirm") {
      const confirmMsg = {
        id: Date.now(),
        sender: "faheem",
        text: "تم الاعتماد ✅ التفويض صار فعال لمدة أسبوع. سعيد جداً بخدمتكم.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, confirmMsg]);
      setAvatarState("wink");
      setTimeout(() => setAvatarState("idle"), 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-absher-green"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <FaheemAvatar state={avatarState} size="sm" />
            <div>
              <h2 className="font-bold text-gray-800">فهيم</h2>
              <div className="flex items-center gap-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isTyping ? "bg-yellow-400 animate-pulse" : "bg-green-500"
                  }`}
                ></span>
                <span className="text-xs text-gray-500">
                  {isTyping ? "يكتب..." : "متصل"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-absher-green font-bold text-xl">أبشر</div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-start" : "justify-end"
            }`}
          >
            {msg.sender === "faheem" && !msg.isCard && (
              <div className="ml-2 flex-shrink-0 self-end">
                <FaheemAvatar state="idle" size="xs" className="w-8 h-8" />
              </div>
            )}

            {msg.isCard ? (
              <div className="bg-white rounded-2xl shadow-lg p-4 max-w-sm w-full border border-gray-200">
                <div className="flex items-center gap-2 mb-3 text-absher-green font-bold border-b pb-2">
                  <span>⚠️</span>
                  <span>{msg.cardData.title}</span>
                </div>
                <p className="text-gray-700 mb-2">{msg.cardData.details}</p>
                <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">المركبة:</span>
                    <span className="font-medium">{msg.cardData.vehicle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">المفوض له:</span>
                    <span className="font-medium">
                      {msg.cardData.authorized}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">التاريخ:</span>
                    <span className="font-medium text-xs">
                      {msg.cardData.date}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    ❌ إلغاء
                  </button>
                  <button
                    onClick={() => handleCardAction("confirm")}
                    className="flex-1 py-2 bg-absher-green text-white rounded-lg hover:bg-absher-dark transition-colors"
                  >
                    ✅ موافق واعتماد
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-wrap ${
                  msg.sender === "user"
                    ? "bg-absher-green text-white rounded-br-none"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-absher-green text-white p-3 rounded-xl hover:bg-absher-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 transform rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-gray-100 border-0 rounded-xl px-4 focus:ring-2 focus:ring-absher-green focus:bg-white transition-all"
            dir="rtl"
          />
        </form>
        <div className="text-center mt-2">
          <span className="text-xs text-gray-400">
            جرب تقول: "تجديد الرخصة" أو "إضافة مولود" أو "تفويض قيادة"
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
