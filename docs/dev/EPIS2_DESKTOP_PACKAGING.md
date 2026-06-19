# EPIS2 - Empaquetado desktop local

EPIS2 evita Electron/Tauri por ahora para no inflar dependencias. El empaquetado Windows usa solo Node y `iexpress.exe` del sistema.

## Icono

Asset canonico: `assets/desktop/e2-icon.svg`.

## Generar launcher

```bash
node scripts/desktop/package-windows.mjs
```

Salida:

```text
dist/desktop/windows/EPIS2.cmd
dist/desktop/windows/EPIS2.ps1
dist/desktop/windows/e2-icon.svg
```

## Generar exe Windows

```bash
node scripts/desktop/package-windows.mjs --exe
```

Salida esperada:

```text
dist/desktop/windows/EPIS2.exe
```

El ejecutable inicia `npm run stack:dev` en una consola local y abre `http://127.0.0.1:5173`. Es un launcher de demo local, no un instalador productivo ni un runtime clinico standalone.
