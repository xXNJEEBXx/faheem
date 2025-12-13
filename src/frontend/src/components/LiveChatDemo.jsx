import React, { useState, useEffect, useRef } from "react";
import FaheemAvatar from "./FaheemAvatar";

const SCENARIOS = [
  {
    title: "تجديد الرخصة 🚗",
    script: [
      {
        type: "text",
        sender: "user",
        content: "السلام عليكم ما هي إجرائات تجديد الرخصة؟",
        delay: 1000,
      },
      { type: "state", state: "thinking", duration: 1500 },
      {
        type: "text",
        sender: "faheem",
        state: "smile",
        content:
          "وعليكم السلام ورحمة الله ... هلا حياك يا أحمد 👋. ظاهر لي الان من خلال بياناتك تحتاج تسوي فحص طبي فقط وبعدها تجدد الرخصة حسب المدة الي تناسبك:\n\n• 40 ريال لسنة واحدة\n• 80 ريال لسنتين\n• إلى 200 ريال لخمس سنوات\n• و400 ريال لعشر سنوات\n\nسعيد جدا بخدمتكم اي استفسار اخر انا بخدمتكم✨",
        delay: 500,
      },
    ],
  },
  {
    title: "إضافة مولود 👶",
    script: [
      {
        type: "text",
        sender: "user",
        content: "الحمد لله جانا مولود اليوم وأبي أضيفه في كرت العائلة",
        delay: 1000,
      },
      { type: "state", state: "wink", duration: 1000 },
      {
        type: "text",
        sender: "faheem",
        state: "smile",
        content:
          "ألف مبروك يا علي! يتربى في عزكم، والله يجعله من مواليد السعادة ويحفظه لكم يا رب ❤️.",
        delay: 500,
      },
      { type: "state", state: "thinking", duration: 1500 },
      {
        type: "text",
        sender: "faheem",
        state: "idle",
        content:
          "خلاص أمورك طيبة يا علي المستشفى رفع البلاغ إلكترونياً. الطلب جاهز طال عمرك، باقي عندك فقط تسديد رسوم إصدار الشهادة وراح توصلك لعند باب البيت.",
        delay: 500,
      },
    ],
  },
  {
    title: "تفويض قيادة 🔑",
    script: [
      {
        type: "text",
        sender: "user",
        content: "كيف أسوي تفويض حق ولدي محمد؟",
        delay: 1000,
      },
      { type: "state", state: "thinking", duration: 1000 },
      {
        type: "text",
        sender: "faheem",
        state: "smile",
        content:
          "هلا فيك مرة ثانية فهيم بالخدمة 😎👍. بما أن محمد مضاف عندك كتابع وعنده رخصة سارية، الإجراء بياخذ دقيقة. تبي التفويض (داخل المملكة) فقط؟ وحدد لي التاريخ من متى لمتى؟",
        delay: 500,
      },
      {
        type: "text",
        sender: "user",
        content: "أيه نعم، من بكرة الصباح ولمدة أسبوع.",
        delay: 1500,
      },
      { type: "state", state: "thinking", duration: 1500 },
      {
        type: "card",
        sender: "faheem",
        content: {
          title: "⚠️ تأكيد طلب تفويض",
          body: "هل توافق على إصدار تفويض داخلي للمركبة التالية؟",
          details: [
            "المركبة: ف ن ه 5515 (سوزوكي ديزاير)",
            "للمفوض له: محمد (هوية وطنية: 112003212)",
            "من: 13-12-2025",
            "إلى: 20-12-2025",
          ],
          actions: ["❌ إلغاء", "✅ موافق واعتماد"],
        },
        delay: 500,
      },
      { type: "action_click", target: "✅ موافق واعتماد", delay: 1500 },
      {
        type: "text",
        sender: "faheem",
        state: "wink",
        content:
          "تم الاعتماد ✅ التفويض صار فعال لمدة أسبوع. سعيد جداً بخدمتكم.",
        delay: 1000,
      },
    ],
  },
];

const LiveChatDemo = () => {
  const [activeScenario, setActiveScenario] = useState(0);
  const [messages, setMessages] = useState([]);
  const [avatarState, setAvatarState] = useState("idle");
  const [step, setStep] = useState(0);
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const [clickedAction, setClickedAction] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, avatarState]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const currentScript = SCENARIOS[activeScenario].script;

    if (step < currentScript.length) {
      const action = currentScript[step];
      let timeout;

      const processNextStep = () => {
        setStep((prev) => prev + 1);
      };

      if (action.type === "state") {
        setAvatarState(action.state);
        timeout = setTimeout(() => {
          setAvatarState("idle"); // Revert to idle after duration unless next step sets it
          processNextStep();
        }, action.duration);
      } else if (action.type === "text" || action.type === "card") {
        if (action.state) setAvatarState(action.state);

        timeout = setTimeout(() => {
          setMessages((prev) => [...prev, action]);
          processNextStep();
        }, action.delay);
      } else if (action.type === "action_click") {
        timeout = setTimeout(() => {
          setClickedAction(action.target);
          setTimeout(() => {
            setClickedAction(null);
            processNextStep();
          }, 300);
        }, action.delay);
      }

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setMessages([]);
        setStep(0);
        setAvatarState("idle");
        setActiveScenario((prev) => (prev + 1) % SCENARIOS.length);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, step, activeScenario]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-100 transform transition-all hover:scale-[1.02]"
    >
      {/* Header */}
      <div className="bg-absher-green p-4 flex items-center gap-3 text-white transition-colors duration-300">
        <FaheemAvatar
          state={avatarState}
          size="sm"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <div className="font-bold">فهيم</div>
          <div className="text-xs opacity-90 flex items-center gap-1">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                avatarState === "thinking"
                  ? "bg-yellow-400 animate-ping"
                  : "bg-green-400 animate-pulse"
              }`}
            ></span>
            {avatarState === "thinking" ? "يفكر..." : "متصل الآن"}
          </div>
        </div>
        <div className="mr-auto text-xs bg-white/20 px-2 py-1 rounded-full">
          {SCENARIOS[activeScenario].title}
        </div>
      </div>

      {/* Chat Area */}
      <div className="h-[450px] bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-start" : "justify-end"
            } animate-fade-in-up`}
          >
            {msg.type === "text" && (
              <div
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-absher-green text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            )}

            {msg.type === "card" && (
              <div className="max-w-[90%] bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden rounded-bl-none">
                <div className="bg-gray-50 p-3 border-b border-gray-100 font-bold text-gray-700 text-sm flex items-center gap-2">
                  {msg.content.title}
                </div>
                <div className="p-3 space-y-2">
                  <p className="text-sm text-gray-800">{msg.content.body}</p>
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 space-y-1">
                    {msg.content.details.map((detail, i) => (
                      <div key={i}>{detail}</div>
                    ))}
                  </div>
                </div>
                <div className="flex border-t border-gray-100 divide-x divide-x-reverse divide-gray-100">
                  {msg.content.actions.map((action, i) => (
                    <button
                      key={i}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${
                        clickedAction === action
                          ? "bg-absher-green text-white"
                          : "text-absher-green hover:bg-gray-50"
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {avatarState === "thinking" && (
          <div className="flex justify-end animate-fade-in">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fake Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center opacity-50 pointer-events-none">
        <div className="w-8 h-8 bg-absher-green rounded-full flex items-center justify-center text-white">
          <svg
            className="w-4 h-4 transform rotate-180"
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
        </div>
        <div className="flex-1 h-10 bg-gray-100 rounded-full"></div>
      </div>
    </div>
  );
};

export default LiveChatDemo;
