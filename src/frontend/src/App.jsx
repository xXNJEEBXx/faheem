import React, { useState, useEffect } from "react";
import LandingPage from "./components/LandingPage";
import ChatInterface from "./components/ChatInterface";
import AbsherChallenge from "./components/AbsherChallenge";
import AboutFaheem from "./components/AboutFaheem";
import ChallengeResults from "./components/ChallengeResults";
import AdminLogin from "./components/AdminLogin";

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [adminToken, setAdminToken] = useState(null);
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("faheem_lang") === "ar" ? "ar" : "en";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("faheem_lang", lang);
  }, [lang]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const toggleLang = () => {
    setLang((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const commonProps = {
    isDark,
    toggleDarkMode,
    lang,
    toggleLang,
  };

  const renderView = () => {
    switch (currentView) {
      case "chat":
        return (
          <ChatInterface
            onBack={() => setCurrentView("landing")}
            {...commonProps}
          />
        );
      case "challenge":
        return (
          <AbsherChallenge
            onBack={() => setCurrentView("landing")}
            {...commonProps}
          />
        );
      case "about":
        return (
          <AboutFaheem
            onBack={() => setCurrentView("landing")}
            onStartChallenge={() => setCurrentView("challenge")}
            {...commonProps}
          />
        );
      case "results":
        return adminToken ? (
          <ChallengeResults
            token={adminToken}
            onUnauthorized={() => setAdminToken(null)}
            onBack={() => setCurrentView("landing")}
            {...commonProps}
          />
        ) : (
          <AdminLogin
            onBack={() => setCurrentView("landing")}
            onLogin={setAdminToken}
            {...commonProps}
          />
        );
      default:
        return (
          <LandingPage
            onStartChat={() => setCurrentView("chat")}
            onStartChallenge={() => setCurrentView("challenge")}
            onAbout={() => setCurrentView("about")}
            onResults={() => setCurrentView("results")}
            {...commonProps}
          />
        );
    }
  };

  return (
    <div
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`font-sans antialiased min-h-screen relative transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {renderView()}
    </div>
  );
}

export default App;
