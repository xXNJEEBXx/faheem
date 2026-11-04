import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import ChatInterface from "./components/ChatInterface";
import AbsherChallenge from "./components/AbsherChallenge";
import AboutFaheem from "./components/AboutFaheem";
import ChallengerResults from "./components/ChallengerResults";

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isDarkModeActive = savedTheme === "dark" || document.documentElement.classList.contains("dark");

    if (isDarkModeActive) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return <ChatInterface onBack={() => setCurrentView("landing")} isDark={isDark} toggleDarkMode={toggleDarkMode} />;
      case "challenge":
        return <AbsherChallenge onBack={() => setCurrentView("landing")} isDark={isDark} toggleDarkMode={toggleDarkMode} />;
      case "about":
        return (
          <AboutFaheem
            onBack={() => setCurrentView("landing")}
            onStartChallenge={() => setCurrentView("challenge")}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
          />
        );
      case "results":
        return <ChallengerResults onBack={() => setCurrentView("landing")} isDark={isDark} toggleDarkMode={toggleDarkMode} />;
      default:
        return (
          <LandingPage
            onStartChat={() => setCurrentView("chat")}
            onStartChallenge={() => setCurrentView("challenge")}
            onAbout={() => setCurrentView("about")}
            onResults={() => setCurrentView("results")}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
          />
        );
    }
  };

  return (
    <div className={`font-sans antialiased min-h-screen relative transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-yellow-400 shadow-xl border border-gray-200 dark:border-gray-700 hover:scale-110 transition-all cursor-pointer flex items-center justify-center text-xl"
        title="تغيير الوضع المظلم"
      >
        {isDark ? "☀️" : "🌙"}
      </button>
      {renderView()}
    </div>
  );
}

export default App;
