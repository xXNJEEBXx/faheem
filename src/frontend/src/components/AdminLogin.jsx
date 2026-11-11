import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function AdminLogin({
  onBack,
  onLogin,
  isDark = false,
  toggleDarkMode,
  lang = "en",
  toggleLang,
}) {
  const isEn = lang === "en";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await axios.post(`${API_BASE_URL}/admin/login`, {
        email,
        password,
      });
      onLogin(data.token);
    } catch (err) {
      setError(
        err.response?.status === 429
          ? isEn
            ? "Too many attempts. Please wait a minute and try again."
            : "محاولات كثيرة جداً. يرجى الانتظار دقيقة والمحاولة مرة أخرى."
          : err.response?.status === 422
          ? isEn
            ? "Invalid email or password."
            : "البريد الإلكتروني أو كلمة المرور غير صحيحة."
          : isEn
          ? "Unable to connect. Please try again."
          : "تعذر الاتصال بالخادم. حاول مرة أخرى."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      dir={isEn ? "ltr" : "rtl"}
      className={`min-h-screen p-6 flex items-center justify-center transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <form
        onSubmit={submit}
        className={`w-full max-w-md space-y-5 p-8 rounded-2xl shadow-sm border transition-colors ${
          isDark
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-transparent"
        }`}
      >
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className={`text-sm font-medium transition-colors ${
              isDark
                ? "text-gray-300 hover:text-emerald-400"
                : "text-gray-500 hover:text-absher-green"
            }`}
          >
            {isEn ? "← Back to Faheem" : "← العودة إلى فهيم"}
          </button>
          <div className="flex items-center gap-2">
            {toggleLang && (
              <button
                type="button"
                onClick={toggleLang}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  isDark
                    ? "bg-gray-700 text-gray-200 border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {isEn ? "عربي" : "EN"}
              </button>
            )}
            {toggleDarkMode && (
              <button
                type="button"
                onClick={toggleDarkMode}
                className={`p-1.5 rounded-lg border text-sm ${
                  isDark
                    ? "bg-gray-700 text-yellow-400 border-gray-600"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
            )}
          </div>
        </div>

        <h1
          className={`text-2xl font-bold ${
            isDark ? "text-emerald-400" : "text-absher-green"
          }`}
        >
          {isEn ? "Admin sign in" : "دخول المسؤول (Admin)"}
        </h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {isEn
            ? "Sign in to review challenge results and conversation records."
            : "سجّل الدخول لاستعراض نتائج التحدي وسجلات المحادثات."}
        </p>
        <label className="block text-sm font-medium">
          {isEn ? "Email" : "البريد الإلكتروني"}
          <input
            type="email"
            autoComplete="username"
            required
            maxLength={255}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
            className={`mt-2 w-full rounded-xl border p-3 ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </label>
        <label className="block text-sm font-medium">
          {isEn ? "Password" : "كلمة المرور"}
          <input
            type="password"
            autoComplete="current-password"
            required
            maxLength={255}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            dir="ltr"
            className={`mt-2 w-full rounded-xl border p-3 ${
              isDark
                ? "bg-gray-900 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </label>
        {error && (
          <p
            role="alert"
            className={`text-sm ${isDark ? "text-red-400" : "text-red-700"}`}
          >
            {error}
          </p>
        )}
        <button
          disabled={busy}
          className="w-full bg-absher-green hover:bg-absher-dark transition-colors text-white rounded-xl p-3 font-bold disabled:opacity-50"
        >
          {busy
            ? isEn
              ? "Signing in..."
              : "جاري الدخول..."
            : isEn
            ? "Sign in"
            : "تسجيل الدخول"}
        </button>
      </form>
    </main>
  );
}
