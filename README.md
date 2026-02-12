# paramedicstudents.com

React + Vite starter for a QAS-aligned student learning and commerce platform.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages deployment

This repository includes `.github/workflows/deploy-pages.yml` for automatic deployment.

### Required one-time GitHub setup
1. In **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Ensure your default branch is `main` (or update workflow branch trigger).

## GoDaddy + domain connection details needed
To connect `paramedicstudents.com` after GitHub Pages is working, provide:
- GoDaddy account DNS access.
- Preferred `www` behaviour (redirect to apex or vice versa).
- Confirmation email/contact for SSL and notices.
- GitHub repo admin access for custom domain settings.

