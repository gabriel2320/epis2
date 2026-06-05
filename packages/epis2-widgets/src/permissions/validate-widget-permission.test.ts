import { describe, expect, it } from 'vitest';
import { getWidgetById } from '../registry/widget-registry.js';
import { validateWidgetPermission } from './validate-widget-permission.js';

describe('validate-widget-permission', () => {
  it('permite roles declarados', () => {
    const widget = getWidgetById('patient-summary')!;
    expect(validateWidgetPermission(widget, 'physician').allowed).toBe(true);
  });

  it('rechaza roles no listados', () => {
    const widget = getWidgetById('recent-labs')!;
    const result = validateWidgetPermission(widget, 'auditor');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('role-forbidden');
  });

  it('rechaza sin rol', () => {
    const widget = getWidgetById('pending-drafts')!;
    expect(validateWidgetPermission(widget, undefined).reason).toBe('missing-role');
  });
});
