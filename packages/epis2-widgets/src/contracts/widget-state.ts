/** Estados obligatorios de presentación de un widget. */
export const WIDGET_STATE_KINDS = [
  'loading',
  'ready',
  'empty',
  'error',
  'forbidden',
  'offline',
] as const;

export type WidgetStateKind = (typeof WIDGET_STATE_KINDS)[number];

export function isWidgetStateKind(value: string): value is WidgetStateKind {
  return (WIDGET_STATE_KINDS as readonly string[]).includes(value);
}
