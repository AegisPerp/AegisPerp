#!/bin/bash
set -e

echo "Deploying AEGISPERP..."

git pull origin main

docker compose build --no-cache
docker compose up -d

sleep 5
curl -s https://aegisperp.fun > /dev/null && echo "Frontend live" || echo "Frontend down"
curl -s https://api.aegisperp.fun/api/stats > /dev/null && echo "Backend live" || echo "Backend down"

echo "Deploy complete"
