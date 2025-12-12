import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import ChatInterface from './components/ChatInterface';
import AbsherChallenge from './components/AbsherChallenge';

function App() {
  const [currentView, setCurrentView] = useState('landing'); // landing, chat, challenge

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface onBack={() => setCurrentView('landing')} />;
      case 'challenge':
        return <AbsherChallenge onBack={() => setCurrentView('landing')} />;
      default:
        return (
          <LandingPage 
            onStartChat={() => setCurrentView('chat')} 
            onStartChallenge={() => setCurrentView('challenge')} 
          />
        );
    }
  };

  return (
    <div className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen">
      {renderView()}
    </div>
  );
}

export default App;

