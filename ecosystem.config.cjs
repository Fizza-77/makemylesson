const path = require("node:path");

/**
 * PM2 process file for Hostinger VPS (Next.js standalone).
 *
 * This VPS hosts several apps — Make My Lesson listens on **3010**
 * so it does not collide with other Node apps on 3000.
 *
 * `next.config` uses `output: "standalone"`. Do NOT use `next start` here —
 * run the standalone server after postbuild copies public + static assets.
 *
 * After `npm run build` in /var/www/makemylesson_new:
 *   pm2 delete makemylesson 2>/dev/null || true
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *
 * nginx must proxy to 127.0.0.1:3010 (not 3000).
 */
module.exports = {
  apps: [
    {
      name: "makemylesson",
      cwd: path.join(__dirname, ".next", "standalone"),
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3010,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "512M",
      time: true,
    },
  ],
};
