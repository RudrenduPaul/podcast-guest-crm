import { CliError } from './api-client';

/** Shared by every command via the `--json` global flag (Commander option inheritance). */
export interface GlobalOpts {
  json?: boolean;
}

export function printJson(data: unknown): void {
  process.stdout.write(`${JSON.stringify(data, null, 2)}\n`);
}

export function printError(err: unknown, json: boolean): never {
  const message = err instanceof Error ? err.message : String(err);
  const statusCode = err instanceof CliError ? err.statusCode : undefined;

  if (json) {
    printJson({ error: err instanceof Error ? err.name : 'Error', message, statusCode });
  } else {
    process.stderr.write(`Error: ${message}\n`);
  }
  process.exitCode = 1;
  return undefined as never;
}

/** Simple fixed-width table renderer; no dependency needed for this CLI's output shapes. */
export function printTable(rows: Array<Record<string, string>>, columns: string[]): void {
  if (rows.length === 0) {
    process.stdout.write('No results.\n');
    return;
  }

  const widths = columns.map((col) =>
    Math.max(col.length, ...rows.map((row) => (row[col] ?? '').length))
  );

  const renderRow = (cells: string[]): string =>
    cells.map((cell, i) => cell.padEnd(widths[i] ?? 0)).join('  ');

  process.stdout.write(`${renderRow(columns)}\n`);
  process.stdout.write(`${widths.map((w) => '-'.repeat(w)).join('  ')}\n`);
  for (const row of rows) {
    process.stdout.write(`${renderRow(columns.map((col) => row[col] ?? ''))}\n`);
  }
}
