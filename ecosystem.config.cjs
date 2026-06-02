// PM2 process config for AXISPERP ($AXPERP) landing page.
// Serves the bundled single-page app via Bun on port 3018.
//   pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "axisperp",
      script: "/home/indra/.bun/bin/bun",
      args: "serve.ts",
      interpreter: "none",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3018",
      },
      autorestart: true,
      max_restarts: 10,
    },
  ],
};
