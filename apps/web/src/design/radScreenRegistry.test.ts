import { describe, expect, it } from 'vitest';
import { auditForLocation, EPIS_RAD_SCREEN_REGISTRY } from './radScreenRegistry.js';

describe('radScreenRegistry', () => {
  it('inventario auditado no vacío', () => {
    expect(EPIS_RAD_SCREEN_REGISTRY.length).toBeGreaterThan(5);
  });

  it('resuelve comando y ficha', () => {
    expect(auditForLocation('/comando')?.surface).toBe('command');
    expect(auditForLocation('/espacio/ficha')?.surface).toBe('workspace');
  });

  it('resuelve dashboard con query', () => {
    expect(auditForLocation('/epis2/dashboard', '?tab=work&mode=dashboard')?.surface).toBe('grid');
  });
});
