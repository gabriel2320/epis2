/**
 * EPIS2 desktop packager without new npm dependencies.
 *
 * Creates dist/desktop/windows launchers and, on Windows with iexpress.exe,
 * optionally builds a lightweight EPIS2.exe that starts the local dev stack.
 */
import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const outDir = join(root, 'dist/desktop/windows');
const iconSource = join(root, 'assets/desktop/e2-icon.svg');
const iconOut = join(outDir, 'e2-icon.svg');
const ps1Out = join(outDir, 'EPIS2.ps1');
const cmdOut = join(outDir, 'EPIS2.cmd');
const sedOut = join(outDir, 'EPIS2.iexpress.sed');
const exeOut = join(outDir, 'EPIS2.exe');
const buildExe = process.argv.includes('--exe');

function quotePowerShell(value) {
  return `'${value.replace(/'/g, "''")}'`;
}

mkdirSync(outDir, { recursive: true });
copyFileSync(iconSource, iconOut);

writeFileSync(
  ps1Out,
  `param(
  [string]$Url = "http://127.0.0.1:5173"
)

$RepoRoot = ${quotePowerShell(root)}
if (-not (Test-Path (Join-Path $RepoRoot "package.json"))) {
  Write-Error "No se encontro package.json en $RepoRoot"
  exit 1
}

Set-Location $RepoRoot
Write-Host "EPIS2 - iniciando stack local desde $RepoRoot"
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-ExecutionPolicy", "Bypass",
  "-Command", "Set-Location ${quotePowerShell(root)}; npm run stack:dev"
)
Start-Sleep -Seconds 6
Start-Process $Url
`,
);

writeFileSync(
  cmdOut,
  `@echo off
setlocal
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0EPIS2.ps1"
`,
);

writeFileSync(
  sedOut,
  `[Version]
Class=IEXPRESS
SEDVersion=3
[Options]
PackagePurpose=InstallApp
ShowInstallProgramWindow=0
HideExtractAnimation=1
UseLongFileName=1
InsideCompressed=0
CAB_FixedSize=0
CAB_ResvCodeSigning=0
RebootMode=N
InstallPrompt=
DisplayLicense=
FinishMessage=
TargetName=${exeOut}
FriendlyName=EPIS2
AppLaunched=EPIS2.cmd
PostInstallCmd=<None>
AdminQuietInstCmd=EPIS2.cmd
UserQuietInstCmd=EPIS2.cmd
SourceFiles=SourceFiles
[SourceFiles]
SourceFiles0=${outDir}
[SourceFiles0]
EPIS2.cmd=
EPIS2.ps1=
e2-icon.svg=
`,
);

if (buildExe) {
  if (process.platform !== 'win32') {
    console.error('EPIS2.exe solo se construye en Windows con iexpress.exe');
    process.exit(1);
  }
  const result = spawnSync('iexpress.exe', ['/N', '/Q', sedOut], {
    cwd: outDir,
    stdio: 'inherit',
    shell: false,
  });
  if (result.status !== 0 || !existsSync(exeOut)) {
    console.error('No se pudo crear EPIS2.exe con iexpress.exe');
    process.exit(result.status ?? 1);
  }
}

console.log(`EPIS2 desktop package listo: ${outDir}`);
if (buildExe) console.log(`EPIS2.exe: ${exeOut}`);
