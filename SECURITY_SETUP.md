# Gemini deployment and credential replacement

The old Gemini credential was embedded in frontend source and in a tracked `.bak` copy. Git history also contains it. Current source has been cleaned; existing Git history and already published deployments have not been rewritten or replaced.

Before using the updated build in production:

1. Create a replacement Gemini key in Google AI Studio / Google Cloud. Restrict it to the Gemini API and configure appropriate provider quotas and billing alerts. Do not paste it into chat or source code.
2. Store the replacement as `GEMINI_API_KEY` only on the Laravel service in Railway. Set `GEMINI_MODEL` to a model available to this Google project (the default preserves the previous model name). Never create `VITE_GEMINI_API_KEY` or put the key in Vercel's frontend build variables.
3. Use `APP_ENV=production`, `APP_DEBUG=false` and a shared persistent cache (`CACHE_STORE=database` is already supported). Configure `GEMINI_DAILY_REQUEST_LIMIT` for the intended demo budget; its default is 1000 requests per day across the application. Per-IP and per-session minute limits also apply. These are application safeguards, not a guaranteed monetary spending cap.
4. Deploy Laravel and the rebuilt React frontend together. Restart any long-lived workers and refresh Laravel's configuration cache after changing server variables. Run migrations and create the first admin as documented in README.
5. Verify a real challenge reply using the replacement key, confirm that the browser calls `/api/chat/generate` only, and revoke/delete the old key. If misuse is ongoing, disable the old key immediately even if this temporarily interrupts the demo. Review provider usage and billing.
6. Remove access to obsolete public frontend deployments containing the old key where possible. Revocation is still necessary because copied bundles and Git history cannot be made secret again by editing the latest files.

Railway sealed variables hide stored values from the UI/API/CLI, but the running application still receives them. They cannot prevent code from returning, embedding, or logging a secret. Seal the replacement server variable after configuring it, and avoid dumping environment/configuration into logs.

The backend proxy validates an active session, persona, message lengths and total history; it limits provider output, sets connection/request timeouts, and returns sanitized failures. Tests use mocked provider responses; no new real key has been configured or used during this change. Production deployment and credential replacement remain pending.

Validation: backend suite 24 tests / 92 assertions; production build; ESLint on changed frontend components; `node --test tests/no-client-secrets.test.mjs` from `src/frontend` after building.

Sources: [Google API key security](https://ai.google.dev/gemini-api/docs/api-key), [Railway sealed variables](https://docs.railway.com/variables#sealed-variables).
