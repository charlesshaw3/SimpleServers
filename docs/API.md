# API Overview

Base URL: `http://127.0.0.1:4010`

## Auth headers

- `x-api-token`: required for protected endpoints.
- `x-remote-token`: required for non-local access when remote-control mode is enabled with token enforcement.

## Core

- `GET /health`
- `GET /meta`
- `GET /roles`
- `GET /me`

## Setup, Policy, and System

- `GET /setup/catalog`
- `GET /setup/presets`
- `POST /policy/server-create-preview`
- `GET /system/java`
- `GET /system/java/channels`
- `GET /system/status`
- `GET /system/hardware`

`GET /setup/presets` returns the guided setup profiles:
- `custom`
- `survival`
- `modded`
- `minigame`

## Users (`owner`)

- `GET /users`
- `POST /users`
- `POST /users/:id/rotate-token`

## Servers

- `GET /servers`
- `POST /servers` (`admin`)
- `POST /servers/quickstart` (`admin`, one-call create + optional start + optional quick-host enable)
- `DELETE /servers/:id?deleteFiles=<bool>&deleteBackups=<bool>` (`admin`, defaults `true/true`)
- `POST /servers/:id/start` (`moderator`)
- `POST /servers/:id/stop` (`moderator`)
- `POST /servers/:id/restart` (`moderator`)
- `POST /servers/:id/command` (`moderator`)
- `GET /servers/:id/logs`
- `GET /servers/:id/preflight`
- `POST /servers/:id/preflight/repair-core` (`admin`, requires stopped server)
- `GET /servers/:id/support-bundle`
- `GET /servers/:id/log-stream` (websocket; auth via `Sec-WebSocket-Protocol: ss-token.<base64url-token>` or query `token`)

`POST /servers/quickstart` defaults:
- preset `survival`
- type `paper` (or `fabric` for `modded` preset)
- latest stable Minecraft version for selected type
- port `25565`
- `startServer=true`
- `publicHosting=true`

## File Editing

- `GET /servers/:id/editor/files` (indexed editable text files)
- `GET /servers/:id/editor/file?path=<relativePath>`
- `PUT /servers/:id/editor/file` (`admin`)
- `POST /servers/:id/editor/file/diff`

Legacy file-specific routes are still supported:

- `GET /servers/:id/files/:fileName`
- `PUT /servers/:id/files/:fileName` (`admin`)
- `POST /servers/:id/files/:fileName/diff`

Allowed files:

- `server.properties`
- `ops.json`
- `whitelist.json`
- `banned-ips.json`
- `banned-players.json`

## Backups

- `GET /servers/:id/backups`
- `POST /servers/:id/backups` (`moderator`)
- `POST /servers/:id/backups/:backupId/restore` (`admin`, requires stopped server)
- `GET /servers/:id/backup-policy`
- `PUT /servers/:id/backup-policy` (`admin`)
- `POST /servers/:id/backup-policy/prune-now` (`admin`)

Restore notes:

- `POST /servers/:id/backups/:backupId/restore` always creates a pre-restore safety snapshot first.
- Restore response includes `restore.preRestoreBackupId` so UI flows can surface rollback checkpoints.

## Quick Public Hosting

- `POST /servers/:id/public-hosting/quick-enable` (`admin`)
- `GET /servers/:id/public-hosting/status`
- `GET /servers/:id/public-hosting/diagnostics`

Notes:

- Playit-backed tunnels now synchronize assigned public host/port from Playit run data.
- `publicAddress` remains `null` while Playit is still assigning an endpoint (`pending`/`starting` states).
- diagnostics include command availability, auth status, endpoint assignment state, and retry timing metadata.

## Tasks

- `GET /tasks`
- `POST /tasks` (`admin`)
- `POST /tasks/:id/enable` (`admin`)
- `POST /tasks/:id/disable` (`admin`)
- `DELETE /tasks/:id` (`admin`)

## Alerts

- `GET /alerts`
- `POST /alerts/:id/resolve` (`moderator`)

## Audit (`admin`)

- `GET /audit`

## UX Telemetry

- `POST /telemetry/events`
- `GET /telemetry/funnel?hours=<1-720>` (`admin`)

## Tunnels

- `GET /tunnels`
- `POST /tunnels` (`admin`)
- `POST /tunnels/:id/start` (`moderator`)
- `POST /tunnels/:id/stop` (`moderator`)

Providers:

- `manual`
- `playit`
- `cloudflared`
- `ngrok`

## Content Providers (Modrinth / CurseForge)

- `GET /content/search?provider=<modrinth|curseforge>&q=<query>&serverId=<id>&kind=<optional>`
- `GET /content/:provider/projects/:projectId/versions?serverId=<id>&limit=<optional>`

## Server Packages

- `GET /servers/:id/packages`
- `GET /servers/:id/packages/updates`
- `POST /servers/:id/packages/install` (`admin`)
- `POST /servers/:id/packages/:packageId/update` (`admin`)
- `DELETE /servers/:id/packages/:packageId` (`admin`)

## Crash Reports

- `GET /servers/:id/crash-reports`
- `GET /crash-reports/:id` (`admin`)

## Remote Control (`owner`)

- `GET /remote/status`
- `PUT /remote/config`

Remote-control notes:

- Non-local requests are blocked unless remote mode is enabled.
- Allowed origins are enforced for browser-originated remote requests.
- Remote token validation is enforced when `requireToken=true`.
