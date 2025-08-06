# GENERAL: Complete Project Deployment Guide

## 📋 **Overview**

This document provides a comprehensive guide for deploying any Node.js/React project to a VPS using Docker, Nginx, and modern DevOps practices. This guide is based on the StapleWise project but can be adapted for any similar application.

## 🎯 **Prerequisites**

### **Required Tools**
- **Local Machine**: Git, Docker, Node.js, npm
- **VPS**: Ubuntu 22.04+ with root access
- **Domain**: Optional (for SSL and professional setup)
- **Email Service**: For password reset functionality

### **Project Structure**
```
project/
├── src/                    # Frontend source code
├── server.ts              # Backend server
├── package.json           # Dependencies
├── Dockerfile             # Container configuration
├── docker-compose.yml     # Container orchestration
├── .env                   # Environment variables
├── prisma/                # Database schema
└── documents/             # Documentation
```

## 🚀 **Step-by-Step Deployment Process**

### **Phase 1: Local Development Setup**

#### **1.1 Project Preparation**
```bash
# Clone your project
git clone <your-repo-url>
cd <project-name>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

#### **1.2 Docker Configuration**
```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npx prisma generate
RUN mkdir -p logs
EXPOSE 3000
CMD ["npx", "tsx", "server.ts"]
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
    restart: always
EOF

# Create .dockerignore
cat > .dockerignore << 'EOF'
node_modules
dist
.env
.git
.gitignore
README.md
*.log
logs/
backup/
.DS_Store
.vscode/
.idea/
coverage/
.nyc_output/
EOF
```

#### **1.3 Environment Variables**
```bash
# Create .env file
cat > .env << 'EOF'
# Database
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Email (for password reset)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# File Storage (MinIO)
MINIO_ENDPOINT="your-server-ip"
MINIO_PORT=9000
MINIO_ACCESS_KEY="your-access-key"
MINIO_SECRET_KEY="your-secret-key"
MINIO_USE_SSL=false
MINIO_BUCKET_DOCUMENTS="your-documents-bucket"
MINIO_BUCKET_IMAGES="your-images-bucket"
MINIO_PUBLIC_URL="http://your-server-ip:9000"

# Application
PORT=3000
NODE_ENV=production
EOF
```

### **Phase 2: VPS Setup**

#### **2.1 Initial VPS Configuration**
```bash
# SSH to your VPS
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

#### **2.2 Docker Installation**
```bash
# Install Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Verify installation
docker --version
docker-compose --version
```

#### **2.3 Database Setup (MySQL)**
```bash
# Install MySQL
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation

# Create database and user
mysql -u root -p
```

```sql
CREATE DATABASE your_database_name;
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### **2.4 File Storage Setup (MinIO)**
```bash
# Download and install MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
mv minio /usr/local/bin/

# Create MinIO user
useradd -r minio-user -s /sbin/nologin

# Create data directory
mkdir -p /mnt/data/minio
chown minio-user:minio-user /mnt/data/minio

# Create MinIO service
cat > /etc/systemd/system/minio.service << 'EOF'
[Unit]
Description=MinIO
After=network.target

[Service]
User=minio-user
Group=minio-user
ExecStart=/usr/local/bin/minio server /mnt/data/minio --console-address ":9001"
Environment="MINIO_ROOT_USER=your-minio-user"
Environment="MINIO_ROOT_PASSWORD=your-minio-password"

[Install]
WantedBy=multi-user.target
EOF

# Start MinIO
systemctl daemon-reload
systemctl enable minio
systemctl start minio

# Verify MinIO is running
systemctl status minio
```

### **Phase 3: Application Deployment**

#### **3.1 Deploy Application**
```bash
# Create application directory
mkdir -p /var/www/your-project
cd /var/www/your-project

# Clone your repository
git clone <your-repo-url> .

# Copy environment file
cp .env.example .env
# Edit .env with production values
nano .env

# Build and start application
docker-compose build --no-cache
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs app
```

#### **3.2 Database Migration**
```bash
# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Generate Prisma client
docker-compose exec app npx prisma generate

# Seed database (if needed)
docker-compose exec app npx prisma db seed
```

### **Phase 4: Nginx Configuration**

#### **4.1 Install and Configure Nginx**
```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
cat > /etc/nginx/sites-available/your-project << 'EOF'
server {
    listen 80;
    server_name your-server-ip;  # Replace with your domain later
    
    # Serve static files (frontend)
    location / {
        root /var/www/your-project/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to backend
    location /api/ {
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
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/your-project /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx
```

### **Phase 5: Frontend Build and Deployment**

#### **5.1 Build Frontend**
```bash
# Navigate to project directory
cd /var/www/your-project

# Build frontend
npm run build

# Verify build output
ls -la dist/
```

#### **5.2 Update Nginx for Static Files**
```bash
# Update Nginx configuration to serve static files
# (Already done in Phase 4)

# Test the setup
curl http://your-server-ip
curl http://your-server-ip/api/health
```

### **Phase 6: SSL Certificate (Optional)**

#### **6.1 Install Certbot**
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (when domain is available)
certbot --nginx -d your-domain.com

# Test automatic renewal
certbot renew --dry-run
```

### **Phase 7: Security and Monitoring**

#### **7.1 Firewall Configuration**
```bash
# Install UFW
apt install -y ufw

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80
ufw allow 443
ufw deny 3000  # Block direct access to app port

# Enable firewall
ufw enable
```

#### **7.2 Monitoring Setup**
```bash
# Create monitoring script
cat > /root/monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory: $(free -h | grep Mem)"
echo "Disk: $(df -h / | tail -1)"

echo -e "\n=== Docker Status ==="
cd /var/www/your-project && docker-compose ps

echo -e "\n=== Application Health ==="
curl -s http://localhost:3000/api/health || echo "App not responding"

echo -e "\n=== Nginx Status ==="
systemctl status nginx --no-pager

echo -e "\n=== External Access ==="
curl -s http://your-server-ip/api/health || echo "External access failed"
EOF

chmod +x /root/monitor.sh

# Add to crontab (run every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /root/monitor.sh >> /var/log/monitor.log 2>&1") | crontab -
```

#### **7.3 Backup Strategy**
```bash
# Create backup script
cat > /root/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u your_username -p'your_password' your_database > $BACKUP_DIR/db_backup_$DATE.sql

# Backup application files
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz /var/www/your-project

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /root/backup.sh

# Add to crontab (daily backup at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup.sh") | crontab -
```

## 🔧 **Update Process**

### **Quick Update Script**
```bash
# Create update script
cat > /root/update.sh << 'EOF'
#!/bin/bash
echo "🔄 Updating application..."

cd /var/www/your-project

# Pull latest changes
git pull origin main

# Rebuild application
docker-compose build --no-cache
docker-compose down
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Build frontend
npm run build

# Restart Nginx
systemctl restart nginx

echo "✅ Update completed!"
EOF

chmod +x /root/update.sh
```

### **Manual Update Process**
```bash
# SSH to VPS
ssh root@your-server-ip

# Navigate to project
cd /var/www/your-project

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build --no-cache
docker-compose down
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Build frontend
npm run build

# Restart Nginx
systemctl restart nginx
```

## 🔍 **Troubleshooting**

### **Common Issues and Solutions**

#### **Issue: Application not starting**
```bash
# Check Docker logs
docker-compose logs app

# Check if port is in use
lsof -i :3000

# Check environment variables
docker-compose exec app env | grep -E "(DATABASE|JWT|MINIO)"
```

#### **Issue: Database connection failed**
```bash
# Check MySQL status
systemctl status mysql

# Test database connection
mysql -u your_username -p -h localhost your_database

# Check database URL in .env
cat .env | grep DATABASE_URL
```

#### **Issue: MinIO connection failed**
```bash
# Check MinIO status
systemctl status minio

# Test MinIO access
curl http://localhost:9000/minio/health/live

# Check MinIO credentials
cat .env | grep MINIO
```

#### **Issue: Nginx not serving files**
```bash
# Check Nginx status
systemctl status nginx

# Check Nginx configuration
nginx -t

# Check Nginx logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

## 📊 **Performance Optimization**

### **Nginx Optimization**
```nginx
# Add to Nginx configuration
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
location /api/ {
    limit_req zone=api burst=20 nodelay;
    # ... existing proxy configuration
}
```

### **Docker Optimization**
```bash
# Clean up Docker
docker system prune -f
docker volume prune -f

# Monitor resource usage
docker stats
```

## 🛡️ **Security Checklist**

### **Essential Security Measures**
- [ ] Change default SSH port
- [ ] Use SSH keys instead of passwords
- [ ] Configure firewall (UFW)
- [ ] Keep system updated
- [ ] Use strong passwords
- [ ] Enable SSL certificate
- [ ] Regular backups
- [ ] Monitor logs
- [ ] Use environment variables for secrets
- [ ] Never commit .env files

### **Security Commands**
```bash
# Generate strong passwords
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 64

# Check for open ports
netstat -tlnp

# Check running services
systemctl list-units --type=service --state=running
```

## 📚 **Best Practices**

### **Development**
1. **Use environment variables** for all configuration
2. **Never commit secrets** to version control
3. **Use Docker** for consistent environments
4. **Implement proper logging**
5. **Add health checks** to your application

### **Deployment**
1. **Use reverse proxy** (Nginx) for production
2. **Enable SSL** for security
3. **Set up monitoring** and alerts
4. **Implement backup strategy**
5. **Use CI/CD** for automated deployments

### **Maintenance**
1. **Regular updates** of system and dependencies
2. **Monitor logs** for issues
3. **Regular backups** and testing
4. **Performance monitoring**
5. **Security audits**

## 🎯 **Final Checklist**

### **Pre-Deployment**
- [ ] All environment variables configured
- [ ] Database schema ready
- [ ] File storage configured
- [ ] Email service configured
- [ ] Docker configuration tested locally

### **Deployment**
- [ ] VPS prepared with Docker
- [ ] Database installed and configured
- [ ] File storage (MinIO) installed
- [ ] Application deployed and running
- [ ] Nginx configured and working
- [ ] Frontend built and served
- [ ] SSL certificate installed (optional)

### **Post-Deployment**
- [ ] All features tested
- [ ] Monitoring configured
- [ ] Backup strategy implemented
- [ ] Security measures in place
- [ ] Documentation updated

---

**This guide provides a complete framework for deploying any Node.js/React application to production. Adapt the configuration and commands according to your specific project requirements.** 