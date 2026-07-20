import { Command } from 'commander';
import { saveCredentials, loadCliConfig } from '../lib/config';
import { signInWithPassword, SupabaseAuthError } from '../lib/supabase-auth';
import { promptText, promptPassword } from '../lib/prompt';
import { printJson, printError, type GlobalOpts } from '../lib/output';

interface LoginOpts extends GlobalOpts {
  email?: string;
  password?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
}

export function registerLoginCommand(program: Command): void {
  program
    .command('login')
    .description(
      'Log in with your Podcast Guest CRM email and password. Authenticates directly ' +
        'against Supabase (the same identity provider the web app uses) and caches the ' +
        'session to ~/.config/podcast-guest-crm-cli/credentials.json.'
    )
    .option('-e, --email <email>', 'Account email (prompted if omitted)')
    .option('-p, --password <password>', 'Account password (prompted if omitted; prefer the prompt over this flag on shared machines)')
    .option(
      '--supabase-url <url>',
      'Supabase project URL (or set PODCAST_GUEST_CRM_SUPABASE_URL)'
    )
    .option(
      '--supabase-anon-key <key>',
      'Supabase anon/public API key (or set PODCAST_GUEST_CRM_SUPABASE_ANON_KEY)'
    )
    .action(async (opts: LoginOpts, cmd: Command) => {
      const json = Boolean(cmd.optsWithGlobals().json);
      try {
        const cliConfig = loadCliConfig();
        const supabaseUrl = opts.supabaseUrl ?? cliConfig.supabaseUrl;
        const supabaseAnonKey = opts.supabaseAnonKey ?? cliConfig.supabaseAnonKey;

        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error(
            'Missing Supabase project config. Pass --supabase-url and --supabase-anon-key, ' +
              'or set PODCAST_GUEST_CRM_SUPABASE_URL / PODCAST_GUEST_CRM_SUPABASE_ANON_KEY. ' +
              'These match the NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY values ' +
              'your Podcast Guest CRM deployment already uses.'
          );
        }

        const email = opts.email ?? (await promptText('Email: '));
        const password = opts.password ?? (await promptPassword('Password: '));

        const session = await signInWithPassword(supabaseUrl, supabaseAnonKey, email, password);

        saveCredentials({
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
          expiresAt: session.expiresAt,
          email: session.email,
          supabaseUrl,
          supabaseAnonKey,
        });

        if (json) {
          printJson({ loggedIn: true, email: session.email });
        } else {
          process.stdout.write(`Logged in as ${session.email}\n`);
        }
      } catch (err) {
        if (err instanceof SupabaseAuthError) {
          printError(new Error(`Login failed: ${err.message}`), json);
          return;
        }
        printError(err, json);
      }
    });
}
