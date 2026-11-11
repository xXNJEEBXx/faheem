import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export default function AdminRegistration({
  token,
  onUnauthorized,
  isDark = false,
  lang = "en",
}) {
  const isEn = lang === "en";
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(
        `${API_BASE_URL}/admin/register`,
        Object.fromEntries(new FormData(form)),
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      form.reset();
      setSuccess(
        isEn
          ? "Administrator created successfully."
          : "تم إنشاء حساب المسؤول بنجاح."
      );
    } catch (err) {
      if ([401, 403].includes(err.response?.status)) {
        onUnauthorized();
        return;
      }
      setError(
        Object.values(err.response?.data?.errors || {})
          .flat()
          .join(" ") ||
          (isEn
            ? "Unable to create administrator. Please try again."
            : "تعذر إنشاء حساب المسؤول. حاول مرة أخرى.")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      dir={isEn ? "ltr" : "rtl"}
      className={`mb-6 p-5 rounded-2xl shadow-sm border transition-colors ${
        isDark
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-transparent text-gray-900"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className={`font-bold ${
          isDark ? "text-emerald-400" : "text-absher-green"
        }`}
      >
        {open
          ? isEn
            ? "Close account form"
            : "إغلاق نموذج الحساب"
          : isEn
          ? "Add administrator"
          : "+ إضافة مسؤول جديد"}
      </button>
      {open && (
        <form onSubmit={submit} className="mt-4 grid gap-4 max-w-lg">
          <label className="text-sm">
            {isEn ? "Name" : "الاسم"}
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={255}
              className={`block mt-1 w-full rounded-lg border p-2 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </label>
          <label className="text-sm">
            {isEn ? "Email" : "البريد الإلكتروني"}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={255}
              dir="ltr"
              className={`block mt-1 w-full rounded-lg border p-2 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </label>
          <label className="text-sm">
            {isEn
              ? "Password (12+ characters, upper/lowercase and numbers)"
              : "كلمة المرور (12+ حرفاً، حروف كبيرة وصغيرة وأرقام)"}
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={255}
              dir="ltr"
              className={`block mt-1 w-full rounded-lg border p-2 ${
                isDark
                  ? "bg-gray-900 border-gray-700 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </label>
          <label className="text-sm">
            {isEn ? "Confirm password" : "تأكيد كلمة المرور"}
            <input
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={255}
              dir="ltr"
              className={`block mt-1 w-full rounded-lg border p-2 ${
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
          {success && (
            <p
              role="status"
              className={`text-sm ${
                isDark ? "text-emerald-400" : "text-green-700"
              }`}
            >
              {success}
            </p>
          )}
          <button
            disabled={busy}
            className="rounded-lg bg-absher-green hover:bg-absher-dark transition-colors text-white p-3 font-bold disabled:opacity-50"
          >
            {busy
              ? isEn
                ? "Creating..."
                : "جاري الإنشاء..."
              : isEn
              ? "Create administrator"
              : "إنشاء حساب مسؤول"}
          </button>
        </form>
      )}
    </section>
  );
}
