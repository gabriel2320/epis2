# EPIS2 — arranque entorno dev local (Windows)
# Uso: .\scripts\stack-dev.ps1
#      npm run stack:dev

$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
npm run stack:dev @args
