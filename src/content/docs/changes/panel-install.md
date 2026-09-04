---
title: Installing the Panel
description: Penguin's Panel runs directly in an unprivileged Proxmox LXC, not a Docker container. Only that difference is documented here.
sidebar:
  order: 2
---

Adapts Pelican's [panel installation](https://pelican.dev/docs) for the LXC
backend. Dependencies, database, Redis, web server, queue worker, scheduler, SSL,
and the first-run installer are **Pelican, unchanged** — follow the Pelican guide
for those. Only the deployment model below is Penguin-specific.

## The one difference: LXC, not Docker

Pelican ships the Panel primarily as a Docker image (`docker compose up`). Penguin
does not — the Panel runs **directly inside an unprivileged Proxmox LXC**, as an
ordinary PHP 8.3+ / Laravel app served by your web server of choice. This matches
Penguin's model: everything lives in the PVE fabric, nothing in Docker.

:::caution[The repo's Docker files are vestigial]
`penguin-panel` still carries a `Dockerfile` and `compose*.yml` inherited from
upstream Pelican. They exist only so the fork rebases cleanly against
`pelican/panel` — **they are not the Penguin deployment path.** Do not
`docker compose up`.
:::

## Deploy into the LXC

Inside the LXC (Debian/Ubuntu, PHP 8.3–8.5, Composer, a web server, and
MariaDB/PostgreSQL + Redis reachable), from the Panel's install directory:

```sh
composer install --no-dev --optimize-autoloader
cp .env.example .env
php artisan key:generate --force
chown -R www-data:www-data storage bootstrap/cache
```

Point the web server's document root at **`public/`**, then open the Panel and
complete the first-run installer (database, cache/queue, and the admin account).

:::note[Missing `vendor/autoload.php`?]
Running `php artisan …` on a fresh checkout before `composer install` fails with:

```
Failed opening required '.../vendor/autoload.php'
```

`composer install` is the step that creates `vendor/` — it is required on every
fresh checkout and after any dependency change. A Docker deploy hides this because
the image builds `vendor/` at image-build time; a bare LXC deploy does not.
:::

## Everything else → Pelican

Web server + PHP-FPM config, the database and Redis, the queue worker
(`php artisan queue:work` under a supervisor), the scheduler (`php artisan
schedule:run` each minute via cron), SSL, and the API are identical to Pelican:

- [pelican.dev/docs →](https://pelican.dev/docs)
