# Deploy Make My Lesson (Next.js) on Hostinger VPS

Stack: **nginx** (TLS) → **PM2** → Next.js **standalone** on `127.0.0.1:3000`.

## Prerequisites

- Ubuntu/Debian VPS with Node.js 20+
- Domain `makemylesson.app` A/AAAA records pointing at the VPS
- Production `.env` (copy from `.env.example`; use the Firebase **Next.js** web app IDs)

## Build on the server (or CI artifact)

```bash
cd /var/www/makemylesson   # or your app directory
git pull                   # or unpack release
npm ci
npm run build
```

Standalone output lives in `.next/standalone`. From the Next.js project root:

```bash
# Ensure public + static assets sit next to the standalone server
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp ecosystem.config.cjs .next/standalone/
cp .env.production .next/standalone/.env   # or export env via PM2
```

Adjust `ecosystem.config.cjs` `cwd` to the standalone folder when starting from there, or place `server.js` at the process cwd.

## PM2

```bash
cd .next/standalone   # where server.js lives after copy
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup           # enable on reboot
```

Reload after a new build:

```bash
pm2 reload makemylesson-web
```

## nginx (sketch)

```nginx
server {
  listen 443 ssl http2;
  server_name makemylesson.app;

  # ssl_certificate / etc. via Certbot

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

```bash
sudo certbot --nginx -d makemylesson.app
```

## Post-cutover checks

1. `https://makemylesson.app` loads; `/app/*` redirects to `/*`
2. Firebase Auth authorized domains include `makemylesson.app`
3. PayPal return URL: `https://makemylesson.app/subscription`
4. PWA manifest + service worker under `/manifest.webmanifest` and `/sw.js`
5. Optional FCM: `/firebase-messaging-sw.js` reachable; VAPID key in env

Marketing site stays on **`makemylesson.ai`** (separate host). Leave Flutter mobile builds unchanged.
