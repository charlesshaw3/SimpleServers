# Roadmap

## Status

Current stable milestone: `v0.5.4` (validated by typecheck, build, API integration tests, web e2e, and UI live smoke).

## Implemented in v0.5.4

- Shipped v2 information architecture:
  - `Servers` list context
  - `Setup Wizard` context
  - `Server Workspace` tabbed context
- Modularized frontend shell into feature components under `apps/web/src/features/*`.
- Added setup-session API pair for deterministic wizard launch:
  - `POST /setup/sessions`
  - `POST /setup/sessions/:id/launch`
- Added `GET /servers/:id/workspace-summary` for aggregated workspace state.
- Added integration tests for setup sessions and workspace summary.

## Implemented in v0.5.3

- Added encrypted cloud backup destinations with provider support for `S3`, `Backblaze B2 (S3 API)`, and `Google Drive`.
- Added cloud backup artifact restore verification telemetry.
- Added first-class player admin services/UI routes (ops, whitelist, player bans, IP bans, known players, timeline history).
- Added Bedrock strategy endpoint (`/system/bedrock-strategy`).
- Added quick-local hardening guide endpoint (`/system/hardening-checklist`).
- Added modpack workflow endpoints for planning/import/update/rollback.
- Expanded trust API with checksum verification and audit export metadata.
- Added reliability dashboard endpoint (`/system/reliability`).
- Added migration tooling (`/migration/import/manual`, `/migration/import/manifest`, `/migration/imports`).
- Added server terminal command endpoint (`POST /servers/:id/command`).

## Implemented in v0.5.2

- Added beginner-mode capability/status/recovery APIs:
  - `GET /system/capabilities`
  - `GET /servers/:id/simple-status`
  - `POST /servers/:id/simple-fix`
- Extended quickstart payload with `memoryPreset`, `savePath`, and `worldImportPath`.
- Added structured API error envelope and hardened role-aware refresh behavior.

## Implemented in v0.5.1

- Fixed quickstart duplicate-name failures via unique-name auto-resolution.
- Added live UI smoke validation (`npm run test:ui:live`).

## Implemented in v0.5.0

- Added focus-first dashboard behavior and stronger quick-host recovery paths.
- Added Playit secret setup endpoint (`POST /tunnels/:id/playit/secret`).
- Hardened tunnel endpoint matching and diagnostics recovery flows.

## Next Track

- Real-time online-player count integration into `workspace-summary` metrics.
- Additional accessibility pass across v2 shell keyboard/focus behavior.
- Deeper performance profiling (tick time, chunk loading, plugin timings).
- Optional remote multi-factor auth for internet-exposed control planes.
- Backup encryption-at-rest plus more external object storage adapters.
