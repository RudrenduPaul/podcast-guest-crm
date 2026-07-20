# podcast-guest-crm-cli

Command-line client for [Podcast Guest CRM](https://github.com/RudrenduPaul/podcast-guest-crm): manage the guest lifecycle (discover, outreach, scheduled, recorded, published, follow_up), draft AI outreach emails, and pull pipeline analytics from your terminal or an agent. This package wraps the project's real Fastify API, no invented endpoints.

![Login and first command](https://raw.githubusercontent.com/RudrenduPaul/podcast-guest-crm/main/docs/demo.gif)

## Install

```bash
npm install -g podcast-guest-crm-cli
# or run without installing:
npx podcast-guest-crm-cli --help
```

Python-first environments can `pip install podcast-guest-crm-cli` instead, a thin wrapper that shells out to this same package via `npx`.

## Login

```bash
podcast-guest-crm-cli login
```

`login` authenticates directly against Supabase's own REST auth endpoint (`POST <SUPABASE_URL>/auth/v1/token?grant_type=password`), the same identity provider the web app uses. The resulting session is cached to `~/.config/podcast-guest-crm-cli/credentials.json` (permissions `0600`) and refreshed silently with the stored refresh token when it expires.

## Commands

```bash
podcast-guest-crm-cli guest list --stage published --limit 5
podcast-guest-crm-cli guest show <id>
podcast-guest-crm-cli guest add --name "Ada Lovelace" --email ada@example.com --title "Engineer" --company "Analytical Engines"
podcast-guest-crm-cli guest stage <id> outreach --reason "replied positively"
podcast-guest-crm-cli outreach draft <guestId> --episode-angle "AI safety"
podcast-guest-crm-cli analytics summary
podcast-guest-crm-cli analytics pipeline
```

Add `--json` to any data-returning command for machine-readable output, meant for scripts and agents:

```bash
podcast-guest-crm-cli guest list --stage discover --json
```

![CLI guest list and analytics summary](https://raw.githubusercontent.com/RudrenduPaul/podcast-guest-crm/main/docs/usage.gif)

## FAQ

**What is this, and how is it different from calling the API directly?**
A typed CLI over the same Fastify API the web dashboard uses, with persistent login and a `--json` flag on every data command, so an agent or script can drive the guest pipeline without hand-rolling HTTP requests or a bearer token.

**Where are my credentials stored?**
`~/.config/podcast-guest-crm-cli/credentials.json`, file mode `0600`. Nothing is sent anywhere except Supabase's own auth endpoint and the API URL you configure.

**Does this work on Windows, macOS, and Linux?**
Yes. No compiled dependencies, pure Node 18+.

**What's the licensing situation?**
This CLI ships from the same repository as, and under the same license as, Podcast Guest CRM itself: proprietary, copyright Rudrendu Paul and Sourav Nandy. See [LICENSE](https://github.com/RudrenduPaul/podcast-guest-crm/blob/main/LICENSE).

See the [main README](https://github.com/RudrenduPaul/podcast-guest-crm#readme) for the full API reference and product FAQ.

## License

Proprietary. See [LICENSE](https://github.com/RudrenduPaul/podcast-guest-crm/blob/main/LICENSE) in the parent repository for full terms.
