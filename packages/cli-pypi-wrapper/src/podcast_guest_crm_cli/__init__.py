from importlib.metadata import PackageNotFoundError, version

try:
    __version__ = version("podcast-guest-crm-cli")
except PackageNotFoundError:
    # Editable/dev install with no installed distribution metadata yet.
    __version__ = "0.0.0"
