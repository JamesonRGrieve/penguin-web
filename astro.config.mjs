// SPDX-License-Identifier: AGPL-3.0-or-later
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// pengwings.dev — Penguin's web presence. Penguin is a soft-fork of Pelican that
// runs game/app servers as Proxmox LXC (not Docker). This site hosts ONLY what
// Penguin changes; for everything unchanged it links out to pelican.dev, so we
// never redistribute Pelican's (unlicensed) docs.
const PELICAN_DOCS = "https://pelican.dev/docs";

export default defineConfig({
  site: "https://pengwings.dev",
  integrations: [
    starlight({
      title: "Penguin",
      description:
        "Penguin runs game and app servers as unprivileged Proxmox LXC — a soft-fork of Pelican, driven by embedded OpenTofu instead of Docker.",
      tagline: "Pelican, on Proxmox LXC.",
      social: [
        { icon: "github", label: "GitHub", href: "https://github.com/JamesonRGrieve/penguin-panel" },
      ],
      editLink: {
        baseUrl: "https://github.com/JamesonRGrieve/penguin-web/edit/main/",
      },
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Start here",
          items: [
            { label: "What Penguin is", slug: "overview" },
            { label: "How these docs work", slug: "reading-the-docs" },
          ],
        },
        {
          label: "What Penguin changes",
          items: [{ autogenerate: { directory: "changes" } }],
        },
        {
          label: "Everything else → Pelican",
          items: [
            { label: "Pelican docs (unchanged topics)", link: PELICAN_DOCS },
          ],
        },
      ],
    }),
  ],
});
