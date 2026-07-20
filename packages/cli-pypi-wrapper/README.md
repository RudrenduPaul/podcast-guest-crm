# podcast-guest-crm-cli (PyPI wrapper)

A thin `pip`/`pipx`-installable wrapper around the real [Podcast Guest CRM CLI](https://github.com/RudrenduPaul/podcast-guest-crm/tree/main/packages/cli), which is a TypeScript program that talks to the project's Fastify API and to Supabase directly.

This package does not reimplement the CLI in Python. Every invocation shells out to `npx podcast-guest-crm-cli`, pinned to this wrapper's own version so the npm and PyPI releases stay in lockstep. It exists so Python-first tooling and agent sandboxes that reach for `pip install <name>-cli` get the same CLI without installing it manually from npm first.

## Requirements

Node.js (which bundles `npm` and `npx`) must be on `PATH`. If it isn't, this wrapper prints an install link and exits with a nonzero status rather than failing silently.

## Install

```bash
pip install podcast-guest-crm-cli
# or
pipx install podcast-guest-crm-cli
```

## Usage

```bash
podcast-guest-crm-cli --help
podcast-guest-crm-cli login
podcast-guest-crm-cli guest list --json
```

See the [main README](https://github.com/RudrenduPaul/podcast-guest-crm#readme) for the full command reference, the guest lifecycle model, and the FAQ.

## License

Proprietary. See [LICENSE](https://github.com/RudrenduPaul/podcast-guest-crm/blob/main/LICENSE) in the parent repository for full terms.
