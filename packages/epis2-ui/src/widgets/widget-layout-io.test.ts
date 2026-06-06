import { describe, expect, it } from 'vitest';
import {
  applyWidgetLayoutOrder,
  parseWidgetLayoutImport,
  serializeWidgetLayoutToJson,
} from './widget-layout-io.js';

describe('widget-layout-io', () => {
  it('serializa e importa layout por superficie', () => {
    const json = serializeWidgetLayoutToJson('command-center', ['a', 'b']);
    const result = parseWidgetLayoutImport(json, 'command-center');
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.document.widgetIds).toEqual(['a', 'b']);
    }
  });

  it('reordena items según preferencia', () => {
    const items = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(applyWidgetLayoutOrder(items, ['c', 'a']).map((i) => i.id)).toEqual(['c', 'a', 'b']);
  });
});
