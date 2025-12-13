# 🚀 دليل النشر (Deployment Guide)

هذا المشروع جاهز للنشر على **Vercel** (للواجهة الأمامية) و **Railway** (للواجهة الخلفية).

## 1️⃣ الواجهة الأمامية (Frontend) - Vercel

1.  أنشئ مشروعاً جديداً في [Vercel](https://vercel.com).
2.  اربط المستودع (Repository) الخاص بك.
3.  في إعدادات المشروع (Project Settings):
    *   **Root Directory:** اجعلها `src/frontend`.
    *   **Framework Preset:** سيتم اكتشافه تلقائياً كـ `Vite`.
    *   **Build Command:** `npm run build` (افتراضي).
    *   **Output Directory:** `dist` (افتراضي).
4.  اضغط **Deploy**.

## 2️⃣ الواجهة الخلفية (Backend) - Railway

1.  أنشئ مشروعاً جديداً في [Railway](https://railway.app).
2.  اختر **Deploy from GitHub repo**.
3.  اختر المستودع الخاص بك.
4.  في إعدادات الخدمة (Settings):
    *   **Root Directory:** اجعلها `src/backend`.
    *   Railway سيكتشف وجود `Dockerfile` وسيستخدمه لبناء الصورة.
5.  في قسم **Variables** (المتغيرات)، أضف التالي:
    *   `APP_KEY`: (يمكنك توليده باستخدام `php artisan key:generate --show` محلياً).
    *   `APP_DEBUG`: `false` (للإنتاج).
    *   `APP_URL`: رابط المشروع على Railway (بعد النشر الأول).
    *   `GEMINI_API_KEY`: مفتاح Google Gemini API الخاص بك.
    *   `PORT`: Railway يضيفه تلقائياً، لكن تأكد من وجوده.
6.  **قاعدة البيانات (اختياري):**
    *   إذا كنت تحتاج قاعدة بيانات، أضف خدمة MySQL أو PostgreSQL في Railway.
    *   اربط المتغيرات (`DB_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`) في مشروع Laravel.

## 📁 ملفات التكوين المضافة

*   `src/frontend/vercel.json`: لضمان عمل التوجيه (Routing) بشكل صحيح في Vercel.
*   `src/backend/Dockerfile`: لبناء بيئة PHP 8.2 مع Apache.
*   `src/backend/docker-entrypoint.sh`: لتشغيل السيرفر وتنفيذ الترحيلات (Migrations) عند البدء.
