import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import ChatInterface from "./components/ChatInterface";
import AbsherChallenge from "./components/AbsherChallenge";
import AboutFaheem from "./components/AboutFaheem";
import ChallengeResults from "./components/ChallengeResults";

function App() {
  const [currentView, setCurrentView] = useState("landing"); // landing, chat, challenge, about, results

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return <ChatInterface onBack={() => setCurrentView("landing")} />;
      case "challenge":
        return <AbsherChallenge onBack={() => setCurrentView("landing")} />;
      case "about":
        return (
          <AboutFaheem
            onBack={() => setCurrentView("landing")}
            onStartChallenge={() => setCurrentView("challenge")}
          />
        );
      case "results":
        return <ChallengeResults onBack={() => setCurrentView("landing")} />;
      default:
        return (
          <LandingPage
            onStartChat={() => setCurrentView("chat")}
            onStartChallenge={() => setCurrentView("challenge")}
            onAbout={() => setCurrentView("about")}
            onResults={() => setCurrentView("results")}
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
