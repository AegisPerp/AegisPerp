// PM2 process config for HyperPerp ($Hyperp) landing page.
// Serves the bundled single-page app via Bun on port 3002.
//   pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "hyperperp",
      script: "/home/indra/.bun/bin/bun",
      args: "serve.ts",
      interpreter: "none",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3002",
      },
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
