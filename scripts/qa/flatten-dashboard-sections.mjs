import fs from 'node:fs';

const files = [
  'apps/web/src/components/NursingDashboardTab.tsx',
  'apps/web/src/components/ServiceDashboardTab.tsx',
  'apps/web/src/components/PharmacyDashboardTab.tsx',
  'apps/web/src/components/PatientDashboardTab.tsx',
  'apps/web/src/components/EmergencyDashboardTab.tsx',
  'apps/web/src/components/ReceptionDashboardTab.tsx',
  'apps/web/src/components/ApsDashboardTab.tsx',
  'apps/web/src/components/OrDashboardTab.tsx',
  'apps/web/src/components/SpecialtyDashboardTab.tsx',
  'apps/web/src/components/QualityDashboardTab.tsx',
];

function transform(content) {
  let out = content.replace(
    /<Paper variant="outlined" sx=\{\{ p: 2 \}\}(?: data-testid="([^"]+)")?>\s*\n\s*<Typography variant="subtitle2" gutterBottom>\s*\n\s*\{([^}]+)\}\s*\n\s*<\/Typography>/g,
    (_, testId, title) =>
      testId
        ? `<EpisWorkspaceSection title={${title}} testId="${testId}">`
        : `<EpisWorkspaceSection title={${title}}>`,
  );
  out = out.replace(/<\/Paper>/g, '</EpisWorkspaceSection>');
  out = out.replace(/ {2}Paper,\n/g, '');
  out = out.replace(/Paper,\n/g, '');
  out = out.replace(/, Paper/g, '');
  out = out.replace(/Paper, /g, '');

  if (out.includes('EpisWorkspaceSection') && !out.includes('EpisWorkspaceSection,')) {
    out = out.replace(/import \{([^}]+)\} from '@epis2\/epis2-ui';/, (match, imports) =>
      imports.includes('EpisWorkspaceSection')
        ? match
        : `import { EpisWorkspaceSection, ${imports.trim()} } from '@epis2/epis2-ui';`,
    );
  }
  return out;
}

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const next = transform(content);
  if (next.includes('Paper variant')) {
    console.warn(`${file}: still contains Paper variant="outlined"`);
  }
  fs.writeFileSync(file, next);
  console.log(`OK ${file}`);
}
