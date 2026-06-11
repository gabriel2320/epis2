import { describe, expect, it } from 'vitest';
import {
  clampTraditionalRadiusPx,
  epis2Shape,
  epis2ShapeProfiles,
  epis2TraditionalShapeMaxPx,
} from './shape.js';

describe('epis2Shape traditional profile', () => {
  it('EMR radii stay within institutional square cap', () => {
    const { traditional } = epis2ShapeProfiles;
    expect(traditional.chip).toBeLessThanOrEqual(traditional.max);
    expect(traditional.field).toBeLessThanOrEqual(traditional.max);
    expect(traditional.island).toBeLessThanOrEqual(traditional.max);
    expect(traditional.dialog).toBeLessThanOrEqual(traditional.max);
    expect(traditional.max).toBe(epis2TraditionalShapeMaxPx);
  });

  it('chip and field use 4px (small) — not pill/full', () => {
    expect(epis2ShapeProfiles.traditional.chip).toBe(epis2Shape.small);
    expect(epis2ShapeProfiles.traditional.field).toBe(epis2Shape.small);
    expect(epis2Shape.small).toBe(4);
  });

  it('command bar keeps separate profile from EMR surfaces', () => {
    expect(epis2ShapeProfiles.command.bar).toBe(epis2Shape.pill);
    expect(epis2ShapeProfiles.command.palette).toBe(epis2Shape.extraLarge);
  });

  it('clampTraditionalRadiusPx acota al max EMR', () => {
    expect(clampTraditionalRadiusPx(24)).toBe(10);
    expect(clampTraditionalRadiusPx(6)).toBe(6);
  });

  it('perfil calm mantiene islas 20px fuera de traditional EMR', () => {
    expect(epis2ShapeProfiles.calm.island).toBe(20);
    expect(epis2ShapeProfiles.calm.max).toBe(24);
  });
});
