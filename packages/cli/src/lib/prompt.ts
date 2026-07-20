import { createInterface } from 'node:readline';

export function promptText(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

const CTRL_C = '';
const CTRL_D = '';
const BACKSPACE = '';

/**
 * Masked password prompt using raw stdin, avoiding echoing the password to
 * the terminal or to a scrollback buffer. Falls back to a plain prompt when
 * stdin isn't a TTY (e.g. piped input in CI or tests).
 */
export function promptPassword(question: string): Promise<string> {
  if (!process.stdin.isTTY) {
    return promptText(question);
  }

  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    let password = '';

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    const onData = (char: string): void => {
      if (char === '\n' || char === '\r' || char === CTRL_D) {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(password);
        return;
      }

      if (char === CTRL_C) {
        process.stdout.write('\n');
        process.exit(130);
      }

      if (char === BACKSPACE || char === '\b') {
        password = password.slice(0, -1);
        return;
      }

      password += char;
    };

    stdin.on('data', onData);
  });
}
