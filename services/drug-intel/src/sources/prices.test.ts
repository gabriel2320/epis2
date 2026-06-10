import { describe, expect, it } from 'vitest';
import { parseCenabastCsv, parseClpAmount, parseTufarmaciaJson } from './prices.js';

describe('drug-intel precios referenciales', () => {
  it('parsea montos CLP en distintos formatos', () => {
    expect(parseClpAmount(1234)).toBe(1234);
    expect(parseClpAmount('1234')).toBe(1234);
    expect(parseClpAmount('$1.234')).toBe(1234);
    expect(parseClpAmount('1.234,50')).toBe(1235);
    expect(parseClpAmount('gratis')).toBeNull();
    expect(parseClpAmount(-10)).toBeNull();
  });

  it('parsea respuesta JSON de Tufarmacia (arreglo plano)', () => {
    const body = JSON.stringify([
      { nombre: 'Losartán 50 mg x 30 comprimidos', precio: '$3.490' },
      { nombre: 'Sin precio', precio: null },
    ]);
    const entries = parseTufarmaciaJson(body, '2026-06-10T00:00:00.000Z');
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      productName: 'Losartán 50 mg x 30 comprimidos',
      price: {
        amountClp: 3490,
        currency: 'CLP',
        source: 'tufarmacia.gob.cl (MINSAL)',
        referential: true,
      },
    });
  });

  it('parsea respuesta JSON de Tufarmacia (envuelta en resultados)', () => {
    const body = JSON.stringify({
      resultados: [{ producto: 'Amoxicilina 500 mg', precio_promedio: 2890 }],
    });
    const entries = parseTufarmaciaJson(body, '2026-06-10T00:00:00.000Z');
    expect(entries).toHaveLength(1);
    expect(entries[0]!.price.amountClp).toBe(2890);
  });

  it('tolera JSON inválido sin lanzar', () => {
    expect(parseTufarmaciaJson('<html>error</html>', '2026-06-10T00:00:00.000Z')).toEqual([]);
  });

  it('parsea CSV CENABAST con separador ;', () => {
    const csv = ['Producto;Precio Unitario', 'Paracetamol 500 mg comprimido;45', ';'].join('\n');
    const entries = parseCenabastCsv(csv, '2026-06-10T00:00:00.000Z');
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      productName: 'Paracetamol 500 mg comprimido',
      price: { amountClp: 45, source: 'CENABAST', referential: true },
    });
  });
});
