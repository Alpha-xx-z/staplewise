# 🐳 Docker Setup & Git Deployment Guide

This guide walks you through the complete process from Docker installation to deploying your StapleWise application to production.

## 🎯 **Quick Overview**

1. **Install Docker** → Set up environment
2. **Prepare Code** → Test locally with Docker
3. **Push to Git** → Upload to GitHub
4. **Deploy to VPS** → Run on production server
5. **Update Process** → Easy future updates

---

## 📋 **Prerequisites**

Before starting, ensure you have:
- ✅ **Docker & Docker Compose** installed
- ✅ **Git** repository set up
- ✅ **VPS** with SSH access
- ✅ **Domain name** (optional but recommended)

---

## 🔧 **Step 1: Install Docker & Docker Compose**

### **On macOS:**
```bash
# Install Docker Desktop
brew install --cask docker

# Or download from: https://www.docker.com/products/docker-desktop
```

### **On Ubuntu/Debian:**
```bash
# Update system
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
```

### **On Windows:**
```bash
# Download Docker Desktop from:
# https://www.docker.com/products/docker-desktop
```

### **Verify Installation:**
```bash
# Check Docker
docker --version
docker-compose --version

# Test Docker
docker run hello-world
```

---

## 🏗️ **Step 2: Prepare Your Project for Docker**

### **2.1: Ensure Docker Files Exist**
Your project should have these files:
```bash
# Check if files exist
ls -la | grep -E "(Dockerfile|docker-compose|\.dockerignore)"
```

**Required Files:**
- ✅ `Dockerfile` - Builds your application
- ✅ `docker-compose.yml` - Orchestrates services
- ✅ `.dockerignore` - Excludes unnecessary files
- ✅ `.env` - Environment variables

### **2.2: Test Docker Build Locally**
```bash
# Build the Docker image
docker compose build

# Check if build was successful
docker images | grep staplewise
```

### **2.3: Test Docker Run Locally**
```bash
# Start the application
docker compose up -d

# Check if it's running
docker compose ps

# Test the application
curl http://localhost:3000/api/health

# View logs
docker compose logs app
```

### **2.4: Stop Local Docker**
```bash
# Stop the application
docker compose down
```

---

## 📤 **Step 3: Prepare Git Repository**

### **3.1: Initialize Git (if not already done)**
```bash
# Initialize Git repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit with Docker setup"
```

### **3.2: Create GitHub Repository**
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `staplewise`
4. Make it **Private** (recommended)
5. Don't initialize with README (you already have one)

### **3.3: Connect Local to GitHub**
```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/staplewise.git

# Push to GitHub
git push -u origin main
```

### **3.4: Verify GitHub Upload**
```bash
# Check remote
git remote -v

# Check status
git status
```

---

## 🚀 **Step 4: Deploy to VPS**

### **4.1: SSH to Your VPS**
```bash
# Connect to your VPS
ssh root@YOUR_VPS_IP

# Update system
apt update && apt upgrade -y
```

### **4.2: Install Docker on VPS**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### **4.3: Clone Your Repository**
```bash
# Create project directory
mkdir -p /var/www
cd /var/www

# Clone your repository
git clone https://github.com/YOUR_USERNAME/staplewise.git
cd staplewise

# Check files
ls -la
```

### **4.4: Set Up Environment Variables**
```bash
# Copy environment template
cp env.production.example .env

# Edit environment file
nano .env
```

**Required Environment Variables:**
```bash
# Database
DATABASE_URL="mysql://staplewise_user:your_password@localhost:3306/Staplewise"
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_USER=staplewise_user
MYSQL_PASSWORD=your_secure_password

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# MinIO (File Storage)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=your_minio_access_key
MINIO_SECRET_KEY=your_minio_secret_key

# Production
NODE_ENV=production
PORT=3000
```

### **4.5: Set Up Database**
```bash
# Install MySQL
apt install mysql-server -y

# Secure MySQL installation
mysql_secure_installation

# Create database and user
mysql -u root -p
```

**MySQL Commands:**
```sql
CREATE DATABASE Staplewise;
CREATE USER 'staplewise_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON Staplewise.* TO 'staplewise_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### **4.6: Set Up MinIO (File Storage)**
```bash
# Install MinIO
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio
mv minio /usr/local/bin/

# Create MinIO user
useradd -r minio-user -s /sbin/nologin

# Create data directory
mkdir -p /opt/minio/data
chown minio-user:minio-user /opt/minio/data

# Create MinIO service
nano /etc/systemd/system/minio.service
```

**MinIO Service File:**
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

ExecStart=/usr/local/bin/minio server /opt/minio/data --console-address ":9001"

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

**Start MinIO:**
```bash
# Start MinIO
systemctl daemon-reload
systemctl enable minio
systemctl start minio

# Check status
systemctl status minio
```

### **4.7: Build and Deploy Application**
```bash
# Build Docker image
docker compose build

# Start application
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs app
```

### **4.8: Set Up Nginx (Reverse Proxy)**
```bash
# Install Nginx
apt install nginx -y

# Create Nginx configuration
nano /etc/nginx/sites-available/staplewise
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
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
```

**Enable Site:**
```bash
# Enable site
ln -s /etc/nginx/sites-available/staplewise /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### **4.9: Set Up SSL Certificate**
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
certbot renew --dry-run
```

---

## 🔄 **Step 5: Set Up Update Process**

### **5.1: Create Update Scripts**
```bash
# Make scripts executable
chmod +x update.sh
chmod +x quick-update.sh
```

### **5.2: Test Update Process**
```bash
# Test the update script
./update.sh
```

### **5.3: Set Up Automated Backups**
```bash
# Create backup script
nano /root/backup.sh
```

**Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup"
mkdir -p $BACKUP_DIR

# Database backup
mysqldump Staplewise > $BACKUP_DIR/staplewise_db_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/staplewise_app_$DATE.tar.gz /var/www/staplewise

# Keep only last 7 days
find $BACKUP_DIR -name "staplewise_*" -mtime +7 -delete

echo "Backup completed: $DATE"
```

**Set Up Automated Backups:**
```bash
# Make executable
chmod +x /root/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /root/backup.sh") | crontab -
```

---

## ✅ **Step 6: Verify Deployment**

### **6.1: Test Application**
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test from outside
curl https://your-domain.com/api/health
```

### **6.2: Test Key Features**
- ✅ **Website loads** - Visit your domain
- ✅ **User registration** - Create test account
- ✅ **Login works** - Test authentication
- ✅ **File uploads** - Test MinIO integration
- ✅ **Email sending** - Test password reset

### **6.3: Monitor Application**
```bash
# Check container status
docker compose ps

# View resource usage
docker stats

# Monitor logs
docker compose logs -f app
```

---

## 🚀 **Step 7: Future Updates**

### **7.1: Make Changes Locally**
```bash
# Make your code changes
# Test locally
npm run dev
docker compose build
docker compose up -d
```

### **7.2: Push to GitHub**
```bash
# Commit changes
git add .
git commit -m "Added new feature"
git push origin main
```

### **7.3: Update Production**
```bash
# SSH to VPS
ssh root@YOUR_VPS_IP

# Navigate to project
cd /var/www/staplewise

# Update application
./update.sh
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **Docker Build Fails**
   ```bash
   # Check Dockerfile syntax
   docker build -t test .
   
   # Check disk space
   df -h
   ```

2. **Application Won't Start**
   ```bash
   # Check logs
   docker compose logs app
   
   # Check environment variables
   cat .env
   ```

3. **Database Connection Issues**
   ```bash
   # Test MySQL connection
   mysql -u staplewise_user -p Staplewise
   
   # Check MySQL status
   systemctl status mysql
   ```

4. **Nginx Issues**
   ```bash
   # Check Nginx configuration
   nginx -t
   
   # Check Nginx status
   systemctl status nginx
   ```

---

## 📊 **Monitoring Commands**

### **Essential Commands:**
```bash
# Application status
docker compose ps
docker compose logs app

# System resources
docker stats
htop

# Database status
systemctl status mysql
mysql -u root -p -e "SHOW PROCESSLIST;"

# File storage
systemctl status minio
ls -la /opt/minio/data
```

### **Health Checks:**
```bash
# Application health
curl http://localhost:3000/api/health

# Database health
mysql -u staplewise_user -p -e "SELECT 1;"

# MinIO health
curl http://localhost:9000/minio/health/live
```

---

## 🎉 **Success Checklist**

After deployment, verify:

- [ ] **Docker containers running** - `docker compose ps`
- [ ] **Application accessible** - Visit your domain
- [ ] **Health endpoint working** - `curl /api/health`
- [ ] **Database connected** - User registration works
- [ ] **File uploads working** - Test image upload
- [ ] **Email sending** - Test password reset
- [ ] **SSL certificate** - HTTPS working
- [ ] **Backups running** - Check backup directory
- [ ] **Update process** - Test `./update.sh`

---

## 📞 **Support**

### **If Something Goes Wrong:**
1. **Check logs** - `docker compose logs app`
2. **Check status** - `docker compose ps`
3. **Restart services** - `docker compose restart`
4. **Rebuild** - `docker compose build --no-cache`

### **Emergency Contacts:**
- **VPS Provider** - For server access issues
- **Domain Provider** - For DNS issues
- **GitHub Support** - For repository issues

**Your StapleWise application is now fully deployed with Docker! 🚀** 