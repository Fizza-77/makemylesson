# Deploy Make My Lesson (Next.js) on Hostinger VPS

Stack: **nginx** (TLS) → **PM2** → Next.js **standalone** on `127.0.0.1:3000`.

## Prerequisites

- Ubuntu/Debian VPS with Node.js 20+
- Domain `makemylesson.ai` (plus `www` and the legacy `makemylesson.app` / `makemylesson.com`) A/AAAA records pointing at the VPS
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
  server_name makemylesson.ai;

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

# Legacy domains and www → canonical host
server {
  listen 443 ssl http2;
  server_name www.makemylesson.ai makemylesson.app www.makemylesson.app makemylesson.com www.makemylesson.com;
  return 301 https://makemylesson.ai$request_uri;
}
```

```bash
sudo certbot --nginx -d makemylesson.ai -d www.makemylesson.ai \
  -d makemylesson.app -d www.makemylesson.app \
  -d makemylesson.com -d www.makemylesson.com
```

## Cloud Storage CORS

Browser-side exports (PPTX/PDF) fetch slide images and school logos from Storage, so the bucket must allow the **page** origin. Origins live in `storage-cors.json` at the repo root — edit that file, never the console, then apply:

```bash
gsutil cors set storage-cors.json gs://makemylesson-44088.firebasestorage.app
gsutil cors get gs://makemylesson-44088.firebasestorage.app
```

Apex and `www` are distinct origins; both need listing. Legacy hosts only need listing while they still serve the app — after they become redirects, the page origin is already `makemylesson.ai`.

## Post-cutover checks

1. `https://makemylesson.ai` loads; `/app/*` redirects to `/*`; the legacy `.app` / `.com` hosts 301 here
2. Firebase Auth authorized domains include `makemylesson.ai` and `www.makemylesson.ai`
3. PayPal return URL: `https://makemylesson.ai/subscription`
4. Storage CORS allows `https://makemylesson.ai` (and `www`), otherwise PPTX/PDF exports drop their images
5. PWA manifest + service worker under `/manifest.webmanifest` and `/sw.js`
6. Optional FCM: `/firebase-messaging-sw.js` reachable; VAPID key in env

Marketing and app share this host (route group `(marketing)`). Leave Flutter mobile builds unchanged.
