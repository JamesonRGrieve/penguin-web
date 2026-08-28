---
title: What Penguin is
description: Penguin is a soft-fork of Pelican that runs servers as unprivileged Proxmox LXC via embedded OpenTofu.
---

Penguin is a **soft-fork of [Pelican](https://pelican.dev)**. It keeps Pelican's
Panel (the control plane and source of truth) and the whole Pelican/Pterodactyl
**egg ecosystem**, and changes one thing: how a server is *realized*.

## The one architectural change

| | Pelican | Penguin |
|---|---|---|
| A "server" is… | a Docker container | a persistent, **unprivileged Proxmox LXC** |
| Realization engine | the Docker daemon | **embedded OpenTofu** + the `bpg/proxmox` provider |
| Container base | the egg's Docker image | the egg's **OCI image**, pulled onto the node |
| Node access | Wings on the host | a **scoped `penguin@pam`** channel (`pct exec`/`pct push` only) + API token |
| Console / metrics | Docker | **PVE-native** (termproxy, `status/current`) — no in-container agent |

Everything above the realization layer — the Panel, users, nodes, allocations,
eggs, the API — is Pelican, unchanged.

## Why

Proxmox shops already run PVE for their VMs and containers. Penguin lets game and
app servers live in that same fabric as first-class unprivileged LXC: snapshots,
backups, migration, console and metrics all come from PVE, and the whole thing is
declared as infrastructure (OpenTofu state per server) rather than imperative
Docker calls.

## Components

- **Penguin Panel** — the Laravel/Filament control plane and source of truth.
  Fork of `pelican/panel`.
- **Penguin Wings** — the Go node daemon that realizes intent as LXC via embedded
  OpenTofu. Fork of `pelican/wings`; this is where ~90% of the divergence lives.

Both are AGPL-3.0, stand alone (no external infra dependency), and rebase cleanly
against their Pelican upstreams.

## Status

Penguin is young. The LXC realization path — create → pull the egg's OCI image →
run the egg's install as container-root over the scoped channel → launch via the
entrypoint — is proven end to end for a range of eggs. See
[What Penguin changes](/reading-the-docs/) for exactly which docs differ, and the
repositories for the current state.
