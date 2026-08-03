import subprocess
import sys

import pytest

from podcast_guest_crm_cli import cli


def test_build_command_pins_to_wrapper_version(monkeypatch):
    monkeypatch.setattr(cli, "__version__", "0.1.0")

    command = cli.build_command(["guest", "list", "--json"])

    assert command == ["npx", "--yes", "podcast-guest-crm-cli@0.1.0", "guest", "list", "--json"]


def test_build_command_falls_back_to_unpinned_when_version_unknown(monkeypatch):
    monkeypatch.setattr(cli, "__version__", "0.0.0")

    command = cli.build_command(["login"])

    assert command == ["npx", "--yes", "podcast-guest-crm-cli", "login"]


def test_find_missing_runtime_reports_node_first(monkeypatch):
    monkeypatch.setattr(cli.shutil, "which", lambda name: None)
    assert cli.find_missing_runtime() == "node"


def test_find_missing_runtime_reports_npx_when_only_node_present(monkeypatch):
    monkeypatch.setattr(cli.shutil, "which", lambda name: "/usr/bin/node" if name == "node" else None)
    assert cli.find_missing_runtime() == "npx"


def test_find_missing_runtime_returns_none_when_both_present(monkeypatch):
    monkeypatch.setattr(cli.shutil, "which", lambda name: f"/usr/bin/{name}")
    assert cli.find_missing_runtime() is None


def test_missing_runtime_message_names_the_real_npm_package():
    message = cli.missing_runtime_message("npx")
    assert "npx" in message
    assert "npm install -g podcast-guest-crm-cli" in message


def test_main_exits_nonzero_with_clear_message_when_node_missing(monkeypatch, capsys):
    monkeypatch.setattr(cli, "find_missing_runtime", lambda: "node")

    with pytest.raises(SystemExit) as exc_info:
        cli.main()

    assert exc_info.value.code == 1
    captured = capsys.readouterr()
    assert "'node' was not found on PATH" in captured.err


def test_main_shells_out_to_npx_and_forwards_exit_code(monkeypatch):
    monkeypatch.setattr(cli, "find_missing_runtime", lambda: None)
    monkeypatch.setattr(sys, "argv", ["podcast-guest-crm-cli", "analytics", "summary", "--json"])

    captured_args: dict[str, list[str]] = {}

    def fake_run(command, **kwargs):
        captured_args["command"] = command
        return subprocess.CompletedProcess(command, returncode=0)

    monkeypatch.setattr(cli.subprocess, "run", fake_run)

    with pytest.raises(SystemExit) as exc_info:
        cli.main()

    assert exc_info.value.code == 0
    assert captured_args["command"][:2] == ["npx", "--yes"]
    assert captured_args["command"][-3:] == ["analytics", "summary", "--json"]


def test_resolve_npx_target_uses_pinned_version_when_published(monkeypatch):
    monkeypatch.setattr(cli, "__version__", "0.1.0")
    monkeypatch.setattr(cli, "npm_version_exists", lambda version: True)

    assert cli.resolve_npx_target() == "podcast-guest-crm-cli@0.1.0"


def test_resolve_npx_target_falls_back_to_latest_when_version_drifted(monkeypatch, capsys):
    monkeypatch.setattr(cli, "__version__", "0.1.3")
    monkeypatch.setattr(cli, "npm_version_exists", lambda version: False)

    target = cli.resolve_npx_target()

    assert target == "podcast-guest-crm-cli"
    captured = capsys.readouterr()
    assert "drifted out of lockstep" in captured.err


def test_resolve_npx_target_skips_preflight_when_version_unknown(monkeypatch):
    monkeypatch.setattr(cli, "__version__", "0.0.0")
    monkeypatch.setattr(
        cli, "npm_version_exists", lambda version: (_ for _ in ()).throw(AssertionError("should not be called"))
    )

    assert cli.resolve_npx_target() == "podcast-guest-crm-cli"


def test_npm_version_exists_true_on_success(monkeypatch):
    monkeypatch.setattr(
        cli.subprocess,
        "run",
        lambda command, **kwargs: subprocess.CompletedProcess(command, returncode=0, stdout="0.1.2\n", stderr=""),
    )
    assert cli.npm_version_exists("0.1.2") is True


def test_npm_version_exists_false_on_etarget(monkeypatch):
    monkeypatch.setattr(
        cli.subprocess,
        "run",
        lambda command, **kwargs: subprocess.CompletedProcess(
            command, returncode=1, stdout="", stderr="npm error code ETARGET\n"
        ),
    )
    assert cli.npm_version_exists("0.1.3") is False


def test_npm_version_exists_defaults_true_on_timeout(monkeypatch):
    def raise_timeout(command, **kwargs):
        raise subprocess.TimeoutExpired(command, kwargs.get("timeout", 15))

    monkeypatch.setattr(cli.subprocess, "run", raise_timeout)
    assert cli.npm_version_exists("0.1.2") is True


def test_main_forwards_nonzero_exit_code(monkeypatch):
    monkeypatch.setattr(cli, "find_missing_runtime", lambda: None)
    monkeypatch.setattr(sys, "argv", ["podcast-guest-crm-cli", "guest", "show", "nonexistent"])
    monkeypatch.setattr(
        cli.subprocess,
        "run",
        lambda command, **kwargs: subprocess.CompletedProcess(command, returncode=1),
    )

    with pytest.raises(SystemExit) as exc_info:
        cli.main()

    assert exc_info.value.code == 1
