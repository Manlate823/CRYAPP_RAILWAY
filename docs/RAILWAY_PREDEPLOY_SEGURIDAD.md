# Lista de verificación antes de publicar CryApp Railway

## Estado actual
- Stripe: pospuesto por decisión del propietario. No hay claves ni cobros configurados.
- Prueba de 30 días: registro transaccional y cálculo de plan implementados en rama de desarrollo.
- **Bloqueante:** ejecutar la migración `backend/migrations/20261123_railway_subscription_trials.sql` en Railway **solo después** de respaldar y verificar PostgreSQL. El registro de nuevas cuentas depende de esta tabla.
- **Bloqueante de privacidad:** `GET /api/fotos/:archivo` en `backend/server.js` entrega fotos sin autenticación. No se ha cambiado todavía para evitar romper las etiquetas `<img>` de la web, que no envían Bearer automáticamente.
- **Bloqueante de privacidad:** revisar `/api/auth/backup`, genealogías, mercado y cualquier acceso indirecto a ejemplares ocultos; una limitación de 25 fichas en `/api/ejemplares` no protege otras rutas.
- **Bloqueante de despliegue:** verificar respaldo de base de datos y volumen de fotos de Railway, CI y prueba funcional de registro, login, planes y carga de imágenes.

## Diseño pendiente de fotografías
1. Auditar todas las referencias a `/api/fotos/` en la web y API.
2. Sustituir URLs públicas por una vía autenticada y autorizada por usuario/ejemplar, con una solución compatible con `<img>` (por ejemplo, solicitud autenticada + Blob URL temporal en el cliente).
3. Autorizar por pertenencia del ejemplar, visibilidad del plan y permisos de publicación explícitos; fotos de marketplace requieren política separada.
4. Eliminar cacheo público de fotografías privadas; invalidar URLs temporales cuando corresponda.
5. Probar en móvil, miniaturas, certificados y galería antes de activar el cambio.

## Seguridad de publicación
- No modificar `Manlate823/CryApp_Truenas_Scarlet` ni el TrueNAS original.
- No fusionar la PR ni desplegar a producción hasta cerrar los bloqueantes.
- No almacenar secretos de Stripe, JWT ni PostgreSQL en GitHub.
