# Deploy Make My Lesson (Next.js) on Hostinger VPS

Stack: **nginx** (TLS) → **PM2** → Next.js on **`127.0.0.1:3010`**.

> This VPS runs multiple apps. **Do not use port 3000** for Make My Lesson —
> use **3010**. If nginx still proxies to `:3000`, the public site will not load
> even when `curl http://127.0.0.1:3010` returns `200`.

## Prerequisites

- Ubuntu/Debian VPS with Node.js 20+
- App directory: `/var/www/makemylesson_new` (or your path)
- Domain DNS A/AAAA → VPS
- Production `.env.local` or `.env` in the app directory (Firebase `NEXT_PUBLIC_*`, etc.)

## Build + start (correct)

`next.config` uses `output: "standalone"`. **Do not** run `next start` or
`pm2 restart studiely` — use the standalone server on port **3010**.

```bash
cd /var/www/makemylesson_new
git pull
npm ci
npm run build   # postbuild copies public/ + .next/static into standalone

pm2 delete makemylesson 2>/dev/null || true
pm2 start ecosystem.config.cjs   # runs .next/standalone/server.js
pm2 save
pm2 startup   # once per server
```

### Sanity check (must pass before touching DNS/nginx)

```bash
curl -I http://127.0.0.1:3010
# Expect: HTTP/1.1 200 OK

pm2 logs makemylesson --lines 50
```

If this curl fails, the site will not load publicly — fix PM2/build first.

## nginx (critical)

Proxy to **3010**, not 3000:

```nginx
server {
  listen 443 ssl http2;
  server_name makemylesson.ai www.makemylesson.ai;

  # ssl_certificate … via Certbot

  location / {
    proxy_pass http://127.0.0.1:3010;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Apply:

```bash
# Find the site config
grep -R "makemylesson\|proxy_pass" /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null

# Edit proxy_pass → http://127.0.0.1:3010;
sudo nginx -t && sudo systemctl reload nginx
```

## “Works on Vercel, blank / error on VPS”

| Symptom | Likely cause | Fix |
|--------|--------------|-----|
| Domain times out / 502 | nginx → wrong port (3000 vs 3010) | Set `proxy_pass` to `127.0.0.1:3010` |
| `curl :3010` = 200, public fails | nginx or firewall only | Fix nginx; `ufw allow 80,443` |
| PM2 online, curl fails | build missing / wrong cwd | `npm run build`, start from app root |
| Favicons / images 404 | standalone assets not copied | `npm run build` runs `postbuild` copy; or use `next start` as in ecosystem |
| SSH / ping timeout | VPS network / firewall / IP change | Hostinger panel → restart VPS / check IP |

## Standalone mode (required)

`next.config` has `output: "standalone"`. PM2 must run
`.next/standalone/server.js` (see `ecosystem.config.cjs`).

If PM2 logs show `"next start" does not work with "output: standalone"`, the
process was started incorrectly — redeploy with the ecosystem file above.

Manual smoke test:

```bash
npm run build
cd .next/standalone
PORT=3010 HOSTNAME=127.0.0.1 node server.js
```

## Post-cutover checks

1. `https://makemylesson.ai` loads
2. `curl -I http://127.0.0.1:3010` → 200
3. Firebase Auth authorized domains include your live host
4. `/favicon.ico` and `/icons/icon-192.png` return 200
