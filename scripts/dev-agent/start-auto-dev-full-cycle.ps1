# EPIS2 - Ciclo completo de desarrollo (OpenClaw + Ollama + Evolab)
# Uso: .\scripts\dev-agent\start-auto-dev-full-cycle.ps1
#      .\scripts\dev-agent\start-auto-dev-full-cycle.ps1 -NoPush -DryRun

param(
  [switch]$DryRun,
  [switch]$NoPush,
  [switch]$Push,
  [switch]$Sequential,
  [int]$Hours = 6
)

$ErrorActionPreference = "Stop"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $Root

$ollamaBase = if ($env:OLLAMA_BASE_URL) { $env:OLLAMA_BASE_URL } else { "http://127.0.0.1:11434" }

$env:EPIS2_AUTO_DEV_AUTHORIZED = "1"
$env:EPIS2_AUTO_DEV_OPENCLAW = "1"
$env:EPIS2_AUTO_DEV_EVOLAB = "1"
$env:EPIS2_AUTO_DEV_OLLAMA = "1"
$env:EPIS2_AUTO_DEV_PARALLEL = if ($Sequential) { "0" } else { "1" }
$env:EPIS2_AUTO_DEV_DURATION_HOURS = "$Hours"
$env:EPIS2_AUTO_DEV_TRAMO_PAUSE_MS = "120000"
$env:EPIS2_AUTO_DEV_OLLAMA_APPLY = "0"
$env:EPIS2_AUTO_DEV_CURSOR_SDK = "1"
$env:EPIS2_AUTO_DEV_RESUME = "1"
$env:EPIS2_EVOLAB_PATCHING_ENABLED = "false"
$env:EPIS2_EVOLAB_REQUIRE_HUMAN_APPROVAL = "true"
$env:EPIS2_EVOLAB_LLM_CONCURRENCY = "1"
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

$modeLabel = if ($Sequential) { "secuencial (orchestrate)" } else { "paralelo (PM-03 evolve)" }

Write-Host "EPIS2 - ciclo dev completo (OpenClaw + Ollama + Evolab)" -ForegroundColor Cyan
Write-Host "  Repo: $Root"
Write-Host "  Ollama: $ollamaBase"
Write-Host "  Modo: $modeLabel"
Write-Host "  OpenClaw: L3 MAX POWER - orquesta brief/handoff/verify" -ForegroundColor Green
if ($env:EPIS2_EVOLAB_ROOT) {
  Write-Host "  Evolab: $($env:EPIS2_EVOLAB_ROOT)" -ForegroundColor Green
} else {
  Write-Host "  Evolab: no configurado - requiere clone epis2-evolab" -ForegroundColor Red
  exit 1
}

$cycleArgs = @("run", "dev:auto:cycle", "--", "--commit", "--continue-on-fail")
if ($Push -and -not $NoPush) { $cycleArgs += "--push" }
if ($DryRun) { $cycleArgs += "--dry-run" }
if (-not $Sequential) { $cycleArgs += "--parallel" }

npm @cycleArgs
exit $LASTEXITCODE
