#!/bin/bash

# Super Quick Update - For minor changes
echo "⚡ Quick Update..."

git pull origin main
docker compose build
docker compose up -d

echo "✅ Quick update done!" 