# 🔄 Code Updates & Deployment Guide

This guide explains how to easily update your StapleWise application after deployment.

## 🎯 **Quick Overview**

After your initial deployment, updating your application is simple:

1. **Make changes locally** → Test
2. **Push to GitHub** → `git push origin main`
3. **SSH to VPS** → Run update script
4. **Done!** → Your app is updated

---

## 📋 **Update Methods**

### **Method 1: Full Update (Recommended)**
```bash
# On your VPS
cd /var/www/staplewise
./update.sh
```

**Best for:** Major changes, new features, database updates

### **Method 2: Quick Update**
```bash
# On your VPS
cd /var/www/staplewise
./quick-update.sh
```

**Best for:** Minor changes, text updates, styling fixes

### **Method 3: Manual Update**
```bash
# On your VPS
cd /var/www/staplewise
git pull origin main
docker compose build
docker compose up -d
```

**Best for:** When you need more control

---

## 🔄 **Complete Update Workflow**

### **Step 1: Make Changes Locally**
```bash
# Make your code changes
# Test locally
npm run dev

# Check everything works
curl http://localhost:3000/api/health
```

### **Step 2: Commit and Push**
```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "Added order details modal and pagination"

# Push to GitHub
git push origin main
```

### **Step 3: Update Production**
```bash
# SSH into your VPS
ssh root@your-vps-ip

# Navigate to project directory
cd /var/www/staplewise

# Run the update script
./update.sh
```

---

## 📁 **Update Scripts Explained**

### **`update.sh` - Full Update Script**
```bash
#!/bin/bash
# What it does:
# 1. Pulls latest code from GitHub
# 2. Rebuilds Docker image with new code
# 3. Stops old containers
# 4. Starts new containers
# 5. Checks if app is running
# 6. Shows status
```

**Features:**
- ✅ Error checking and validation
- ✅ Health checks
- ✅ Detailed logging
- ✅ Status reporting
- ✅ Automatic rollback on failure

### **`quick-update.sh` - Quick Update Script**
```bash
#!/bin/bash
# What it does:
# 1. Pulls latest code
# 2. Rebuilds and restarts
# 3. Minimal checks
```

**Features:**
- ⚡ Faster execution
- ⚡ Less overhead
- ⚡ Perfect for minor changes

---

## 🤖 **Automated Updates (Optional)**

### **GitHub Actions Auto-Deploy**

If you want automatic updates when you push code:

1. **Set up GitHub Secrets:**
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add these secrets:
     - `VPS_HOST`: Your VPS IP address
     - `VPS_USERNAME`: root
     - `VPS_SSH_KEY`: Your SSH private key

2. **Enable Auto-Deploy:**
   - The `.github/workflows/auto-deploy.yml` file is already configured
   - Just push to `main` branch and it will auto-deploy

3. **Manual Trigger (if needed):**
   ```bash
   # Force a deployment
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

---

## 🔧 **Troubleshooting Updates**

### **Update Failed - Check Logs**
```bash
# View application logs
docker compose logs app

# View recent logs
docker compose logs app --tail=50

# Check container status
docker compose ps
```

### **Rollback to Previous Version**
```bash
# Check git history
git log --oneline -5

# Rollback to previous commit
git checkout <previous-commit-hash>
./update.sh
```

### **Force Rebuild**
```bash
# Force rebuild without cache
docker compose build --no-cache
docker compose up -d
```

### **Reset Everything**
```bash
# Stop and remove everything
docker compose down
docker system prune -f

# Rebuild from scratch
./update.sh
```

---

## 📊 **Update Status Commands**

### **Check Application Health**
```bash
# Health check
curl http://localhost:3000/api/health

# Or from outside
curl https://your-domain.com/api/health
```

### **View Container Status**
```bash
# All containers
docker compose ps

# Resource usage
docker stats

# Container logs
docker compose logs -f app
```

### **Check Git Status**
```bash
# Current branch
git branch

# Recent commits
git log --oneline -5

# Check for updates
git fetch
git status
```

---

## 🚨 **Important Best Practices**

### **Before Updating:**
- ✅ **Test locally** - Always test changes before pushing
- ✅ **Backup database** - `mysqldump Staplewise > backup.sql`
- ✅ **Check git status** - Make sure you're on the right branch
- ✅ **Review changes** - Double-check what you're deploying

### **During Updates:**
- ✅ **Monitor logs** - Watch for errors during deployment
- ✅ **Check health** - Verify app is running after update
- ✅ **Test functionality** - Make sure new features work

### **After Updates:**
- ✅ **Verify deployment** - Check your domain
- ✅ **Test key features** - Login, orders, etc.
- ✅ **Monitor performance** - Check for any issues

---

## 📈 **Update Frequency Guidelines**

### **Minor Updates (Quick Update)**
- **Frequency:** Daily/Weekly
- **Use:** `./quick-update.sh`
- **Examples:** Text changes, styling, small bug fixes

### **Major Updates (Full Update)**
- **Frequency:** Weekly/Monthly
- **Use:** `./update.sh`
- **Examples:** New features, database changes, security updates

### **Emergency Updates**
- **Frequency:** As needed
- **Use:** Manual process
- **Examples:** Security patches, critical bug fixes

---

## 🔍 **Monitoring Updates**

### **Update Notifications**
```bash
# Check if update is needed
git fetch
git status

# See what changed
git log HEAD..origin/main --oneline
```

### **Health Monitoring**
```bash
# Set up monitoring script
nano /root/health-check.sh
```

```bash
#!/bin/bash
# Health check script
if ! curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "Application is down! Attempting restart..."
    cd /var/www/staplewise
    docker compose restart app
fi
```

### **Automated Health Checks**
```bash
# Add to crontab (check every 5 minutes)
(crontab -l 2>/dev/null; echo "*/5 * * * * /root/health-check.sh") | crontab -
```

---

## 📞 **Support & Troubleshooting**

### **Common Issues:**

1. **Update fails with Docker error**
   ```bash
   # Clean Docker cache
   docker system prune -f
   ./update.sh
   ```

2. **Application won't start**
   ```bash
   # Check environment variables
   cat .env
   
   # Check logs
   docker compose logs app
   ```

3. **Database connection issues**
   ```bash
   # Test database connection
   mysql -u staplewise_user -p Staplewise
   
   # Check database status
   systemctl status mysql
   ```

### **Emergency Contacts:**
- **VPS Provider:** For server access issues
- **Domain Provider:** For DNS/domain issues
- **GitHub Support:** For repository issues

---

## 🎯 **Quick Reference Commands**

### **Essential Update Commands:**
```bash
# Full update
./update.sh

# Quick update
./quick-update.sh

# Check status
docker compose ps

# View logs
docker compose logs app

# Health check
curl http://localhost:3000/api/health
```

### **Git Commands:**
```bash
# Check for updates
git fetch && git status

# Pull latest
git pull origin main

# Check recent commits
git log --oneline -5
```

### **Docker Commands:**
```bash
# Rebuild image
docker compose build

# Restart containers
docker compose restart

# View resources
docker stats
```

---

## 🎉 **Success Checklist**

After each update, verify:

- [ ] Application is accessible at your domain
- [ ] Health endpoint returns success
- [ ] New features work as expected
- [ ] No errors in logs
- [ ] Database connections work
- [ ] File uploads work
- [ ] Email functionality works

**Your StapleWise application is now easily updatable! 🚀** 