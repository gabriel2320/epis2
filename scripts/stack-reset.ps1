# EPIS2 — reset Postgres local (Windows)
# Uso: .\scripts\stack-reset.ps1
Set-Location (Join-Path $PSScriptRoot '..')
npm run stack:reset
