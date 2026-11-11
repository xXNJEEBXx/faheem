import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await scan(file);
    else if (/\.(jsx?|tsx?|mjs|html|bak)$/.test(entry.name)) {
      const content = await readFile(file, 'utf8');
      assert.equal(/AIza[\w-]{15,}/.test(content), false, `Embedded Google credential in ${file}`);
      assert.equal(/\d{8,}:[\w-]{30,}/.test(content), false, `Embedded bot credential in ${file}`);
      assert.equal(content.includes('generativelanguage.googleapis.com'), false, `Direct provider call in ${file}`);
      assert.equal(/import\.meta\.env\.VITE_\w*(?:API_KEY|SECRET|BOT_TOKEN)/i.test(content), false, `Browser secret variable in ${file}`);
    }
  }
}

test('frontend source and production bundles contain no provider credentials or direct Gemini calls', async () => {
  await scan(path.join(root, 'src'));
  await scan(path.join(root, 'dist'));
});
