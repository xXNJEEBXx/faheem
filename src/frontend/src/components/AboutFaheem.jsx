import React from "react";
import FaheemAvatar from "./FaheemAvatar";

const AboutFaheem = ({
  onBack,
  onStartChallenge,
  isDark = false,
  toggleDarkMode,
  lang = "en",
  toggleLang,
}) => {
  const isEn = lang === "en";

  const features = isEn
    ? [
        {
          title: "Advanced AI",
          description:
            "Built on state-of-the-art language models to understand human intent and context.",
        },
        {
          title: "Natural Conversation",
          description:
            "Understands local dialects and communicates in warm, clear, everyday language.",
        },
        {
          title: "Fast & Efficient",
          description:
            "Saves time and simplifies complex government procedures into effortless steps.",
        },
        {
          title: "Safe & Reliable",
          description:
            "Protects your privacy and personal information with strict session isolation.",
        },
      ]
    : [
        {
          title: "ذكاء اصطناعي متقدم",
          description: "مبني على أحدث تقنيات الذكاء الاصطناعي لفهم احتياجاتك",
        },
        {
          title: "محادثة طبيعية",
          description: "يفهم لهجتك ويتحدث معك بلغة سهلة وواضحة",
        },
        {
          title: "سريع وفعال",
          description: "يختصر عليك الوقت ويوفر لك الخطوات المعقدة",
        },
        {
          title: "آمن وموثوق",
          description: "يحافظ على خصوصية بياناتك ومعلوماتك الشخصية",
        },
      ];

  const capabilities = isEn
    ? [
        "Assisting with Absher procedures",
        "Answering government service inquiries",
        "Guiding you to the right services",
        "Explaining procedures step by step",
        "Resolving simple technical issues",
      ]
    : [
        "المساعدة في إجراءات أبشر",
        "الإجابة على الاستفسارات الحكومية",
        "توجيهك للخدمات المناسبة",
        "شرح الإجراءات خطوة بخطوة",
        "حل المشاكل التقنية البسيطة",
      ];

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-absher-light to-white text-gray-900"
      }`}
    >
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 transition-colors font-medium ${
            isDark
              ? "text-emerald-400 hover:text-emerald-300"
              : "text-absher-green hover:text-absher-dark"
          }`}
        >
          <svg
            className={`w-6 h-6 ${isEn ? "" : "transform rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>{isEn ? "Back" : "رجوع"}</span>
        </button>

        <div className="flex items-center gap-3">
          {toggleLang && (
            <button
              onClick={toggleLang}
              className={`px-3 py-1.5 rounded-xl text-sm font-bold transition-all shadow-sm border ${
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
              className={`p-2 rounded-xl transition-all shadow-sm border flex items-center justify-center text-lg ${
                isDark
                  ? "bg-gray-800 text-yellow-400 border-gray-700 hover:bg-gray-700"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
              title={isEn ? "Toggle Dark Mode" : "تغيير الوضع المظلم"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          )}
          <div
            className={`text-2xl font-bold ${
              isDark ? "text-emerald-400" : "text-absher-green"
            }`}
          >
            فهيم | Faheem
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FaheemAvatar state="wink" size="xl" />
          </div>
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {isEn ? "Meet " : "تعرّف على "}
            <span className={isDark ? "text-emerald-400" : "text-absher-green"}>
              {isEn ? "Faheem" : "فهيم"}
            </span>
          </h1>
          <p
            className={`text-xl max-w-2xl mx-auto leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {isEn
              ? "Faheem is your new smart assistant for Absher, designed to make your experience easier, faster, and more human."
              : "فهيم هو مساعدك الذكي الجديد في منصة أبشر، صُمم ليجعل تجربتك أسهل وأسرع وأكثر إنسانية."}
          </p>
        </section>

        {/* Mission Section */}
        <section
          className={`rounded-2xl shadow-lg p-8 mb-12 border ${
            isDark
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-transparent"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-4 text-center ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {isEn ? "Our Mission" : "مهمتنا"}
          </h2>
          <p
            className={`text-lg text-center leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {isEn
              ? "We strive to transform government services from rigid procedures into a warm, effortless conversation. Faheem is here to understand and serve you with a human touch."
              : "نسعى لتحويل التعامل مع الخدمات الحكومية من تجربة معقدة إلى محادثة بسيطة وودية. فهيم هنا ليفهمك ويخدمك بروح إنسانية وبدون أي تعقيد."}
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <h2
            className={`text-2xl font-bold mb-8 text-center ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {isEn ? "Faheem's Features" : "مميزات فهيم"}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow ${
                  isEn ? "border-l-4" : "border-r-4"
                } ${
                  isDark
                    ? "bg-gray-800 border-emerald-500"
                    : "bg-white border-absher-green"
                }`}
              >
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-800"
                  }`}
                >
                  {feature.title}
                </h3>
                <p className={isDark ? "text-gray-300" : "text-gray-600"}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section
          className={`rounded-2xl p-8 mb-12 border ${
            isDark
              ? "bg-emerald-950/30 border-emerald-800/40"
              : "bg-absher-green/10 border-transparent"
          }`}
        >
          <h2
            className={`text-2xl font-bold mb-6 text-center ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {isEn ? "What Can Faheem Do?" : "ماذا يستطيع فهيم فعله؟"}
          </h2>
          <ul className="space-y-4 max-w-xl mx-auto">
            {capabilities.map((capability, index) => (
              <li
                key={index}
                className={`flex items-center gap-3 text-lg ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                <span className="w-8 h-8 bg-absher-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  ✓
                </span>
                {capability}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-12">
          <div
            className={`rounded-2xl shadow-lg p-8 max-w-2xl mx-auto border ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-transparent"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {isEn ? "What is the Absher Challenge?" : "ما هو تحدي أبشر؟"}
            </h3>
            <p
              className={`leading-relaxed mb-6 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {isEn
                ? "It is a competitive simulation environment designed to develop Faheem's ability to emulate natural human conversation. By chatting and trying to uncover its identity, you help train Faheem to become smarter and more natural."
                : "هو بيئة اختبار صُممت بهدف تطوير قدرات فهيم على محاكاة الحوار البشري. من خلال تفاعلك معه ومحاولتك كشف هويته، تساهم في تدريبه ليصبح أكثر ذكاءً وطبيعية في خدمة المستفيدين."}
            </p>

            <h3
              className={`text-xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {isEn ? "How Does Faheem Evolve?" : "كيف يتطور فهيم؟"}
            </h3>
            <p
              className={`leading-relaxed mb-6 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {isEn
                ? "Faheem learns from every conversation! Using Reinforcement Learning from Human Feedback (RLHF) principles, we analyze conversational patterns and responses that either convinced you or gave away its identity."
                : "يتعلم فهيم من كل محادثة يجريها معك! باستخدام تقنيات التعلم المعزز (RLHF)، يقوم بتحليل أسلوبك في الكلام، والردود التي خدعتك أو كشفت هويته."}
            </p>

            <h3
              className={`text-xl font-bold mb-3 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {isEn ? "The Goal" : "الهدف"}
            </h3>
            <p
              className={`leading-relaxed mb-6 ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {isEn
                ? "Faheem aims to revolutionize digital government services by providing an intelligent assistant that understands complex human intent and delivers empathetic, accurate responses."
                : "يهدف فهيم إلى إحداث ثورة في الخدمات الحكومية عبر توفير مساعد ذكي يفهم الاحتياجات المعقدة ويقدم إجابات دقيقة."}
            </p>

            <button
              onClick={onStartChallenge}
              className="px-8 py-4 bg-absher-green text-white rounded-xl text-lg font-bold shadow-lg hover:bg-absher-dark transition-all transform hover:scale-105"
            >
              {isEn ? "Start Absher Challenge 🏆" : "تحدي أبشر"}
            </button>
          </div>
        </section>

        {/* Team Section */}
        <section className="text-center mb-12">
          <h2
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {isEn ? "Development Team" : "فريق التطوير"}
          </h2>
          <p
            className={`text-lg mb-6 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {isEn
              ? "Faheem is an experimental project built with passion to elevate user experience in digital government services."
              : "فهيم هو مشروع تجريبي تم تطويره بشغف لتحسين تجربة المستخدم في الخدمات الحكومية الرقمية."}
          </p>
          <div className="inline-block bg-gradient-to-r from-absher-green to-emerald-500 text-white px-8 py-4 rounded-xl shadow-lg">
            <p className="font-bold text-lg">
              {isEn
                ? "Demo Version - نسخة تجريبية"
                : "نسخة تجريبية - Demo Version"}
            </p>
            <p className="text-sm opacity-90">
              {isEn ? "© 2025 Faheem Team" : "© 2025 فريق فهيم"}
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`w-full text-center py-4 text-xs mt-auto ${
          isDark ? "text-gray-500" : "text-gray-400"
        }`}
      >
        {isEn
          ? "Developed by Faheem Team © 2025"
          : "تطوير فريق فهيم © 2025"}
      </footer>
    </div>
  );
};

export default AboutFaheem;
