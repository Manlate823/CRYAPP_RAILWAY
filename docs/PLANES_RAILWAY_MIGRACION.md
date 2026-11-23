# CryApp Railway — planes y migración segura

> Alcance: **solo** `Manlate823/CRYAPP_RAILWAY`. No modificar `CryApp_Truenas_Scarlet` ni TrueNAS. Este documento no ejecuta ninguna migración.

## Planes aprobados

| Plan | Mensual USD | Anual USD | Registros |
| --- | ---: | ---: | --- |
| GRATIS | 0 | 0 | 25 visibles |
| PRO | 12.99 | 129 | Ilimitados |
| CRIADERO | 24.99 | 249 | Ilimitados |

- Toda cuenta **nueva** obtiene 30 días de prueba con todas las capacidades, sin tarjeta.
- Al finalizar la prueba, sin suscripción pagada activa, se aplica GRATIS.
- No se eliminan ejemplares, fotos, genealogías, pagos ni historial por vencimiento o cancelación.
- En GRATIS se muestran hasta 25 ejemplares y el total de ocultos; los restantes continúan almacenados.
- Marketplace básico y chat siguen accesibles en GRATIS.
- PRO incluye árbol, pedigrí, consanguinidad, cruces, efectividad, estadísticas, PDF, exportación y respaldo.
- CRIADERO incluye PRO, más usuarios y roles, múltiples criaderos, administración avanzada y soporte prioritario.
- Los servicios promocionales del Marketplace se facturan por separado.

## Compatibilidad con datos existentes

La API actual utiliza `free`, `pro` y `premium`, y guarda suscripciones en `cryapp_user_subscriptions`; los pagos usan `cryapp_payment_requests`. **No renombrar ni eliminar** identificadores o filas existentes de forma destructiva. Crear una tabla de equivalencias o migración explícita y verificable. Para suscripciones antiguas `premium`, mantener el acceso contratado hasta su vencimiento; no convertirlas a GRATIS por un cambio de etiqueta.

## Implementación pendiente (antes de producción)

1. Obtener y verificar respaldo independiente de **PostgreSQL Railway** y de fotografías/volúmenes Railway. Confirmar restauración de prueba, número de usuarios, ejemplares y suscripciones. No utilizar TrueNAS como fuente de escritura.
2. Auditar el esquema real de Railway y los flujos de aprobación de pagos; agregar migración idempotente y reversible para ciclos mensual/anual, prueba de 30 días y niveles.
3. Calcular el plan efectivo en backend usando suscripción pagada vigente y prueba vigente; impedir que usuarios existentes reciban pruebas retroactivas o repetidas sin decisión explícita.
4. Limitar en backend la lista y la consulta individual de ejemplares en GRATIS. Aplicar orden estable y consistente a los 25 visibles, y proteger fotos, ancestros, cruces, exportaciones y módulos que podrían revelar ejemplares ocultos.
5. Bloquear la creación del ejemplar 26 para GRATIS de forma transaccional, sin borrar los existentes; definir si se permite editar o eliminar registros visibles.
6. Mantener marketplace y chat básicos disponibles sin suscripción, con autorización de usuario en cada operación.
7. Actualizar interfaz y administración de planes, solicitudes de pago, vencimientos y textos de prueba. No afirmar «respaldo en la nube» hasta verificar que el almacenamiento persistente y copias estén configurados.
8. Probar casos: 0, 24, 25, 26 y 132 ejemplares; cancelación, expiración, renovación, suscripción heredada, intentos de acceso por API, usuarios existentes y fotos.
9. Revisar y aprobar PR antes de fusionar a `main`; desplegar Railway solo tras respaldo y pruebas.

## Riesgos detectados en el código actual

- `backend/server.js` bloquea **todos** los ejemplares y módulos para GRATIS; contradice los nuevos requisitos.
- `backend/ejemplares.js` devuelve todos los registros del usuario; la nueva política requiere control de visibilidad en servidor.
- `backend/subscriptions.js` solo admite solicitudes `pro`/`premium` y consulta precios en la base de datos; necesita migración coordinada con los planes.
- `web/js/app.js` muestra barreras de pago con los niveles anteriores; debe alinearse con backend.
- Los endpoints de fotos y módulos deben revisarse para evitar accesos indirectos a registros ocultos.

**Estado:** especificación de trabajo; no es una implementación funcional ni un despliegue.
