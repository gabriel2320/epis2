# EPIS2 — Arranque autodesarrollo 6 h (PM-03)
# Uso: .\scripts\dev-agent\start-auto-dev-6h.ps1
#      .\scripts\dev-agent\start-auto-dev-6h.ps1 -DryRun

param(
  [switch]$DryRun,
  [switch]$NoPush,
  [int]$Hours = 6
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $Root

$ollamaBase = if ($env:OLLAMA_BASE_URL) { $env:OLLAMA_BASE_URL } else { "http://127.0.0.1:11434" }

$env:EPIS2_AUTO_DEV_AUTHORIZED = "1"
$env:EPIS2_AUTO_DEV_DURATION_HOURS = "$Hours"
$env:EPIS2_AUTO_DEV_TRAMO_PAUSE_MS = "120000"
$env:EPIS2_AUTO_DEV_OLLAMA = "1"
$env:EPIS2_AUTO_DEV_OLLAMA_APPLY = "0"
$env:EPIS2_AUTO_DEV_CURSOR_SDK = "1"
$env:EPIS2_AUTO_DEV_RESUME = "1"
$env:EPIS2_AUTO_DEV_OPENCLAW = "1"
$env:EPIS2_OPENCLAW_SESSION = "1"
$env:EPIS2_OPENCLAW_MAX_POWER = "1"
$env:EPIS2_OPENCLAW_POWER_LEVEL = "L3"
$env:EPIS2_OPENCLAW_PATCHING_ENABLED = "true"
$env:EPIS2_OPENCLAW_SAFE_RUN = "true"
$env:EPIS2_OPENCLAW_AUTHORIZE_CONDITIONAL = "true"
$env:EPIS2_OPENCLAW_AUTHORIZE_CODE = "true"
$env:EPIS2_OPENCLAW_REQUIRE_HUMAN_APPROVAL = "true"
$env:EPIS2_OPENCLAW_GIT_WRITE = "false"
$env:EPIS2_OPENCLAW_READ_ENV = "false"

$siblingEvolab = Join-Path (Split-Path $Root -Parent) "epis2-evolab"
if (-not $env:EPIS2_EVOLAB_ROOT -and (Test-Path (Join-Path $siblingEvolab "package.json"))) {
  $env:EPIS2_EVOLAB_ROOT = $siblingEvolab
}

Write-Host "EPIS2 PM-03 — autodesarrollo ${Hours}h" -ForegroundColor Cyan
Write-Host "  Repo: $Root"
Write-Host "  Ollama: $ollamaBase"
if ($env:CURSOR_API_KEY) {
  Write-Host "  Cursor SDK: API key presente" -ForegroundColor Green
} else {
  Write-Host "  Cursor SDK: cola IDE (sin CURSOR_API_KEY)" -ForegroundColor Yellow
}
if ($env:EPIS2_EVOLAB_ROOT) {
  Write-Host "  Evolab: $($env:EPIS2_EVOLAB_ROOT)" -ForegroundColor Green
} else {
  Write-Host "  Evolab: no configurado (EPIS2_AUTO_DEV_EVOLAB=1 requiere clone)" -ForegroundColor DarkGray
}
Write-Host "  OpenClaw: MAX POWER L3 (patch L0/L1 + safe-run L4 breadth)" -ForegroundColor Green

npm run dev:auto:preconditions
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$orchArgs = @("run", "dev:auto:orchestrate", "--", "--commit")
if (-not $NoPush) { $orchArgs += "--push" }
if ($DryRun) { $orchArgs += "--dry-run" }

npm @orchArgs
exit $LASTEXITCODE
