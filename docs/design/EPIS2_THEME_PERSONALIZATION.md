# EPIS2 — Personalización visual (plan)

**Estado THEME-03:** UI de preferencias en `/preferencias-apariencia` + panel reutilizable. Modo «sistema» y catálogo visual dedicado: ramas futuras.

## Permitido (futuro)

| Preferencia | Valores |
|-------------|---------|
| Tema | Clinical Blue, Calm Teal |
| Modo | claro, oscuro, sistema |
| Densidad | cómoda, compacta |
| Contraste | estándar, alto |
| Movimiento | estándar, reducido |

## Prohibido

- Cambiar colores críticos, aprobación, safety bar.
- Ocultar alertas clínicas.
- Paletas libres de usuario.

## Almacenamiento

`localStorage` `epis2-theme-preferences-v2` — separado de datos clínicos PostgreSQL.
