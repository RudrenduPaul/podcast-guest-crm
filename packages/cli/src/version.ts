import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Reads this package's own version out of package.json at runtime, rather than hardcoding
 * a constant that would drift from the published version. Lives at src/ root (not a
 * subdirectory) so this file's __dirname sits one level above packages/cli/ both in dev
 * (unbundled, running directly from src/) and in production (tsup bundles every module,
 * including this one, into a single dist/index.js one level above packages/cli/ too) --
 * a nested file would resolve a different relative depth in each of those two cases.
 */
export function readVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')) as {
      version: string;
    };
    return pkg.version;
  } catch {
    return '0.0.0';
  }
}
