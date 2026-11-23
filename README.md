# penguin-web

The documentation for **Penguin**, published at
[docs.pengwings.dev](https://docs.pengwings.dev). The brochure site at
[pengwings.dev](https://pengwings.dev) is served from the Zephyrex ERP, not from
this repository.

Penguin is a rebasable soft-fork of [Pelican](https://pelican.dev) that runs
game/app servers as **unprivileged Proxmox LXC** (via embedded OpenTofu) instead
of Docker. See the companion repositories:

- [penguin-panel](https://github.com/JamesonRGrieve/penguin-panel) — control plane (fork of `pelican/panel`)
- [penguin-wings](https://github.com/JamesonRGrieve/penguin-wings) — node daemon (fork of `pelican/wings`)

## The docs are a diff, not a mirror

Because Penguin tracks Pelican, this site documents **only what Penguin changes**
and **links out to [pelican.dev/docs](https://pelican.dev/docs)** for everything
unchanged. We deliberately do **not** mirror Pelican's documentation:

- Pelican's docs are not published under a license granting redistribution.
- A mirror drifts the moment upstream edits a page; a link is always current.

So: pages that differ under LXC live in `src/content/docs/changes/`; unchanged
topics point at Pelican. Pelican and Pelican's docs remain the property of their
authors — this repository contains only original Penguin content.

## Stack

[Astro](https://astro.build) + [Starlight](https://starlight.astro.build) —
static HTML output (zero JS by default), built-in sitemap and Pagefind search.
**pnpm only.**

```bash
pnpm install       # first run also builds esbuild/sharp (allowed in pnpm-workspace.yaml)
pnpm dev           # local dev server
pnpm build         # static build to dist/
pnpm preview       # serve the build
```

## Structure

| Path | What |
|---|---|
| `src/content/docs/index.mdx` | Docs home page (splash) |
| `src/content/docs/overview.md` | What Penguin is |
| `src/content/docs/reading-the-docs.md` | How the diff-docs model works + the index |
| `src/content/docs/changes/` | **Pages that differ from Pelican** (our authored content) |
| `astro.config.mjs` | Site + Starlight config (sidebar, links out to Pelican) |

## License

AGPL-3.0-or-later. See [`LICENSE`](./LICENSE).
