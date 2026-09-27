# haider.pw

[![Better Stack Badge](https://uptime.betterstack.com/status-badges/v1/monitor/124w4.svg)](https://uptime.betterstack.com/?utm_source=status_badge)

Personal site of **Syed Haider Hassan**: résumé, portfolio and blog.

Built with **Nuxt 4**, **Tailwind CSS v4** and **TypeScript**, deployed to **Cloudflare Pages**.

## Features

- Dark theme by default, with a light theme one click away (the toggle uses a View Transitions circular reveal and remembers the choice).
- Fully responsive (mobile, tablet, desktop) with scroll-reveal animations, a floating nav with a sliding indicator, and animated page transitions. Motion respects `prefers-reduced-motion`.
- `/contact` page with a message form (sent server-side via Resend; spam protection: Cloudflare Turnstile, honeypot, minimum fill time, link limits and per-IP rate limiting), direct channels and your live local time
- ⌘K / Ctrl+K (or `/`) command palette to jump to pages, projects and posts, switch the theme, or copy the email address.
- Blog pulled from the dev.to API. Posts are rendered to HTML on the server with syntax highlighting, a table of contents and a reading-progress bar. Responses are cached for an hour (stale-while-revalidate).
- Performance: static pages (including home) are prerendered and served from Cloudflare's edge cache; CSS is inlined, fonts are Latin-only and preloaded, icons are CSS masks, and above-the-fold content never waits for JavaScript.
- SEO: per-page meta and Open Graph tags, JSON-LD `Person` schema, `sitemap.xml` (blog posts included) and `robots.txt`.
- The Experience page prints as a clean résumé.

## Editing content

All content is typed data in `app/data/`:

| File | What it holds |
| --- | --- |
| `profile.ts` | Name, title, bio, socials, education, interests, avatar |
| `experience.ts` | Work history (timeline) |
| `projects.ts` | Portfolio projects (screenshots live in `public/img/projects/`) |
| `skills.ts` | Skill groups and the home-page marquee |

Icons use [Iconify](https://icones.js.org) names from the `lucide:` and `simple-icons:` sets.

To add a portrait, put an image at `public/img/avatar.webp` and set `avatar: '/img/avatar.webp'` in `profile.ts`.

To re-theme the site, edit `--accent` and `--accent-2` in `app/assets/css/main.css`.

## Configuration

| Env variable | Default | Purpose |
| --- | --- | --- |
| `NUXT_PUBLIC_BLOG_USER` | `yuridevat` | dev.to username whose posts are shown |
| `NUXT_BLOG_API_BASE` | `https://dev.to/api` | dev.to API base URL (point it at a mock for offline development) |
| `NUXT_RESEND_API_KEY` | _(empty)_ | **Secret.** [Resend](https://resend.com) API key used by `/api/contact`. Without it, the form opens the visitor's email app instead. |
| `NUXT_CONTACT_FROM` | `haider.pw <hello@haider.pw>` | Sender address; must be on a domain verified in Resend |
| `NUXT_CONTACT_TO` | `haideritx@gmail.com` | Where contact messages are delivered |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | _(empty)_ | [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) site key for the contact form (public) |
| `NUXT_TURNSTILE_SECRET_KEY` | _(empty)_ | **Secret.** Turnstile secret key; when set, `/api/contact` rejects messages without a valid token |

## Development

Requires Node 22.19+ or 24.11+ (pinned to 24.21.0 in `.nvmrc`) and Yarn 4 (via Corepack).

```bash
corepack enable
yarn install
yarn dev          # http://localhost:3000
yarn typecheck
yarn build        # Cloudflare Pages output in dist/
```

## Deployment (Cloudflare Pages)

- Build command: `yarn build`
- Output directory: `dist`
- Environment variable: `NUXT_PUBLIC_BLOG_USER=<your dev.to username>`

`/about`, `/work` and `/projects` are prerendered. The home page and blog are server-rendered on Pages Functions so new dev.to posts show up without a rebuild.
