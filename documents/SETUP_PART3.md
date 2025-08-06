# SETUP PART 3: Nginx Configuration and Production Access

## 📋 **Overview**

This document details the complete process of setting up Nginx as a reverse proxy for the StapleWise application, making it accessible on port 80 (standard HTTP port) instead of port 3000. This is a crucial step for production deployment.

## 🎯 **Objective**

- **Before**: Application accessible only on `http://31.97.229.127:3000`
- **After**: Application accessible on `http://31.97.229.127` (port 80)

## 🚀 **The Setup Process**

### **Step 1: Installing Nginx**
```bash
# Update package list and install Nginx
apt update && apt install -y nginx
```

**What this does:**
- Updates the system package list
- Installs Nginx web server
- Sets up Nginx as a system service

### **Step 2: Creating Nginx Configuration**
```bash
cat > /etc/nginx/sites-available/staplewise << 'EOF'
server {
    listen 80;
    server_name 31.97.229.127;
    
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
EOF
```

**Configuration Explanation:**
- `listen 80`: Nginx listens on port 80 (standard HTTP port)
- `server_name 31.97.229.127`: Server name (can be changed to domain later)
- `proxy_pass http://localhost:3000`: Forwards requests to the Node.js app
- `proxy_set_header`: Sets proper headers for the proxy connection
- `proxy_http_version 1.1`: Uses HTTP/1.1 for better performance
- `proxy_set_header Upgrade/Connection`: Enables WebSocket support

### **Step 3: Enabling the Site**
```bash
# Enable the StapleWise site
ln -sf /etc/nginx/sites-available/staplewise /etc/nginx/sites-enabled/

# Remove default Nginx site
rm -f /etc/nginx/sites-enabled/default
```

**What this does:**
- Creates a symbolic link to enable the site
- Removes the default Nginx welcome page
- Ensures only our application is served

### **Step 4: Testing and Restarting**
```bash
# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx

# Enable Nginx to start on boot
systemctl enable nginx
```

**What this does:**
- `nginx -t`: Tests configuration syntax
- `systemctl restart nginx`: Applies new configuration
- `systemctl enable nginx`: Ensures Nginx starts on system boot

### **Step 5: Testing the Setup**
```bash
# Test the application access
curl http://31.97.229.127/api/health
```

**Expected Response:**
```json
{"status":"OK","timestamp":"2025-08-06T15:42:42.297Z"}
```

## ✅ **Successful Results**

### **Before Nginx Setup**
- Application only accessible on port 3000
- Required `:3000` in URL
- Not production-ready

### **After Nginx Setup**
- Application accessible on standard port 80
- Clean URLs without port numbers
- Production-ready configuration

### **Final Status**
```
✅ Nginx installed and running
✅ StapleWise site enabled
✅ Default site removed
✅ Application accessible on port 80
✅ Health checks working
✅ Production-ready setup
```

## 🔧 **Nginx Configuration Details**

### **Full Configuration File**
```nginx
server {
    listen 80;
    server_name 31.97.229.127;
    
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

### **Header Explanations**
- `Host $host`: Preserves the original host header
- `X-Real-IP $remote_addr`: Passes the real client IP
- `X-Forwarded-For $proxy_add_x_forwarded_for`: Maintains IP forwarding chain
- `X-Forwarded-Proto $scheme`: Preserves the original protocol (http/https)
- `Upgrade/Connection`: Enables WebSocket support for real-time features

## 🔍 **Troubleshooting Commands**

### **Useful Commands for Debugging**
```bash
# Check Nginx status
systemctl status nginx

# Check Nginx error logs
tail -f /var/log/nginx/error.log

# Check Nginx access logs
tail -f /var/log/nginx/access.log

# Test Nginx configuration
nginx -t

# Check if port 80 is listening
netstat -tlnp | grep :80

# Test application directly
curl http://localhost:3000/api/health

# Test through Nginx
curl http://localhost/api/health

# Test external access
curl http://31.97.229.127/api/health
```

### **Common Issues and Solutions**

#### **Issue: Nginx not starting**
```bash
# Check configuration syntax
nginx -t

# Check error logs
tail -f /var/log/nginx/error.log

# Restart Nginx
systemctl restart nginx
```

#### **Issue: Application not accessible**
```bash
# Check if application is running
cd /var/www/staplewise
docker-compose ps

# Check application logs
docker-compose logs app

# Test direct access
curl http://localhost:3000/api/health
```

#### **Issue: Port 80 already in use**
```bash
# Check what's using port 80
lsof -i :80

# Stop conflicting service
systemctl stop apache2  # if Apache is running
```

## 🚀 **Next Steps After Nginx Setup**

### **1. SSL Certificate Setup (Recommended)**
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (when domain is available)
certbot --nginx -d your-domain.com
```

### **2. Domain Configuration**
```bash
# Update Nginx configuration with domain
sed -i 's/server_name 31.97.229.127;/server_name your-domain.com;/' /etc/nginx/sites-available/staplewise

# Test and restart
nginx -t && systemctl restart nginx
```

### **3. Security Hardening**
```bash
# Configure firewall
ufw allow 80
ufw allow 443
ufw deny 3000  # Block direct access to app port

# Set up rate limiting
# Add to Nginx configuration:
# limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

### **4. Performance Optimization**
```bash
# Enable gzip compression
# Add to Nginx configuration:
# gzip on;
# gzip_types text/plain text/css application/json application/javascript;
```

## 📊 **Monitoring and Maintenance**

### **Basic Monitoring Script**
```bash
cat > /root/monitor.sh << 'EOF'
#!/bin/bash
echo "=== System Status ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo "Memory: $(free -h | grep Mem)"
echo "Disk: $(df -h / | tail -1)"

echo -e "\n=== Docker Status ==="
cd /var/www/staplewise && docker-compose ps

echo -e "\n=== Application Health ==="
curl -s http://localhost:3000/api/health || echo "App not responding"

echo -e "\n=== Nginx Status ==="
systemctl status nginx --no-pager

echo -e "\n=== External Access ==="
curl -s http://31.97.229.127/api/health || echo "External access failed"
EOF

chmod +x /root/monitor.sh
```

### **Log Rotation**
```bash
# Configure log rotation for Nginx
cat > /etc/logrotate.d/nginx << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 640 nginx nginx
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
EOF
```

## 🎯 **Final Status**

### **Production-Ready Setup**
✅ **Application accessible on standard port 80**
✅ **Nginx reverse proxy configured**
✅ **Health checks working**
✅ **System service enabled**
✅ **Ready for SSL certificate**
✅ **Ready for domain configuration**

### **Access URLs**
- **Main Application**: `http://31.97.229.127`
- **API Health**: `http://31.97.229.127/api/health`
- **MinIO Console**: `http://31.97.229.127:9001` (if needed)

## 📚 **Key Learnings**

### **1. Reverse Proxy Benefits**
- **Security**: Hides internal application structure
- **Performance**: Can add caching and compression
- **Flexibility**: Easy to add SSL, load balancing, etc.
- **Standard Ports**: Uses standard HTTP/HTTPS ports

### **2. Nginx Configuration Best Practices**
- Always test configuration before restarting
- Use proper headers for proxy connections
- Enable WebSocket support for real-time features
- Set up proper logging and monitoring

### **3. Production Deployment**
- Use reverse proxy for production applications
- Configure proper headers for security
- Set up monitoring and logging
- Plan for SSL and domain configuration

## 🔄 **Documentation Updates**

This setup has been documented in:
- `documents/SETUP_PART1.md` - Main deployment guide
- `documents/SETUP_PART2.md` - MinIO configuration fix
- `documents/INDEX.md` - Documentation index

---

**Date**: August 6, 2025  
**Setup**: Nginx Reverse Proxy Configuration  
**Status**: ✅ COMPLETED  
**Impact**: Production-ready application access  
**Result**: Application accessible on port 80 with proper proxy configuration 