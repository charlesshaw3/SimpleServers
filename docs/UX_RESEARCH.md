# UX Research Notes (v0.5.4)

This document captures external product research and internal audits that informed the v2 shell rollout.

## Research Targets

### Prism Launcher (instance-first desktop UX)

- https://prismlauncher.org/
- https://prismlauncher.org/wiki/getting-started/
- https://prismlauncher.org/wiki/getting-started/create-instance/

Key takeaways:

- Instance-centric mental model (`create/select/run`) stays obvious.
- Default path is simple; advanced controls are discoverable but not mandatory.
- Operational status is visible without forcing users into deep settings pages.

### Tunnel onboarding references

- https://playit.gg/download
- https://playit.gg/support/setup-minecraft-java-server/
- https://playit.gg/support/setup-common-issues/

Key takeaways:

- Tunnel success depends on authenticated agent state.
- Endpoint assignment can remain pending and must be represented explicitly.
- Recovery should provide concrete next actions, not generic retry copy.

### Server control-plane references

- Pterodactyl docs: https://pterodactyl.io/panel/1.0/getting_started.html
- Crafty Controller: https://craftycontrol.com/

Key takeaways:

- Clear separation between lifecycle, files, backups, and networking improves orientation.
- Batch actions and status visibility reduce operator overhead for multi-server setups.

### UX Heuristics and accessibility references

- Nielsen Norman Group (10 heuristics): https://www.nngroup.com/articles/ten-usability-heuristics/
- WCAG 2.2 quick reference: https://www.w3.org/WAI/WCAG22/quickref/
- PatternFly bulk-selection pattern: https://www.patternfly.org/patterns/bulk-selection/

## Internal Findings Before v0.5.4

- Main app flow had too many competing modes and duplicated action regions.
- Setup path branching was over-exposed too early for first-run users.
- Operational data was split across multiple API calls, increasing UI complexity.

## v0.5.4 Changes Mapped to Findings

### Information architecture

- Implemented explicit three-context flow:
  - `Servers`
  - `Setup Wizard`
  - `Server Workspace`
- Preserved legacy view as fallback while defaulting to v2 shell.

### Wizard flow reliability

- Added setup session lifecycle:
  - `POST /setup/sessions`
  - `POST /setup/sessions/:id/launch`
- Added launch progress + completion handoff with invite address and dashboard continuation.

### Workspace composition stability

- Added `GET /servers/:id/workspace-summary` to aggregate status, metrics, tunnel state, and primary action model.
- Reduced v2 dashboard reliance on fragmented endpoint composition.

## Validation

The following were run after implementation:

- `npm run typecheck`
- `npm run build -w apps/api`
- `npm run build -w apps/web`
- `npm run test -w apps/api`
