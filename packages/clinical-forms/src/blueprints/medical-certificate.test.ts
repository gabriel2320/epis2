import { describe, expect, it } from 'vitest';
import { medicalCertificateBlueprint } from './medical-certificate.js';

describe('medicalCertificateBlueprint', () => {
  it('ruta y intent canónicos Ola 2', () => {
    expect(medicalCertificateBlueprint.routePath).toBe('/espacio/certificado');
    expect(medicalCertificateBlueprint.intentIds).toContain('create_medical_certificate');
  });
});
