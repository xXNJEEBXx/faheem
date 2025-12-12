import React, { useState, useEffect, useRef } from 'react';
import FaheemAvatar from './FaheemAvatar';

const AutoPlayChat = ({ scenario, title }) => {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isPlaying && currentIndex === 0) {
          setIsPlaying(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isPlaying, currentIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    if (currentIndex < scenario.length) {
      const message = scenario[currentIndex];
      
      if (message.sender === 'faheem') {
        setIsTyping(true);
        // Simulate typing delay based on message length, but faster for demo
        const delay = Math.min(message.text.length * 20, 1500); 
        
        const timer = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages(prev => [...prev, message]);
          setCurrentIndex(prev => prev + 1);
        }, delay);
        
        return () => clearTimeout(timer);
      } else {
        // User message appears instantly or with short delay
        const timer = setTimeout(() => {
          setVisibleMessages(prev => [...prev, message]);
          setCurrentIndex(prev => prev + 1);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [isPlaying, currentIndex, scenario]);

  const handleReplay = () => {
    setVisibleMessages([]);
    setCurrentIndex(0);
    setIsPlaying(true);
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden w-full max-w-md mx-auto my-8 transform transition-all hover:scale-[1.02]">
      <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-700">{title}</h3>
        <button onClick={handleReplay} className="text-xs text-absher-green hover:underline flex items-center gap-1">
          <span>إعادة المشهد</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 h-[400px] overflow-y-auto bg-gray-50 space-y-4 flex flex-col">
        {visibleMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'} animate-fade-in-up`}>
            {msg.sender === 'faheem' && (
               <div className="ml-2 flex-shrink-0 self-end">
                   <FaheemAvatar state={msg.emotion || 'idle'} size="xs" className="w-8 h-8" />
               </div>
            )}
            
            {msg.isCard ? (
                <div className="bg-white rounded-2xl shadow-md p-3 max-w-[85%] w-full border border-gray-200 text-sm">
                    <div className="flex items-center gap-2 mb-2 text-absher-green font-bold border-b pb-1">
                        <span>⚠️</span>
                        <span>{msg.cardData.title}</span>
                    </div>
                    <p className="text-gray-700 mb-2">{msg.cardData.details}</p>
                    <div className="bg-gray-50 p-2 rounded-lg text-xs space-y-1 mb-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">المركبة:</span>
                            <span className="font-medium">{msg.cardData.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">المفوض له:</span>
                            <span className="font-medium">{msg.cardData.authorized}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 py-1 bg-absher-green text-white rounded hover:bg-absher-dark transition-colors text-xs">
                            ✅ موافق واعتماد
                        </button>
                    </div>
                </div>
            ) : (
                <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.sender === 'user' 
                        ? 'bg-absher-green text-white rounded-br-none' 
                        : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-bl-none'
                    }`}
                >
                    {msg.text}
                </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-end animate-pulse">
             <div className="bg-white p-2 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 flex gap-1 items-center">
                <FaheemAvatar state="thinking" size="xs" className="w-6 h-6" />
                <span className="text-xs text-gray-400 mr-2">يفكر...</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoPlayChat;
