# TODO --- Reboot Lab: Mail ↔ Nextcloud Deck PoC

## Estado actual

-   [x] Formulario Astro funcionando en producción.
-   [x] `/api/contact` con Astro SSR + Node.
-   [x] Envío mediante Resend.
-   [x] Secretos cargados en runtime con `.env` + `process.env`.
-   [x] Docker desplegado en VPS.
-   [x] Email recibido en Gmail y visible en Nextcloud Mail.
-   [x] Nextcloud funcionando actualmente en Docker en el Mac mini.

## Fase 1 --- Conectar Nextcloud Deck

-   [x] Comprobar si Deck está instalado.
-   [x] Instalar/habilitar Deck si hace falta.
-   [x] Crear board `Reboot Requests`.
-   [x] Crear stack inicial `New`.
-   [x] Identificar `boardId` y `stackId`.
-   [x] Preparar autenticación segura para la API.
-   [x] Crear manualmente una tarjeta mediante la API.
-   [x] No guardar credenciales de Nextcloud en Git.

## Fase 2 --- Astro → Deck

-   [ ] Crear un servicio/módulo de Nextcloud separado de `contact.ts`.
-   [ ] Añadir configuración necesaria al `.env`.
-   [ ] Hacer que `/api/contact` cree una tarjeta.
-   [ ] Título inicial: `Anfrage: {name}`.
-   [ ] Descripción inicial: email + mensaje.
-   [ ] Manejar un fallo de Deck sin perder un email ya enviado.
-   [ ] Probar localmente.
-   [ ] Probar desde Reboot Production.

## Fase 3 --- Request-ID

-   [ ] Generar un `Request-ID` único por solicitud.
-   [ ] Incluirlo en el email.
-   [ ] Incluirlo en la tarjeta Deck.
-   [ ] Usarlo como relación estable Mail ↔ Deck.
-   [ ] Verificar que una solicitud pueda localizarse en ambos sistemas.

## Fase 4 --- Message-ID y Nextcloud Mail

-   [ ] Investigar el `Message-ID` que podemos obtener o controlar.
-   [ ] Diferenciar Request-ID, ID del proveedor y RFC Message-ID.
-   [ ] Investigar cómo Nextcloud Mail identifica
    mensajes/conversaciones.
-   [ ] Estudiar la URL de un correo real abierto en Nextcloud Mail.
-   [ ] Determinar si existe un permalink estable.
-   [ ] Comprobar si podemos generarlo desde el backend.
-   [ ] Si no es estable, mantener Request-ID como relación principal.
-   [ ] Añadir Message-ID/mail link a Deck si resulta viable.

## Fase 5 --- Topics y routing

-   [ ] Definir topics: General, Support, Sales, HR, etc.
-   [ ] Validarlos en backend.
-   [ ] Asociar cada topic con su destinatario.
-   [ ] Enviar al destinatario correspondiente.
-   [ ] Crear labels equivalentes en Deck.
-   [ ] Asignar automáticamente el label.
-   [ ] Título final: `Anfrage: {topic}, {name}`.

## Fase 6 --- Templates

-   [ ] Separar templates del endpoint.
-   [ ] Template de correo interno.
-   [ ] Template de confirmación al cliente.
-   [ ] Decidir después repo vs Decap CMS.
-   [ ] Verificar dominio/remitente propio antes de depender de
    confirmaciones reales.

## Fase 7 --- Robustez y seguridad

-   [ ] Añadir rate limiting y/o anti-spam.
-   [ ] Mantener honeypot.
-   [ ] Validar todo en servidor.
-   [ ] Revisar datos personales guardados en Deck.
-   [ ] No exponer secretos en logs, Git o imágenes Docker.
-   [ ] Mejorar logs y manejo de errores.
-   [ ] Definir qué ocurre si Mail funciona pero Deck falla, o
    viceversa.
-   [ ] Evitar tarjetas duplicadas en reintentos.

## Fase 8 --- Nextcloud siempre disponible

-   [ ] Cuando el PoC funcione, planificar Nextcloud permanente.
-   [ ] Dominio/subdominio + HTTPS.
-   [ ] Almacenamiento persistente.
-   [ ] Backups.
-   [ ] Actualizaciones y recuperación.
-   [ ] Migración/pruebas.
-   [ ] Confirmar acceso estable desde Internet a Mail y Deck.

## Fase 9 --- Demo completa

-   [ ] Abrir Reboot Lab en producción.
-   [ ] Enviar una solicitud.
-   [ ] Mostrar email en Nextcloud Mail.
-   [ ] Mostrar tarjeta creada automáticamente en Deck.
-   [ ] Mostrar Request-ID.
-   [ ] Mostrar Message-ID/enlace si es viable.
-   [ ] Documentar el diagrama final.

## Fase 10 --- Proyecto de Dani (Next.js/React)

-   [ ] Trasladar la arquitectura, no copiar Astro literalmente.
-   [ ] Empezar con formulario genérico de contacto.
-   [ ] Implementar backend en Next.js.
-   [ ] Mantener Mail Service y Deck Service desacoplados.
-   [ ] Decidir con Dani el mecanismo/proveedor de email; no asumir
    Resend.
-   [ ] Integrar Deck.
-   [ ] Incorporar la estrategia Request-ID / Mail ↔ Deck validada.
-   [ ] Añadir topics/routing.
-   [ ] Añadir templates definitivos.
-   [ ] Pruebas end-to-end antes del despliegue.

## Próximo paso inmediato

Comprobar Deck en el Nextcloud actual:

``` bash
docker exec --user www-data nextcloud-aio-nextcloud php occ app:list | grep -i deck
```

Primer objetivo: **crear una tarjeta de prueba en Deck mediante su
API**. Todavía no necesitamos Message-ID, topics ni enlaces a Mail.
