"""
Thin pip/pipx-installable wrapper around the real Podcast Guest CRM CLI.

The real CLI (packages/cli in the podcast-guest-crm monorepo) is a TypeScript
program that talks to the project's Fastify API and to Supabase directly.
This package does not reimplement any of that logic in Python; it exists
purely so `pip install podcast-guest-crm-cli` / `pipx run podcast-guest-crm-cli`
works for Python-first and agent environments that don't already have the
npm package installed. Every invocation just shells out to
`npx podcast-guest-crm-cli`, pinned to this wrapper's own version so the two
registries stay in lockstep.
"""

from __future__ import annotations

import shutil
import subprocess
import sys

from . import __version__

NPM_PACKAGE_NAME = "podcast-guest-crm-cli"


def find_missing_runtime() -> str | None:
    """Returns a human-readable name of the first missing prerequisite, or None if both are present."""
    if shutil.which("node") is None:
        return "node"
    if shutil.which("npx") is None:
        return "npx"
    return None


def build_npx_target() -> str:
    """Pins the npx invocation to this wrapper's own version when known, so a pip-installed
    version doesn't silently start resolving to whatever is newest on npm at run time."""
    if __version__ == "0.0.0":
        return NPM_PACKAGE_NAME
    return f"{NPM_PACKAGE_NAME}@{__version__}"


def build_command(args: list[str]) -> list[str]:
    return ["npx", "--yes", build_npx_target(), *args]


def missing_runtime_message(missing: str) -> str:
    return "\n".join(
        [
            f"{NPM_PACKAGE_NAME}: '{missing}' was not found on PATH.",
            "",
            "This is a Node.js CLI; this PyPI package is a thin wrapper that bootstraps it",
            "via npx, not a standalone Python reimplementation.",
            "",
            "Install Node.js (which bundles npm and npx), then re-run this command:",
            "  https://nodejs.org/en/download",
            "",
            "Or install the CLI directly with npm:",
            f"  npm install -g {NPM_PACKAGE_NAME}",
        ]
    )


def main() -> None:
    missing = find_missing_runtime()
    if missing is not None:
        print(missing_runtime_message(missing), file=sys.stderr)
        sys.exit(1)

    args = sys.argv[1:]
    result = subprocess.run(build_command(args))
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
