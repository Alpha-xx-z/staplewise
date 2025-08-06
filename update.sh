#!/bin/bash

# StapleWise Easy Update Script
# Usage: ./update.sh

set -e

echo "🔄 Starting StapleWise Update..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from the StapleWise project directory"
    exit 1
fi

# Pull latest code
print_status "Pulling latest code from GitHub..."
git pull origin main

# Check if there are any changes
if [ $? -eq 0 ]; then
    print_status "Code updated successfully!"
else
    print_warning "No new changes or already up to date"
fi

# Rebuild Docker image
print_status "Rebuilding Docker image..."
docker compose build --no-cache

# Stop current containers
print_status "Stopping current containers..."
docker compose down

# Start with new image
print_status "Starting with updated code..."
docker compose up -d

# Wait a moment for startup
sleep 5

# Check if application is running
print_status "Checking application status..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    print_status "✅ Application updated successfully!"
    print_status "🌐 Your app is running at: https://your-domain.com"
else
    print_error "❌ Application failed to start. Check logs:"
    docker compose logs app
    exit 1
fi

# Show status
print_status "📊 Current status:"
docker compose ps

echo "🎉 Update completed successfully!" 