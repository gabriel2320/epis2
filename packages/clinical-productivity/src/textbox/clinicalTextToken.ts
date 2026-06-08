/** Token activo en cursor — autocompletado inline sin reemplazo silencioso. */
export type ActiveTextToken = {
  token: string;
  start: number;
  end: number;
};

export function getTokenAtCursor(text: string, cursor: number): ActiveTextToken | null {
  if (cursor < 0 || cursor > text.length) return null;
  const before = text.slice(0, cursor);
  const match = before.match(/(\S+)$/);
  if (!match?.[1]) return null;
  const token = match[1];
  return { token, start: cursor - token.length, end: cursor };
}

export function getLastLineToken(text: string): ActiveTextToken | null {
  const line = text.split('\n').pop() ?? '';
  const match = line.match(/(\S+)$/);
  if (!match?.[1]) return null;
  const token = match[1];
  const lineStart = text.length - line.length;
  const tokenStartInLine = line.length - token.length;
  return { token, start: lineStart + tokenStartInLine, end: text.length };
}

export function replaceTokenAtRange(
  text: string,
  start: number,
  end: number,
  replacement: string,
): string {
  return `${text.slice(0, start)}${replacement}${text.slice(end)}`;
}
