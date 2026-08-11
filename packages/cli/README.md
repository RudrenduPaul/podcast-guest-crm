<!-- mcp-name: io.github.RudrenduPaul/podcast-guest-crm -->

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

## MCP Server

`podcast-guest-crm-cli` ships a Model Context Protocol server, so an agent (Claude Desktop, Claude Code, or any other MCP client) can drive the guest pipeline directly instead of shelling out to the CLI. `podcast-guest-crm-cli mcp` starts the server over stdio, exposing five tools that call straight into the same `apiRequest()` seam every CLI command uses, no logic is reimplemented for the MCP path: `list_guests`, `add_guest`, `update_guest_stage`, `draft_outreach_email`, and `get_analytics_summary`. It requires `podcast-guest-crm-cli login` to have been run first; the cached session at `~/.config/podcast-guest-crm-cli/credentials.json` is reused automatically.

```bash
npm install -g podcast-guest-crm-cli
podcast-guest-crm-cli login
```

Register it with an MCP client by pointing its server config at this binary with the `mcp` argument. For Claude Desktop or Claude Code, add an `mcpServers` block:

```json
{
  "mcpServers": {
    "podcast-guest-crm": {
      "command": "npx",
      "args": ["podcast-guest-crm-cli", "mcp"]
    }
  }
}
```

`update_guest_stage` is the core lifecycle tool: given a guest ID and a target stage, it calls `PATCH /api/v1/guests/:id/stage` and returns the updated guest. An example `tools/call`:

```json
{"name": "update_guest_stage", "arguments": {"id": "guest_1", "stage": "outreach", "reason": "replied positively"}}
```

returns the same JSON envelope `guest stage <id> outreach --json` prints on the CLI. Every tool here is wrapped so a failure (not logged in, an invalid stage transition, a network error) comes back as a normal `isError: true` result instead of crashing the server.

## FAQ

**What is this, and how is it different from calling the API directly?**
A typed CLI over the same Fastify API the web dashboard uses, with persistent login and a `--json` flag on every data command, so an agent or script can drive the guest pipeline without hand-rolling HTTP requests or a bearer token.

**Where are my credentials stored?**
`~/.config/podcast-guest-crm-cli/credentials.json`, file mode `0600`. Nothing is sent anywhere except Supabase's own auth endpoint and the API URL you configure.

**Does this work on Windows, macOS, and Linux?**
Yes. No compiled dependencies, pure Node 20+ (matches the `engines.node` field in `package.json`).

**What's the licensing situation?**
This CLI ships from the same repository as, and under the same license as, Podcast Guest CRM itself: proprietary, copyright Rudrendu Paul and Sourav Nandy. See [LICENSE](https://github.com/RudrenduPaul/podcast-guest-crm/blob/main/LICENSE).

See the [main README](https://github.com/RudrenduPaul/podcast-guest-crm#readme) for the full API reference and product FAQ.

## License

Proprietary. See [LICENSE](https://github.com/RudrenduPaul/podcast-guest-crm/blob/main/LICENSE) in the parent repository for full terms.
