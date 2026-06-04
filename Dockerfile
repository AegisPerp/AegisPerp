FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

COPY src/ ./src/
COPY server/ ./server/
COPY postcss.config.js ./

EXPOSE 3018
CMD ["bun", "src/index.ts"]
