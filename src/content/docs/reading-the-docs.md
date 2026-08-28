---
title: How these docs work
description: Penguin documents only what differs from Pelican and links out for the rest. Here is the map.
---

Penguin is a soft-fork, so its documentation is a **diff**, not a copy. Two rules:

1. **A topic that behaves the same as Pelican** → we link you to the Pelican page.
   We do not mirror it, so you always read the current, upstream version.
2. **A topic that genuinely differs under LXC** → we host our own page here, and
   note the Pelican original it adapts.

:::note[Why not just copy Pelican's docs?]
Pelican's docs are not released under a license that grants redistribution, and a
mirror drifts the moment upstream edits a page. Linking out is both lawful and
always-current. The trade is one extra click for unchanged topics — worth it.
:::

## What Penguin changes (hosted here)

These are the pages that differ. They live under
[**What Penguin changes**](/changes/architecture/) in the sidebar:

- **[Architecture](/changes/architecture/)** — LXC-via-OpenTofu instead of Docker;
  the realization engine, the scoped node channel, PVE-native console/metrics.

More pages land here as the divergence is documented (node/Proxmox setup, Wings
install, egg → OCI image semantics, allocations → per-LXC IP, the scoped
`penguin@pam` channel).

## Everything else (read on Pelican)

For anything not listed above, use Pelican's documentation directly:

- **[pelican.dev/docs →](https://pelican.dev/docs)**

Panel setup, users and roles, the API, eggs, the client area, SSL, and the general
concepts are Pelican, unchanged.
