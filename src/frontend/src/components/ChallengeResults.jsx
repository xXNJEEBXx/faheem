import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const ChallengeResults = ({ onBack }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/chat/challenges`)
      .then((res) => {
        setChallenges(res.data.challenges);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching challenges:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8" dir="rtl">
      <header className="max-w-5xl mx-auto flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-sm gap-2 text-gray-500 hover:text-absher-green font-bold bg-white px-4 py-2 rounded-xl shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
          العودة
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mr-4">الإحصائيات 📊</h1>
      </header>

      <main className="max-w-5xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-gray-500">جاري تحميل النتائج...</div>
        ) : challenges.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm">
            لا توجد تحديات ملعوبة حتى الآن.
          </div>
        ) : (
          <div className="grid gap-6">
            {challenges.map((challenge, index) => (
              <div key={challenge.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start">
                
                {/* Result Summary Card */}
                <div className="w-full md:w-1/3 flex flex-col gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-sm text-gray-500">تحدي رقم #{challenges.length - index}</div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">هل اكتشف الخدعة؟</span>
                    {challenge.is_correct ? (
                      <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded-lg">نعم ✅</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 font-bold px-2 py-1 rounded-lg">لا ❌</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">الخصم الحقيقي:</span>
                    <span className="font-bold text-gray-800">
                      {challenge.actual_identity === "ai" ? "🤖 فهيم (AI)" : "👤 إنسان"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm border-b pb-2">
                    <span className="text-gray-600">توقع اللاعب:</span>
                    <span className="font-bold text-gray-800">
                      {challenge.user_guess === "ai" ? "🤖 فهيم (AI)" : "👤 إنسان"}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-2 text-left">
                    {new Date(challenge.created_at).toLocaleString("ar-SA", { dateStyle: "short", timeStyle: "short" })}
                  </div>
                </div>

                {/* Conversation Output */}
                <div className="w-full md:w-2/3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  <h3 className="text-sm font-bold text-gray-400 mb-3 sticky top-0 bg-white pb-2">سجل المحادثة:</h3>
                  {challenge.conversation?.messages?.length > 0 ? (
                    <div className="space-y-3">
                      {challenge.conversation.messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender_type === "user" ? "justify-start" : "justify-end"}`}>
                          <div className={`text-sm px-4 py-2 rounded-2xl max-w-[85%] ${
                            msg.sender_type === "user" 
                              ? "bg-gray-100 text-gray-800 rounded-tr-sm" 
                              : "bg-[#007C5A]/10 text-gray-800 rounded-tl-sm border border-[#007C5A]/20"
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-400">لا يوجد رسائل أو انتهت بدون حديث.</div>
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
