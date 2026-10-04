# Track fitness app

A mobile-first React application built with Vite, Tailwind CSS, Firebase Authentication, and Cloud Firestore.

## Preview

Install dependencies with `npm install`, run `npm run dev`, and open the URL printed by Vite.

The frontend uses the existing Stride Firebase project. Email/password authentication is shared with the earlier app, and habits sync to `users/{uid}/planner/current` without replacing other planner data.

## Mini PC deployment

Install Docker on the mini PC, clone this repository, then run:

```bash
docker compose up -d --build
```

Track will listen on port `8080`. Point a reverse proxy or Cloudflare Tunnel at `http://localhost:8080`. The container restarts automatically and exposes `/health` for monitoring.

## Strava

The React app connects to Strava through the Cloudflare Worker in `worker/`; client secrets and refresh tokens never enter the browser. Copy `worker/.dev.vars.example` to `worker/.dev.vars`, add the Strava application credentials, create the `STRAVA_TOKENS` KV namespace, and update its ID in `worker/wrangler.jsonc`. Run the API locally with `npm run worker:dev`.

The layout follows the original 400 &times; 934px Figma mockup. On larger screens it remains a centered phone-sized preview instead of expanding into a separate desktop dashboard.
