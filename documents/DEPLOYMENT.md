# 🚀 StapleWise Deployment Guide

This guide provides step-by-step instructions for deploying the StapleWise B2B Cashew Procurement Platform to production using either a VPS or Vercel.

## 📋 Prerequisites

- Node.js 18+ installed
- Git repository access
- Database (PostgreSQL recommended for production)
- MinIO or AWS S3 for file storage
- Domain name (optional but recommended)

## 🏗️ Architecture Overview

```
Frontend (React + Vite) ←→ Backend (Node.js + Express) ←→ Database (PostgreSQL)
                                    ↓
                              File Storage (MinIO/S3)
```

## 🖥️ Option 1: VPS Deployment (Recommended for Full Control)

### Step 1: Server Setup

#### 1.1 Connect to Your VPS
```bash
ssh root@your-vps-ip
```

#### 1.2 Update System
```bash
apt update && apt upgrade -y
```

#### 1.3 Install Required Software
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install PostgreSQL
apt install postgresql postgresql-contrib -y

# Install Nginx
apt install nginx -y

# Install PM2 for process management
npm install -g pm2

# Install Git
apt install git -y
```

#### 1.4 Verify Installations
```bash
node --version
npm --version
psql --version
nginx -v
```

### Step 2: Database Setup

#### 2.1 Configure PostgreSQL
```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE staplewise_prod;
CREATE USER staplewise_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE staplewise_prod TO staplewise_user;
\q
```

#### 2.2 Update Database Configuration
```bash
# Edit the .env file
nano .env
```

Update the database URL:
```env
DATABASE_URL="postgresql://staplewise_user:your_secure_password@localhost:5432/staplewise_prod"
```

### Step 3: Application Setup

#### 3.1 Clone Repository
```bash
cd /var/www
git clone https://github.com/your-username/staplewise.git
cd staplewise
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Environment Configuration
```bash
# Copy and edit environment file
cp .env.example .env
nano .env
```

Required environment variables:
```env
# Database
DATABASE_URL="postgresql://staplewise_user:your_secure_password@localhost:5432/staplewise_prod"

# JWT Secret
JWT_SECRET="your-super-secure-jwt-secret-key-here"

# MinIO Configuration
MINIO_ENDPOINT="your-minio-endpoint"
MINIO_PORT=9000
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
MINIO_USE_SSL=false

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL="https://yourdomain.com"
```

#### 3.4 Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx prisma db seed
```

### Step 4: Build Frontend

#### 4.1 Build for Production
```bash
npm run build
```

#### 4.2 Update Vite Config for Production
Edit `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

### Step 5: Process Management with PM2

#### 5.1 Create PM2 Configuration
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [
    {
      name: 'staplewise-backend',
      script: 'server.ts',
      interpreter: 'npx',
      interpreter_args: 'tsx',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
    },
  ],
}
```

#### 5.2 Start Application
```bash
# Create logs directory
mkdir logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 6: Nginx Configuration

#### 6.1 Create Nginx Site Configuration
```bash
nano /etc/nginx/sites-available/staplewise
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/staplewise/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### 6.2 Enable Site and SSL
```bash
# Enable site
ln -s /etc/nginx/sites-available/staplewise /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Install Certbot for SSL
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Restart Nginx
systemctl restart nginx
```

### Step 7: File Storage Setup (MinIO)

#### 7.1 Install MinIO
```bash
# Download MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio

# Make executable
chmod +x minio

# Move to /usr/local/bin
mv minio /usr/local/bin/

# Create MinIO user
useradd -r minio-user -s /sbin/nologin

# Create data directory
mkdir /opt/minio
chown minio-user:minio-user /opt/minio
```

#### 7.2 Create MinIO Service
```bash
nano /etc/systemd/system/minio.service
```

Add the following:
```ini
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio

[Service]
WorkingDirectory=/usr/local/

User=minio-user
Group=minio-user
ProtectProc=invisible

EnvironmentFile=/etc/default/minio
ExecStart=/usr/local/bin/minio server $MINIO_VOLUMES --console-address ":9001"

# Let systemd restart this service always
Restart=always

# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65536

# Specifies the maximum number of threads this process can create
TasksMax=infinity

# Disable timeout logic and wait until process is stopped
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
```

#### 7.3 Configure MinIO
```bash
# Create environment file
nano /etc/default/minio
```

Add the following:
```bash
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=your-secure-password
MINIO_VOLUMES="/opt/minio"
```

#### 7.4 Start MinIO
```bash
# Start MinIO service
systemctl daemon-reload
systemctl enable minio
systemctl start minio

# Check status
systemctl status minio
```

### Step 8: Monitoring and Maintenance

#### 8.1 Setup Log Rotation
```bash
nano /etc/logrotate.d/staplewise
```

Add the following:
```
/var/www/staplewise/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

#### 8.2 Setup Automatic Backups
```bash
# Create backup script
nano /var/www/staplewise/backup.sh
```

Add the following:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/staplewise"
mkdir -p $BACKUP_DIR

# Database backup
pg_dump staplewise_prod > $BACKUP_DIR/db_backup_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/staplewise

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make executable and add to cron:
```bash
chmod +x /var/www/staplewise/backup.sh
crontab -e
# Add: 0 2 * * * /var/www/staplewise/backup.sh
```

## ☁️ Option 2: Vercel Deployment (Simpler but Limited)

### Step 1: Prepare for Vercel

#### 1.1 Update Package.json
Add build scripts to `package.json`:
```json
{
  "scripts": {
    "build": "vite build",
    "vercel-build": "npm run build"
  }
}
```

#### 1.2 Create Vercel Configuration
Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 2: Database Setup (External)

#### 2.1 Use External Database
- **Option A**: Use a managed PostgreSQL service (e.g., Supabase, Railway, PlanetScale)
- **Option B**: Use your VPS as a database server

#### 2.2 Update Environment Variables
In Vercel dashboard, add these environment variables:
```env
DATABASE_URL="your-external-database-url"
JWT_SECRET="your-jwt-secret"
MINIO_ENDPOINT="your-minio-endpoint"
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
NODE_ENV="production"
```

### Step 3: Deploy to Vercel

#### 3.1 Install Vercel CLI
```bash
npm i -g vercel
```

#### 3.2 Deploy
```bash
# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### 3.3 Configure Custom Domain (Optional)
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Domains
4. Add your custom domain
5. Update DNS records as instructed

## 🔧 Post-Deployment Checklist

### Security
- [ ] Change default passwords
- [ ] Enable firewall (UFW)
- [ ] Setup SSL certificates
- [ ] Configure security headers
- [ ] Regular security updates

### Monitoring
- [ ] Setup application monitoring (PM2 + PM2 Plus)
- [ ] Configure error tracking (Sentry)
- [ ] Setup uptime monitoring
- [ ] Configure log aggregation

### Performance
- [ ] Enable gzip compression
- [ ] Configure CDN (Cloudflare)
- [ ] Optimize images
- [ ] Setup caching strategies

### Backup
- [ ] Database backup automation
- [ ] File storage backup
- [ ] Application backup
- [ ] Test restore procedures

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check PostgreSQL status
systemctl status postgresql

# Check connection
psql -h localhost -U staplewise_user -d staplewise_prod
```

#### 2. Application Not Starting
```bash
# Check PM2 logs
pm2 logs staplewise-backend

# Check application logs
tail -f /var/www/staplewise/logs/combined.log
```

#### 3. Nginx Issues
```bash
# Check Nginx status
systemctl status nginx

# Check Nginx logs
tail -f /var/log/nginx/error.log
```

#### 4. MinIO Issues
```bash
# Check MinIO status
systemctl status minio

# Check MinIO logs
journalctl -u minio -f
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_queries_user_id ON queries(user_id);
```

#### 2. Application Optimization
```bash
# Enable PM2 clustering
pm2 start ecosystem.config.js -i max

# Monitor performance
pm2 monit
```

## 📞 Support

For deployment issues:
1. Check the logs: `pm2 logs` or `systemctl status`
2. Verify environment variables
3. Test database connectivity
4. Check firewall settings
5. Verify SSL certificate

## 🔄 Updates and Maintenance

### Regular Updates
```bash
# Update application
cd /var/www/staplewise
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart all

# Update system
apt update && apt upgrade -y
```

### Monitoring Commands
```bash
# Check application status
pm2 status

# Monitor resources
htop

# Check disk space
df -h

# Check memory usage
free -h
```

---

**Note**: This deployment guide assumes a Linux-based VPS. Adjust commands for your specific server environment. Always test in a staging environment before deploying to production. 