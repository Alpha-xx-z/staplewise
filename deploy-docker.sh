#!/bin/bash

# StapleWise Docker Production Deployment Script
# Usage: ./deploy-docker.sh

set -e

echo "🚀 Starting StapleWise Docker Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root (use sudo)"
    exit 1
fi

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Docker
print_status "Installing Docker..."
apt install -y docker.io docker-compose

# Enable Docker service
print_status "Enabling Docker service..."
systemctl enable docker
systemctl start docker

# Add user to docker group
print_status "Adding user to docker group..."
usermod -aG docker $USER

# Install Nginx
print_status "Installing Nginx..."
apt install nginx -y

# Install Certbot
print_status "Installing Certbot..."
apt install certbot python3-certbot-nginx -y

# Install Git
print_status "Installing Git..."
apt install git -y

# Create application directory
print_status "Setting up application directory..."
mkdir -p /var/www
cd /var/www

# Clone repository (update with your actual repo URL)
if [ ! -d "staplewise" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/your-username/staplewise.git
fi

cd staplewise

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Please create it from env.production.example"
    print_status "Creating .env file from template..."
    cp env.production.example .env
    print_warning "Please edit .env file with your production values"
    nano .env
fi

# Build and start Docker application
print_status "Building Docker application..."
docker compose build

print_status "Starting Docker application..."
docker compose up -d

# Wait for application to start
print_status "Waiting for application to start..."
sleep 10

# Test application
print_status "Testing application..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    print_status "Application is running successfully!"
else
    print_error "Application failed to start. Check logs with: docker compose logs app"
    exit 1
fi

# Create Nginx configuration
print_status "Configuring Nginx..."
cat > /etc/nginx/sites-available/staplewise << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    location /health {
        proxy_pass http://localhost:3000/api/health;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/staplewise /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Setup firewall
print_status "Configuring firewall..."
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Create backup script
print_status "Setting up backup system..."
cat > /root/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
mkdir -p $BACKUP_DIR

# Database backup (using .my.cnf for credentials)
mysqldump Staplewise > $BACKUP_DIR/staplewise_db_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/staplewise_app_$DATE.tar.gz /var/www/staplewise

# Keep only last 7 days of backups
find $BACKUP_DIR -name "staplewise_*" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

# Create MySQL credentials file for automated backups
print_status "Setting up MySQL credentials for automated backups..."
cat > /root/.my.cnf << 'EOF'
[client]
user=staplewise_user
password=your_secure_mysql_password
EOF

# Secure the credentials file
chmod 600 /root/.my.cnf

chmod +x /root/backup.sh

# Add backup to crontab
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup.sh") | crontab -

print_status "Deployment completed successfully!"
print_warning "Please complete the following manual steps:"
echo "1. Update your domain DNS to point to this server"
echo "2. Update .env file with production values"
echo "3. Update MySQL password in /root/.my.cnf for automated backups"
echo "4. Get SSL certificate: certbot --nginx -d your-domain.com"
echo "5. Test all functionality"

print_status "Docker Status:"
docker compose ps

print_status "Nginx Status:"
systemctl status nginx --no-pager -l

print_status "Application Health:"
curl -s http://localhost:3000/api/health

echo "🎉 Docker deployment script completed!"
echo "Your application is now running at: http://your-domain.com" 