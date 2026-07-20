#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { registerLoginCommand } from './commands/login';
import { registerGuestCommands } from './commands/guest';
import { registerOutreachCommands } from './commands/outreach';
import { registerAnalyticsCommands } from './commands/analytics';

const __dirname = dirname(fileURLToPath(import.meta.url));

function readVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')) as {
      version: string;
    };
    return pkg.version;
  } catch {
    return '0.0.0';
  }
}

const program = new Command();

program
  .name('podcast-guest-crm-cli')
  .description(
    'Command-line client for Podcast Guest CRM. Manage the guest lifecycle ' +
      '(discover -> outreach -> scheduled -> recorded -> published -> follow_up), draft ' +
      'AI outreach emails, and pull pipeline analytics, from a terminal or an agent.'
  )
  .version(readVersion())
  .option('--json', 'Output machine-readable JSON instead of human-formatted text (every data-returning command supports this)');

registerLoginCommand(program);
registerGuestCommands(program);
registerOutreachCommands(program);
registerAnalyticsCommands(program);

program.parseAsync(process.argv).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});
