import React, { useState, useEffect } from 'react';
import FaheemAvatar from './FaheemAvatar';
import AutoPlayChat from './AutoPlayChat';

const LandingPage = ({ onStartChat, onStartChallenge }) => {
  const [avatarState, setAvatarState] = useState('wink');

  useEffect(() => {
    // Initial wink then switch to idle
    const timer = setTimeout(() => {
      setAvatarState('idle');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const scenarios = [
    {
      title: "سيناريو 1: تجديد الرخصة 🚗",
      data: [
        { sender: 'user', text: "السلام عليكم ما هي إجرائات تجديد الرخصة؟" },
        { sender: 'faheem', text: "وعليكم السلام ورحمة الله ... هلا حياك يا أحمد 👋. ظاهر لي الان من خلال بياناتك تحتاج تسوي فحص طبي فقط وبعدها تجدد الرخصة حسب المدة الي تناسبك:\n\n• 40 ريال لسنة واحدة\n• 80 ريال لسنتين\n• إلى 200 ريال لخمس سنوات\n• و400 ريال لعشر سنوات\n\nسعيد جدا بخدمتكم اي استفسار اخر انا بخدمتكم✨", emotion: 'idle' }
      ]
    },
    {
      title: "سيناريو 2: إضافة مولود 👶",
      data: [
        { sender: 'user', text: "الحمد لله جانا مولود اليوم وأبي أضيفه في كرت العائلة" },
        { sender: 'faheem', text: "ألف مبروك يا علي! يتربى في عزكم، والله يجعله من مواليد السعادة ويحفظه لكم يا رب ❤️.", emotion: 'wink' },
        { sender: 'faheem', text: "خلاص أمورك طيبة يا علي المستشفى رفع البلاغ إلكترونياً. الطلب جاهز طال عمرك، باقي عندك فقط تسديد رسوم إصدار الشهادة وراح توصلك لعند باب البيت.", emotion: 'idle' }
      ]
    },
    {
      title: "سيناريو 3: تفويض قيادة 🔑",
      data: [
        { sender: 'user', text: "كيف أسوي تفويض حق ولدي محمد؟" },
        { sender: 'faheem', text: "هلا فيك مرة ثانية فهيم بالخدمة 😎👍. بما أن محمد مضاف عندك كتابع وعنده رخصة سارية، الإجراء بياخذ دقيقة. تبي التفويض (داخل المملكة) فقط؟ وحدد لي التاريخ من متى لمتى؟", emotion: 'idle' },
        { sender: 'user', text: "أيه نعم، من بكرة الصباح ولمدة أسبوع." },
        { 
            sender: 'faheem', 
            isCard: true, 
            cardData: {
                title: 'تأكيد طلب تفويض',
                details: 'هل توافق على إصدار تفويض داخلي للمركبة التالية؟',
                vehicle: 'ف ن ه 5515 (سوزوكي ديزاير)',
                authorized: 'محمد (هوية وطنية: 112003212)'
            },
            emotion: 'thinking'
        },
        { sender: 'faheem', text: "تم الاعتماد ✅ التفويض صار فعال لمدة أسبوع. سعيد جداً بخدمتكم.", emotion: 'wink' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-absher-light to-white flex flex-col items-center p-4">
      <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
        <div className="text-2xl font-bold text-absher-green">أبشر | Absher</div>
        <div className="text-sm text-gray-500">نسخة تجريبية (Demo)</div>
      </header>

      <main className="flex flex-col items-center text-center max-w-4xl w-full space-y-16 mt-20 animate-fade-in-up pb-20">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center space-y-8">
            <div className="relative group cursor-pointer" onClick={() => setAvatarState('wink')}>
            <FaheemAvatar state={avatarState} size="xl" />
            <div className="absolute bottom-0 right-0 bg-absher-green text-white text-xs px-2 py-1 rounded-full shadow-md transform translate-y-1/2">
                أنا فهيم!
            </div>
            </div>

            <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
                هلا، أنا <span className="text-absher-green">فهيم</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                مساعدك الذكي الجديد في أبشر. <br/>
                أفهمك، وأخدمك بروح إنسانية، وبدون تعقيد.
            </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-8">
            <button 
                onClick={onStartChat}
                className="px-8 py-4 bg-absher-green text-white rounded-xl text-lg font-bold shadow-lg hover:bg-absher-dark transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
                <span>ابدأ المحادثة</span>
                <span>💬</span>
            </button>
            
            <button 
                onClick={onStartChallenge}
                className="px-8 py-4 bg-white text-absher-green border-2 border-absher-green rounded-xl text-lg font-bold shadow-lg hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
                <span>تحدي أبشر</span>
                <span>🏆</span>
            </button>
            </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-500 w-full max-w-4xl">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🧠</div>
            <div className="font-bold text-gray-700 text-lg mb-1">ذكاء عاطفي</div>
            <div>أفهم سياقك ومشاعرك، مو بس كلماتك.</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">⚡</div>
            <div className="font-bold text-gray-700 text-lg mb-1">تفاعل طبيعي</div>
            <div>أرد عليك بتوقيت وأسلوب بشري.</div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">🔒</div>
            <div className="font-bold text-gray-700 text-lg mb-1">خصوصية تامة</div>
            <div>بياناتك آمنة ومشفرة بالكامل.</div>
          </div>
        </div>

        {/* Live Scenarios Section */}
        <div className="w-full pt-12 border-t border-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">أمثلة حية من الواقع</h2>
            <p className="text-gray-500 mb-12">شوف كيف فهيم يخدمك في مواقف مختلفة</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {scenarios.map((scenario, index) => (
                    <AutoPlayChat key={index} title={scenario.title} scenario={scenario.data} />
                ))}
            </div>
        </div>

      </main>

      <footer className="text-gray-400 text-xs py-6">
        تطوير فريق فهيم © 2025
      </footer>
    </div>
  );
};

export default LandingPage;
