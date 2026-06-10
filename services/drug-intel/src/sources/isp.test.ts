import { describe, expect, it } from 'vitest';
import { parseIspAlertsHtml, parseIspDatasetCsv, parseIspSearchHtml } from './isp.js';

const SEARCH_HTML_FIXTURE = `
<table id="resultados">
  <tr><th>Registro</th><th>Nombre</th><th>Titular</th><th>Estado</th><th>Condición de venta</th></tr>
  <tr>
    <td>F-12345/20</td>
    <td>LOSART&Aacute;N POT&Aacute;SICO 50 mg COMPRIMIDOS</td>
    <td>Laboratorio Chile S.A.</td>
    <td>Vigente</td>
    <td>Receta M&eacute;dica</td>
  </tr>
  <tr>
    <td>F-9876/21</td>
    <td>AMOXICILINA 500 mg C&Aacute;PSULAS</td>
    <td>Lab Demo</td>
    <td>Vigente</td>
    <td>Receta M&eacute;dica</td>
  </tr>
  <tr><td colspan="5">Sin más resultados</td></tr>
</table>`;

const DATASET_CSV_FIXTURE = [
  'Registro;Nombre Producto;Principio Activo;Forma Farmaceutica;Condicion Venta;Estado;Titular;Tipo Producto',
  'F-12345/20;LOSARTAN POTASICO 50 MG;Losartán potásico;Comprimido recubierto;Receta médica;Vigente;Laboratorio Chile;Medicamento',
  'F-2222/19;ARNICA 30 CH;Arnica montana;Glóbulos;Venta directa;Vigente;Lab Homeo;Medicamento Homeopático',
  ';SIN REGISTRO;;;;;;',
].join('\n');

const ALERTS_HTML_FIXTURE = `
<div class="alertas">
  <span>10/05/2026</span>
  <a href="https://www.ispch.cl/alerta/losartan-lote">Alerta de seguridad: retiro voluntario de lote de Losartán 50 mg</a>
  <a href="/contacto">Contacto</a>
  <a href="https://www.ispch.cl/alerta/ranitidina">Suspensión de distribución de productos con ranitidina</a>
</div>`;

describe('drug-intel fuente ISP', () => {
  it('parsea la tabla HTML del buscador de registro sanitario', () => {
    const products = parseIspSearchHtml(SEARCH_HTML_FIXTURE);
    expect(products).toHaveLength(2);
    expect(products[0]).toMatchObject({
      registryId: 'F-12345/20',
      name: 'LOSARTÁN POTÁSICO 50 mg COMPRIMIDOS',
      holder: 'Laboratorio Chile S.A.',
      status: 'Vigente',
      saleCondition: 'Receta Médica',
    });
  });

  it('parsea dataset CSV con separador ; y conserva tipo de producto', () => {
    const products = parseIspDatasetCsv(DATASET_CSV_FIXTURE);
    expect(products).toHaveLength(2);
    expect(products[0]).toMatchObject({
      registryId: 'F-12345/20',
      name: 'LOSARTAN POTASICO 50 MG',
      activeIngredient: 'Losartán potásico',
      pharmaceuticalForm: 'Comprimido recubierto',
      saleCondition: 'Receta médica',
      sourceCategory: 'Medicamento',
    });
    expect(products[1]!.sourceCategory).toBe('Medicamento Homeopático');
  });

  it('descarta filas sin registro o sin nombre', () => {
    const products = parseIspDatasetCsv(DATASET_CSV_FIXTURE);
    expect(products.some((p) => p.name === 'SIN REGISTRO')).toBe(false);
  });

  it('parsea alertas de medicamentos y descarta links no relacionados', () => {
    const alerts = parseIspAlertsHtml(ALERTS_HTML_FIXTURE);
    expect(alerts).toHaveLength(2);
    expect(alerts[0]!.title).toContain('Losartán');
    expect(alerts[0]!.url).toBe('https://www.ispch.cl/alerta/losartan-lote');
    expect(alerts[0]!.publishedAt).toBe('10/05/2026');
  });
});
