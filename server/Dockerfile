FROM oven/bun:1 AS base
WORKDIR /app

COPY package.json ./
RUN bun install --frozen-lockfile --production 2>/dev/null || true

COPY src/ ./src/

RUN mkdir -p /app/data

EXPOSE 4567
CMD ["bun", "src/index.ts"]
