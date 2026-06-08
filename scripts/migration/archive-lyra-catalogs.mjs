#!/usr/bin/env node
/**
 * Limpia y archiva catálogos Lyra (export Tesser) como referencia en migration/candidates.
 * No importa a runtime EPIS2. Ejecutar tras actualizar el export externo.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');

const DEFAULT_SOURCE =
  process.env.LYRA_EXPORT_DIR ??
  path.resolve(
    REPO_ROOT,
    '../clone/Tesser-export-20260528/Tesser/lyra-clinical-extractor/imports/libraries/lyra',
  );

const OUT_DIR = path.resolve(
  REPO_ROOT,
  'migration/candidates/lyra/lyra-clinical-catalogs-export/clean',
);

const EXCLUDED_UI = new Set([
  'plantillas-compartidas-html.html',
  'plantillas-graficos-html.html',
  'plantillas-propuestas-html.html',
  'habitos-modal.html',
  'alergias-modal.html',
]);

function sha256(text) {
  return createHash('sha256').update(text).digest('hex');
}

function slimMedicamento(row) {
  return {
    codigo: row.CodigoMedicamento,
    nombre: row.NombreMedicamento?.trim() ?? '',
    laboratorio: row.Laboratorio ?? null,
    composicion: row.Composicion ?? null,
    recetaRetenida: row.RecetaRetenida ?? null,
  };
}

function slimDiagnostico(row) {
  return {
    codigo: row.Codigo?.trim() ?? '',
    descripcion: row.Descripcion?.trim() ?? '',
    ges: Boolean(row.DiagnosticoGES),
    favorito: Boolean(row.Favorito),
  };
}

function slimEspecialidad(row) {
  return {
    codigo: row.Codigo,
    descripcion: row.Descripcion?.trim() ?? '',
  };
}

function slimExamen(row) {
  return {
    codPrestacion: row.CodPrestacion,
    nombre: row.NombrePrestacion?.trim() ?? '',
    grupo: row.NombreGrupo?.trim() ?? null,
    tipoExamen: row.RceTipoExamen ?? null,
  };
}

function slimInterconsulta(row) {
  return {
    codigo: row.Codigo,
    nombre: row.Nombre?.trim() ?? '',
  };
}

function slimIsapre(row) {
  return {
    codigo: row.Codigo ?? row.codigo,
    nombre: row.Nombre ?? row.Descripcion ?? row.nombre,
  };
}

function slimGenerico(row, keys) {
  const out = {};
  for (const [src, dst] of keys) {
    if (row[src] !== undefined && row[src] !== null && row[src] !== '') {
      out[dst] = row[src];
    }
  }
  return out;
}

const SLIMMERS = {
  'medicamentos-vademecum.json': (rows) => rows.map(slimMedicamento),
  'medicamentos-frecuentes-capture.json': (rows) =>
    rows
      .filter((r) => r.CodigoMedicamento && r.NombreMedicamento)
      .map((r) => slimMedicamento(r)),
  'diagnosticos-cie10.json': (rows) => rows.map(slimDiagnostico),
  'diagnosticos-favoritos.json': (rows) => rows.map(slimDiagnostico),
  'especialidades.json': (rows) => rows.map(slimEspecialidad),
  'examenes-plantilla-lab-capture.json': (rows) => rows.map(slimExamen),
  'examenes-plantilla-rad-capture.json': (rows) => rows.map(slimExamen),
  'interconsultas-frecuentes-capture.json': (rows) => rows.map(slimInterconsulta),
  'certificados-plantillas-capture.json': (rows) =>
    rows.map((r) =>
      slimGenerico(r, [
        ['Codigo', 'codigo'],
        ['Nombre', 'nombre'],
        ['Descripcion', 'descripcion'],
      ]),
    ),
  'habitos-capture.json': (rows) =>
    rows.map((r) =>
      slimGenerico(r, [
        ['Codigo', 'codigo'],
        ['Nombre', 'nombre'],
        ['Descripcion', 'descripcion'],
      ]),
    ),
  'consentimientos-frecuentes-capture.json': (rows) =>
    rows.map((r) =>
      slimGenerico(r, [
        ['Codigo', 'codigo'],
        ['Nombre', 'nombre'],
      ]),
    ),
  'isapres.json': (rows) => rows.map(slimIsapre).filter((r) => r.nombre),
};

async function main() {
  const sourceDir = path.resolve(DEFAULT_SOURCE);
  await mkdir(OUT_DIR, { recursive: true });

  const entries = await readdir(sourceDir, { withFileTypes: true });
  const manifest = {
    archivedAt: new Date().toISOString(),
    sourceDir,
    phi: false,
    note: 'Referencia curada — no runtime. Campos Lyra UI eliminados.',
    included: {},
    excludedEmpty: [],
    excludedUi: [...EXCLUDED_UI],
  };

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const name = ent.name;
    if (EXCLUDED_UI.has(name)) continue;
    if (!name.endsWith('.json')) continue;
    if (name === 'manifest.json') continue;

    const raw = await readFile(path.join(sourceDir, name), 'utf8');
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      manifest.excludedEmpty.push({ file: name, reason: 'invalid-json' });
      continue;
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      manifest.excludedEmpty.push({ file: name, reason: 'empty-array' });
      continue;
    }

    const slimmer = SLIMMERS[name];
    const cleaned = slimmer ? slimmer(parsed) : parsed;
    const body = `${JSON.stringify(cleaned, null, 2)}\n`;
    const outName = name.replace('.json', '.clean.json');
    await writeFile(path.join(OUT_DIR, outName), body, 'utf8');

    manifest.included[outName] = {
      sourceFile: name,
      count: cleaned.length,
      sha256: sha256(body),
      bytes: Buffer.byteLength(body, 'utf8'),
    };
  }

  const manifestBody = `${JSON.stringify(manifest, null, 2)}\n`;
  await writeFile(path.join(OUT_DIR, 'manifest.json'), manifestBody, 'utf8');

  console.log(`Lyra catalogs archived → ${OUT_DIR}`);
  console.log(`Included: ${Object.keys(manifest.included).length} files`);
  console.log(`Excluded empty: ${manifest.excludedEmpty.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
