// PM2 process config for AEGISPERP ($AGPERP) landing page.
// Serves the bundled single-page app via Bun on port 3007.
//   pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "aegisperp",
      script: "/home/indra/.bun/bin/bun",
      args: "static.ts",
      interpreter: "none",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3007",
      },
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
