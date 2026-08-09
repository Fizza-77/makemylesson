/**
 * PM2 process file for Hostinger VPS (Next.js standalone).
 *
 * After `npm run build`, Next writes `.next/standalone` + static assets.
 * Copy/serve as documented in docs/deploy-hostinger.md, then:
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 */
module.exports = {
  apps: [
    {
      name: "makemylesson-web",
      cwd: __dirname,
      script: "node",
      args: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
      max_memory_restart: "512M",
      time: true,
    },
  ],
};
