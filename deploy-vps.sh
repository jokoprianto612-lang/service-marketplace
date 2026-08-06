#!/bin/bash
# Service Marketplace - VPS Deployment Script
# Run this on your VPS after cloning the repo

set -e

echo "🚀 Service Marketplace VPS Deployment"
echo "====================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo "⚠️  Don't run as root. Create a deploy user instead."
  exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
  echo "📦 Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  sudo usermod -aG docker $USER
  echo "⚠️  Log out and back in for Docker group to take effect"
  exit 1
fi

if ! command -v docker compose &> /dev/null; then
  echo "📦 Installing Docker Compose..."
  sudo apt-get update && sudo apt-get install -y docker-compose-plugin
fi

# Clone repo if not exists
if [ ! -d "service-marketplace" ]; then
  echo "📥 Cloning repository..."
  git clone https://github.com/jokoprianto612-lang/service-marketplace.git
fi

cd service-marketplace

# Pull latest
echo "🔄 Pulling latest changes..."
git pull

# Check .env
if [ ! -f ".env" ]; then
  echo "📝 Creating .env from template..."
  cp .env.production.example .env
  echo ""
  echo "⚠️  EDIT .env WITH YOUR VALUES BEFORE CONTINUING!"
  echo "   nano .env"
  echo ""
  read -p "Press Enter after editing .env..."
fi

# Load env
set -a
source .env
set +a

# Validate required vars
required_vars=("POSTGRES_PASSWORD" "JWT_SECRET" "FRONTEND_URL" "APP_URL" "LETSENCRYPT_EMAIL" "DOMAIN")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing required env var: $var"
    exit 1
  fi
done

# Pull images
echo "📥 Pulling Docker images..."
docker compose -f docker/docker-compose.prod.yml pull

# Build server image (if building locally instead of using Docker Hub)
# docker compose -f docker/docker-compose.prod.yml build server

# Start services
echo "🚀 Starting services..."
docker compose -f docker/docker-compose.prod.yml up -d

# Wait for health
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Run migrations
echo "🗄️ Running database migrations..."
docker compose -f docker/docker-compose.prod.yml exec -T server npx prisma migrate deploy

# Check status
echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
docker compose -f docker/docker-compose.prod.yml ps
echo ""
echo "🌐 Frontend: https://$DOMAIN"
echo "🔌 API: https://$DOMAIN/api/v1"
echo "📊 Traefik Dashboard: https://traefik.$DOMAIN"
echo ""
echo "📝 Logs: docker compose -f docker/docker-compose.prod.yml logs -f"