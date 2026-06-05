import type { WidgetStateKind } from './widget-state.js';

/** Resultado de carga de datos de un widget — sin escritura clínica. */
export type WidgetDataResult<T> =
  | { status: 'loading' }
  | { status: 'ready'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string }
  | { status: 'forbidden' }
  | { status: 'offline' };

export type WidgetVisibilityReason =
  | 'allowed'
  | 'hidden-by-default'
  | 'forbidden'
  | 'missing-context'
  | 'dashboard-not-on-home';

export type WidgetVisibility = {
  widgetId: string;
  visible: boolean;
  shouldFetch: boolean;
  presentation: WidgetStateKind | 'hidden';
  reason: WidgetVisibilityReason;
};
