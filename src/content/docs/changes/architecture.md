---
title: Architecture
description: How Penguin realizes a server as a Proxmox LXC via embedded OpenTofu, instead of a Docker container.
sidebar:
  order: 1
---

Adapts Pelican's [architecture overview](https://pelican.dev/docs) for the LXC
backend. If you know how Pelican's Panel and Wings relate, only the **realization
layer** below is new.

## Panel is the source of truth; Wings realizes it

Unchanged from Pelican: the **Panel** declares intent (servers, eggs,
allocations, nodes) and is the single source of truth. **Wings** makes that intent
real on a node. What changes is *how* Wings makes it real.

## Wings realizes intent as LXC, not Docker

Where Pelican's Wings drives the Docker daemon, Penguin's Wings drives
**OpenTofu, in-process**:

- **Embedded OpenTofu.** Wings runs `tofu` via terraform-exec and owns **one Tofu
  workspace and state per server**. The Docker environment is replaced by an
  `environment/lxc` that renders a spec to HCL and reconciles it.
- **Provider: `bpg/proxmox`.** A server is a
  `proxmox_virtual_environment_container`. Renderers sit behind a backend
  interface so a future backend drops in without touching callers.
- **The egg's OCI image is the container base.** Each egg names a `docker_image`;
  Wings pulls it onto node storage (idempotent, keyed on the image ref) and
  creates the LXC **directly from that image** (PVE 9.1+ OCI application
  containers). The image's own runtime and non-root user apply as-is — nothing is
  baked per-egg.
- **Persistent lifecycle.** The LXC is created on install and destroyed on delete.
  `Start`/`Stop`/`Restart` are **power-state changes**, never recreation.

## Install runs over a scoped node channel — not root, not an agent

The egg's own install script must run *inside* the freshly-created container as
container-root, which the PVE API cannot do. Wings uses a **scoped `penguin@pam`
node account**: an SSH key whose `sudo` is restricted by a wrapper to only
`pct exec`/`pct push` over Penguin's VMID range, alongside a PVE API token for
lifecycle. **Never hypervisor root.**

The install sequence: create the CT from the egg image → boot a keepalive so the
channel can operate → push and run the egg's own install script as container-root
→ hand ownership to the game user → install the run-script (the egg's startup
command) as the entrypoint → stop. The next start boots straight into the game.

## PVE-native process visibility — no in-container agent

Because the OCI image is self-sufficient, Wings needs nothing running inside the
container. Console (PVE `termproxy`), metrics (`status/current` + `rrddata`), and
run state all come from the same PVE API Wings already drives — container-wide via
cgroups, more accurate than a per-process agent.

## What this means for you

- **Nodes are Proxmox nodes.** A Penguin node points at a PVE target authenticated
  by an API token, plus the scoped SSH channel for installs.
- **Allocations map to a per-LXC bridged IP**, not host port publishing.
- **Backups, snapshots, migration, console, metrics** are Proxmox features — you
  get them from PVE, not from a Wings-specific mechanism.
