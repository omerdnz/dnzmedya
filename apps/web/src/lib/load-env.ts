import { existsSync, readFileSync } from 'fs';
import path from 'path';

let loaded = false;

function parseEnvLine(line: string): [string, string] | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return null;

  const eq = trimmed.indexOf('=');
  if (eq <= 0) return null;

  const key = trimmed.slice(0, eq).trim();
  let value = trimmed.slice(eq + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return [key, value];
}

function loadEnvFile(filePath: string, override: boolean) {
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const parsed = parseEnvLine(line);
    if (!parsed) continue;

    const [key, value] = parsed;
    if (override || process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

/** Load Groq/OpenAI keys from monorepo .env files (Next.js turbo cwd can miss them). */
export function ensureAiEnvLoaded() {
  if (loaded) return;
  loaded = true;

  const webRoot = process.cwd();
  const monorepoRoot = path.resolve(webRoot, '../..');

  const files = [
    path.join(monorepoRoot, '.env'),
    path.join(monorepoRoot, '.env.local'),
    path.join(webRoot, '.env'),
    path.join(webRoot, '.env.local'),
  ];

  for (const file of files) {
    loadEnvFile(file, false);
  }
}
