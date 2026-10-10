# PodTrackerPro — Marketing Site

> Public marketing site for [PodTrackerPro](https://www.podtrackerpro.com) — print-on-demand business management platform.

## Stack

Plain HTML / CSS / JS — no framework. Deployed via GitHub → Shock Hosting (cPanel).

## Local development

```bash
# Serve locally (any static server works)
npx serve .

# Or open index.html directly in a browser
```

## Deploys

Push to `main` — Shock Hosting's `.cpanel.yml` picks it up automatically.

## Tests

Playwright runs link checks on every push:

```bash
npm ci
npx playwright install chromium
npm test
```

## Related

- [PodTrackerPro App](https://github.com/ctec-appdev/podtrackerpro) — deployed on Vercel
- [ctecwebdesign.com](https://www.ctecwebdesign.com) — main business site
