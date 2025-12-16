import React from "react";
import FaheemAvatar from "./FaheemAvatar";

const AboutFaheem = ({ onBack, onStartChallenge }) => {
  const features = [
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

  const capabilities = [
    "المساعدة في إجراءات أبشر",
    "الإجابة على الاستفسارات الحكومية",
    "توجيهك للخدمات المناسبة",
    "شرح الإجراءات خطوة بخطوة",
    "حل المشاكل التقنية البسيطة",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-absher-light to-white flex flex-col">
      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-absher-green hover:text-absher-dark transition-colors"
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
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">رجوع</span>
        </button>
        <div className="text-2xl font-bold text-absher-green">
          فهيم | Faheem
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <FaheemAvatar state="wink" size="xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            تعرّف على <span className="text-absher-green">فهيم</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            فهيم هو مساعدك الذكي الجديد في منصة أبشر، صُمم ليجعل تجربتك أسهل
            وأسرع وأكثر إنسانية.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            مهمتنا
          </h2>
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            نسعى لتحويل التعامل مع الخدمات الحكومية من تجربة معقدة إلى محادثة
            بسيطة وودية. فهيم هنا ليفهمك ويخدمك بروح إنسانية وبدون أي تعقيد.
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            مميزات فهيم
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border-r-4 border-absher-green"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="bg-absher-green/10 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ماذا يستطيع فهيم فعله؟
          </h2>
          <ul className="space-y-4 max-w-xl mx-auto">
            {capabilities.map((capability, index) => (
              <li
                key={index}
                className="flex items-center gap-3 text-lg text-gray-700"
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
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              ما هو تحدي أبشر؟
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              هو بيئة اختبار صُممت بهدف تطوير قدرات فهيم على محاكاة الحوار
              البشري. من خلال تفاعلك معه ومحاولتك كشف هويته، تساهم في تدريبه
              ليصبح أكثر ذكاءً وطبيعية في خدمة المستفيدين.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              كيف يتطور فهيم؟
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              يتعلم فهيم من كل محادثة يجريها معك! باستخدام تقنيات التعلم المعزز
              (RLHF)، يقوم بتحليل أسلوبك في الكلام، والردود التي خدعتك أو كشفت
              هويته.
            </p>

            <h3 className="text-xl font-bold text-gray-800 mb-3">الهدف</h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              يهدف فهيم إلى إحداث ثورة في الخدمات الحكومية عبر توفير مساعد ذكي
              يفهم الاحتياجات المعقدة ويقدم إجابات دقيقة.
            </p>

            <button
              onClick={onStartChallenge}
              className="px-8 py-4 bg-absher-green text-white rounded-xl text-lg font-bold shadow-lg hover:bg-absher-dark transition-all transform hover:scale-105"
            >
              تحدي أبشر
            </button>
          </div>
        </section>

        {/* Team Section */}
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            فريق التطوير
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            فهيم هو مشروع تجريبي تم تطويره بشغف لتحسين تجربة المستخدم في الخدمات
            الحكومية الرقمية.
          </p>
          <div className="inline-block bg-gradient-to-r from-absher-green to-emerald-500 text-white px-8 py-4 rounded-xl shadow-lg">
            <p className="font-bold text-lg">نسخة تجريبية - Demo Version</p>
            <p className="text-sm opacity-90">© 2025 فريق فهيم</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-400 text-xs mt-auto">
        تطوير فريق فهيم © 2025
      </footer>
    </div>
  );
};

export default AboutFaheem;
