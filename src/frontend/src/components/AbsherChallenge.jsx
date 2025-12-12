import React, { useState, useEffect } from 'react';
import FaheemAvatar from './FaheemAvatar';

const AbsherChallenge = ({ onBack }) => {
  const [gameState, setGameState] = useState('lobby'); // lobby, searching, playing, revealed
  const [messages, setMessages] = useState([]);
  const [opponentType, setOpponentType] = useState(null); // 'faheem' or 'human'
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const startGame = () => {
    setGameState('searching');
    setTimeout(() => {
      setGameState('playing');
      setOpponentType(Math.random() > 0.5 ? 'faheem' : 'human'); // Randomly assign
      setMessages([{
        id: 1,
        sender: 'opponent',
        text: 'السلام عليكم، كيف الحال؟',
        timestamp: new Date()
      }]);
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate opponent response
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        "الحمد لله بخير، أنت كيفك؟",
        "أنا هنا عشان أساعدك، تفضل.",
        "ممكن توضح أكثر؟",
        "الجو اليوم حلو بالرياض، صح؟"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'opponent',
        text: randomResponse
      }]);
      setIsTyping(false);
    }, 2000 + Math.random() * 2000); // Random delay to simulate human/AI
  };

  const revealIdentity = () => {
    setGameState('revealed');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 flex justify-between items-center border-b border-gray-800">
        <button onClick={onBack} className="text-gray-400 hover:text-white">
          خروج
        </button>
        <div className="font-bold text-xl text-absher-green">تحدي أبشر 🏆</div>
        <div className="w-8"></div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {gameState === 'lobby' && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="text-6xl">🕵️‍♂️</div>
            <h2 className="text-3xl font-bold">كشف القصد البشري</h2>
            <p className="text-gray-400 max-w-md">
              راح تدخل محادثة مع طرف مجهول. <br/>
              مهمتك تكتشف: هل هو "فهيم" (AI) ولا إنسان حقيقي؟
            </p>
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-absher-green hover:bg-absher-dark rounded-full font-bold text-lg transition-all transform hover:scale-105"
            >
              ابدأ التحدي
            </button>
          </div>
        )}

        {gameState === 'searching' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-absher-green border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xl animate-pulse">جاري البحث عن خصم...</p>
          </div>
        )}

        {(gameState === 'playing' || gameState === 'revealed') && (
          <div className="w-full max-w-md flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-gray-800 rounded-xl mb-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`p-3 rounded-xl max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-gray-500 text-sm text-left">الطرف الآخر يكتب...</div>}
            </div>

            {gameState === 'playing' ? (
              <div className="space-y-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <button type="submit" className="bg-blue-600 p-2 rounded-lg">إرسال</button>
                  <input 
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-right"
                    placeholder="اكتب رسالة..."
                  />
                </form>
                <button 
                  onClick={revealIdentity}
                  className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold"
                >
                  كشف الهوية! 🔍
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4 animate-bounce-in">
                <h3 className="text-2xl font-bold">النتيجة</h3>
                <div className="text-6xl">
                  {opponentType === 'faheem' ? <FaheemAvatar state="wink" size="lg" /> : '👤'}
                </div>
                <p className="text-xl">
                  الطرف الآخر كان: <span className="font-bold text-absher-green">{opponentType === 'faheem' ? 'فهيم!' : 'إنسان!'}</span>
                </p>
                {opponentType === 'faheem' && <p className="text-gray-400">خدعك؟ 😉</p>}
                <button onClick={() => setGameState('lobby')} className="text-blue-400 underline">العودة للقائمة</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsherChallenge;
