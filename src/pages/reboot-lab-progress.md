# Reboot Lab — Estado actual del proyecto

Documento de seguimiento técnico del laboratorio **Reboot Lab** con lo implementado y validado hasta ahora.

## Aplicación y formulario

- [x] Proyecto Astro funcionando en modo server con Node.js.
- [x] Formulario de contacto y endpoint `/api/contact` funcionando.
- [x] Validación con Zod.
- [x] Honeypot anti-bot mediante el campo `website`.
- [x] Topics con `label` visible y `value` técnico estable.
- [x] Producción disponible en `https://reboot.yampe.dev`.
- [x] Formulario disponible en `https://reboot.yampe.dev/contact/`.

Topics actuales:

```text
product
pc_repair
it_support
web_development
consulting
shipping
warranty
returns
other
```

## Request-ID

- [x] Request-ID generado para cada solicitud válida con `crypto.randomUUID()`.
- [x] Formato `REQ-<UUID>`.
- [x] Request-ID incluido en logs.
- [x] Request-ID incluido en el email interno.
- [x] Request-ID incluido en la Card de Nextcloud Deck.
- [x] Correlación Mail ↔ Deck validada con el mismo Request-ID.

```text
Contact Request
      ↓
  Request-ID
      ├── Logs
      ├── Email
      └── Deck Card
```

## Resend y dominio de envío

- [x] Resend integrado.
- [x] API Key mediante variable de entorno.
- [x] Email interno funcionando.
- [x] Confirmación automática al cliente funcionando.
- [x] `replyTo` configurado con el email del cliente.
- [x] Subdominio `send.yampe.dev` verificado en Resend.
- [x] DKIM configurado.
- [x] SPF configurado.
- [x] DMARC configurado.
- [x] Remitente `Reboot Lab <contact@send.yampe.dev>` funcionando.
- [x] Envío a múltiples destinatarios validado.

Los DNS autoritativos de `yampe.dev` están gestionados en Hostinger:

```text
ns1.dns-parking.com
ns2.dns-parking.com
```

## Routing por departamentos

Configuración en:

```text
src/config/contactRouting.ts
```

Variables utilizadas:

```text
CONTACT_EMAIL
CONTACT_EMAIL_TECHNICAL
CONTACT_EMAIL_SALES
```

`CONTACT_EMAIL` representa al administrador.

Mapping actual:

```text
product          → sales
pc_repair        → technical
it_support       → technical
web_development  → technical
consulting       → sales
shipping         → sales
warranty         → sales
returns          → sales
other            → sales
```

- [x] Admin recibe siempre la solicitud.
- [x] Technical recibe únicamente Topics técnicos.
- [x] Sales recibe únicamente Topics de ventas/atención.
- [x] `Set` elimina destinatarios duplicados.

### Prueba Technical

Con `web_development`:

- [x] Admin recibió el correo.
- [x] Technical recibió el correo.
- [x] Sales no recibió el correo.
- [x] Deck Card creada.
- [x] Request-ID coincidente en Mail y Deck.

### Prueba Sales

Con un Topic de Sales:

- [x] Admin recibió el correo.
- [x] Sales recibió el correo.
- [x] Technical no recibió el correo.
- [x] Deck Card creada.
- [x] Request-ID coincidente en Mail y Deck.

## Nextcloud

Nextcloud está actualmente ejecutándose en el Mac mini mediante Nextcloud AIO.

Configuración observada:

```text
Nextcloud 34.0.4
Mail 5.12.0
Deck 1.18.5
```

Dominio:

```text
reboot-nextcloud.dedyn.io
```

### Nextcloud Mail

- [x] Gmail conectado mediante OAuth.
- [x] Emails del formulario visibles en Nextcloud Mail.
- [x] Request-ID visible en el correo interno.

### Nextcloud Deck

Board y Stack actuales:

```text
Board: Reboot Request
Board ID: 2
Stack: New
Stack ID: 5
```

Servicio:

```text
src/services/deckService.ts
```

- [x] API de Deck integrada.
- [x] App Password dedicada `Reboot Lab Deck API`.
- [x] Creación automática de Cards.
- [x] Request-ID incluido en la descripción.
- [x] IDs configurados mediante variables de entorno.

Descripción actual:

```text
Request-ID: REQ-...
Name: ...
Email: ...
Topic: ...

Message:
...
```

## Docker y CI/CD

Imagen:

```text
yamivirtuality/reboot-lab:latest
```

Container:

```text
reboot-lab-web
```

Mapping:

```text
127.0.0.1:8082 → 4321
```

Restart policy:

```text
unless-stopped
```

- [x] Docker funcionando.
- [x] Imagen Multi-Arch para `linux/amd64` y `linux/arm64`.
- [x] Publicación automática en Docker Hub.
- [x] VPS consume la imagen con Docker.
- [x] Producción ejecuta la imagen Docker.
- [x] GitHub Actions de Docker validado.

Flujo:

```text
GitHub
   ↓
GitHub Actions
   ↓
Multi-Arch Build
   ↓
Docker Hub
   ↓
VPS
```

El workflow separado de GitHub Pages tiene un fallo pendiente de revisar y no bloquea la producción Docker actual.

## VPS y producción

Root del proyecto:

```text
/var/www/astro-decap-lab
```

Producción:

```text
https://reboot.yampe.dev
```

Reverse proxy hacia:

```text
127.0.0.1:8082
```

Las variables runtime se mantienen en `.env` fuera de Git.

## CGNAT y Tailscale

Se detectó CGNAT en la conexión doméstica.

```text
WAN: 100.77.136.204
IP pública observada: 193.5.239.233
```

No se habilitó DMZ ni se expuso Nextcloud mediante port forwarding.

Tailscale conecta el VPS con el Mac mini:

```text
VPS
srv838088
100.73.156.69

Mac mini
yamis-mac-mini
100.65.152.36
```

- [x] `tailscale status` validado.
- [x] `tailscale ping yamis-mac-mini` validado.
- [x] Puerto 443 accesible desde VPS.
- [x] HTTPS de Nextcloud accesible mediante Tailscale.
- [x] Container Docker capaz de alcanzar Nextcloud.

Arquitectura:

```text
VPS
 ↓
Tailscale
 ↓
Mac mini
 ↓
Caddy
 ↓
Nextcloud
```

Producción utiliza actualmente:

```text
--add-host reboot-nextcloud.dedyn.io:100.65.152.36
```

Este mapping debe conservarse al recrear el container mientras Nextcloud siga alojado en el Mac mini.

## Producción → Nextcloud Deck

La primera prueba de producción enviaba correctamente el email, pero Deck fallaba por timeout hacia Nextcloud.

Después de introducir Tailscale y el host mapping:

- [x] Email desde producción.
- [x] Conexión VPS → Nextcloud.
- [x] Creación de Deck Card desde producción.

```text
reboot.yampe.dev
       ↓
Astro Docker VPS
       ├── Resend
       └── Deck Service
              ↓
          Tailscale
              ↓
           Mac mini
              ↓
          Nextcloud
              ↓
             Deck
```

## Manejo de fallos parciales

- [x] Si el email interno se envía pero Deck falla, el error de Deck se registra sin marcar toda la solicitud como perdida.
- [x] Si falla la confirmación al cliente después de recibir el correo interno, se registra el error sin invalidar la solicitud ya recibida.

## Variables de entorno relevantes

```text
RESEND_API_KEY
CONTACT_EMAIL
CONTACT_EMAIL_TECHNICAL
CONTACT_EMAIL_SALES
NEXTCLOUD_URL
NEXTCLOUD_USER
NEXTCLOUD_APP_PASSWORD
NEXTCLOUD_DECK_BOARD_ID
NEXTCLOUD_DECK_STACK_ID
```

- [x] Secretos fuera de Git.
- [x] `.env` excluido.
- [x] `.dockerignore` excluye archivos de entorno.

## Flujo actual validado

```text
Customer
   ↓
Contact Form
   ↓
Astro API
   ↓
Validation + Honeypot
   ↓
Request-ID
   ↓
Topic Routing
   │
   ├── Resend
   │     ├── Admin
   │     ├── Technical / Sales
   │     └── Customer Confirmation
   │
   └── Deck Service
          ↓
         VPS
          ↓
      Tailscale
          ↓
       Mac mini
          ↓
      Nextcloud Deck
          ↓
   Card + Request-ID
```

## Estado completado

- [x] Astro Server.
- [x] Contact API.
- [x] Zod validation.
- [x] Honeypot.
- [x] Resend.
- [x] Dominio `send.yampe.dev`.
- [x] DKIM / SPF / DMARC.
- [x] Customer confirmation.
- [x] Request-ID.
- [x] Request-ID en Mail.
- [x] Request-ID en Deck.
- [x] Topic routing.
- [x] Admin routing.
- [x] Technical routing.
- [x] Sales routing.
- [x] Multiple recipients.
- [x] Deduplicación de recipients.
- [x] Nextcloud Mail conectado.
- [x] Nextcloud Deck API.
- [x] Deck Card creation.
- [x] Docker.
- [x] Multi-Arch.
- [x] Docker Hub.
- [x] GitHub Actions para Docker.
- [x] VPS deployment.
- [x] CGNAT identificado.
- [x] Tailscale VPS ↔ Mac mini.
- [x] HTTPS Nextcloud mediante Tailscale.
- [x] Docker → Tailscale → Nextcloud.
- [x] Deck Card creada desde producción.

## Próximos puntos

```text
Topic → Deck Label
        ↓
Deck Card → Nextcloud Mail Link
        ↓
Message-ID / correlación
        ↓
Validación final local
        ↓
Deploy del conjunto actualizado al VPS
        ↓
Validación End-to-End en producción
```

> Regla del laboratorio: mantener los secretos fuera de Git, validar primero en local y desplegar el conjunto a producción únicamente después de comprobar el flujo completo.
