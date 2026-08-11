#!/usr/bin/env node
import { Command } from 'commander';
import { registerLoginCommand } from './commands/login';
import { registerGuestCommands } from './commands/guest';
import { registerOutreachCommands } from './commands/outreach';
import { registerAnalyticsCommands } from './commands/analytics';
import { startStdioServer } from './mcp/server';
import { readVersion } from './version';

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

program
  .command('mcp')
  .description(
    'Start the Podcast Guest CRM MCP server over stdio, exposing list_guests, add_guest, ' +
      'update_guest_stage, draft_outreach_email, and get_analytics_summary for agent-native invocation'
  )
  .action(async () => {
    await startStdioServer();
  });

program.parseAsync(process.argv).catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});
