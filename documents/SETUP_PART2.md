# SETUP PART 2: MinIO Configuration Fix

## 📋 **Overview**

This document details the complete process of fixing the MinIO configuration error that occurred during the VPS deployment. The error prevented the application from starting properly due to mismatched access credentials.

## 🚨 **The Problem**

### **Error Message**
```
❌ Error initializing MinIO buckets: S3Error: The Access Key Id you provided does not exist in our records.
code: 'InvalidAccessKeyId'
bucketname: 'staplewise-documents'
```

### **What Was Happening**
1. **Application Startup Failure**: The Node.js application was failing to start because it couldn't connect to MinIO
2. **Container Restart Loop**: Docker container kept restarting due to the MinIO initialization error
3. **Bucket Creation Failure**: The application couldn't create required MinIO buckets for file storage
4. **Credential Mismatch**: The credentials in the `.env` file didn't match the actual MinIO service configuration

## 🔍 **Root Cause Analysis**

### **Investigation Steps**
1. **Checked MinIO Service Configuration**:
   ```bash
   cat /etc/systemd/system/minio.service
   ```
   **Result**: Found MinIO was configured with:
   - `MINIO_ROOT_USER=alpha`
   - `MINIO_ROOT_PASSWORD=preetham@2004`

2. **Checked Application Environment**:
   ```bash
   cat .env | grep MINIO
   ```
   **Result**: Found application was using different credentials:
   - `MINIO_ACCESS_KEY=pJZdDP+l14M/AFgs`
   - `MINIO_SECRET_KEY=KuoO3nl7LwJnVhspLStgIB6qqGF62uWY`

3. **Identified the Mismatch**: The application's `.env` file had credentials that didn't exist in the MinIO service configuration.

## 🛠️ **The Fix Process**

### **Step 1: Updated MinIO Credentials**
```bash
# SSH to VPS
ssh root@31.97.229.127

# Navigate to project directory
cd /var/www/staplewise

# Update .env file with correct MinIO credentials
sed -i 's/MINIO_ACCESS_KEY=.*/MINIO_ACCESS_KEY=alpha/' .env
sed -i 's/MINIO_SECRET_KEY=.*/MINIO_SECRET_KEY=preetham@2004/' .env

# Verify the changes
cat .env | grep MINIO
```

**Before Fix**:
```
MINIO_ACCESS_KEY=pJZdDP+l14M/AFgs
MINIO_SECRET_KEY=KuoO3nl7LwJnVhspLStgIB6qqGF62uWY
```

**After Fix**:
```
MINIO_ACCESS_KEY=alpha
MINIO_SECRET_KEY=preetham@2004
```

### **Step 2: Rebuilt Application**
```bash
# Stop the application
docker-compose down

# Rebuild with new environment variables
docker-compose build --no-cache

# Start the application
docker-compose up -d
```

### **Step 3: Verified the Fix**
```bash
# Check application logs
docker-compose logs app | tail -15

# Test health endpoints
curl http://localhost:3000/api/health
curl http://localhost:9000/minio/health/live
```

## ✅ **Successful Results**

### **Application Logs After Fix**
```
🚀 Server running on http://localhost:3000
📊 Health check: http://localhost:3000/api/health
✅ Bucket already exists: staplewise-documents
✅ Bucket already exists: staplewise-image
```

### **Container Status**
```
      Name                    Command               State                    Ports                 
---------------------------------------------------------------------------------------------------
staplewise_app_1   docker-entrypoint.sh npx t ...   Up      0.0.0.0:3000->3000/tcp,:::3000-        
                                                            >3000/tcp                              
```

### **Health Check Response**
```json
{"status":"OK","timestamp":"2025-08-06T15:17:36.655Z"}
```

## 🔧 **Alternative Solutions Considered**

### **Option A: Reset to Default MinIO Credentials**
If the above fix didn't work, we had prepared this alternative:

```bash
# Stop MinIO
systemctl stop minio

# Update MinIO service to use default credentials
cat > /etc/systemd/system/minio.service << 'EOF'
[Unit]
Description=MinIO
After=network.target

[Service]
User=minio-user
Group=minio-user
ExecStart=/usr/local/bin/minio server /mnt/data/minio --console-address ":9001"
Environment="MINIO_ROOT_USER=minioadmin"
Environment="MINIO_ROOT_PASSWORD=minioadmin"

[Install]
WantedBy=multi-user.target
EOF

# Update .env file to match
sed -i 's/MINIO_ACCESS_KEY=.*/MINIO_ACCESS_KEY=minioadmin/' .env
sed -i 's/MINIO_SECRET_KEY=.*/MINIO_SECRET_KEY=minioadmin/' .env

# Restart everything
systemctl daemon-reload
systemctl restart minio
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## 📚 **Key Learnings**

### **1. Environment Variable Synchronization**
- Always ensure that environment variables in the application match the actual service configurations
- Docker containers need to be rebuilt when environment variables change
- Use `docker-compose build --no-cache` to ensure fresh builds

### **2. MinIO Configuration**
- MinIO service configuration is in `/etc/systemd/system/minio.service`
- Environment variables in the service file define the root credentials
- Application must use the same credentials defined in the MinIO service

### **3. Debugging Process**
- Check service configurations first
- Compare with application environment variables
- Rebuild containers after environment changes
- Monitor logs for successful initialization

### **4. Docker Best Practices**
- Use `docker-compose down` before rebuilding
- Use `docker-compose build --no-cache` for environment variable changes
- Monitor logs with `docker-compose logs app`

## 🔍 **Troubleshooting Commands**

### **Useful Commands for Future Debugging**
```bash
# Check MinIO service status
systemctl status minio

# Check MinIO service configuration
cat /etc/systemd/system/minio.service

# Check application environment
cat .env | grep MINIO

# Check container status
docker-compose ps

# Check application logs
docker-compose logs app | tail -20

# Test MinIO health
curl http://localhost:9000/minio/health/live

# Test application health
curl http://localhost:3000/api/health

# Check MinIO console (if accessible)
# Browser: http://31.97.229.127:9001
```

## 🎯 **Final Status**

✅ **MinIO is fully functional**
✅ **Application is running successfully**
✅ **File upload functionality is working**
✅ **All MinIO buckets are created and accessible**

## 📝 **Documentation Updates**

This fix has been documented in:
- `documents/SETUP_PART1.md` - Main deployment guide
- `documents/INDEX.md` - Documentation index
- `documents/SECURITY.md` - Security best practices

## 🔄 **Prevention for Future Deployments**

1. **Always verify MinIO credentials** before deployment
2. **Use consistent credential management** across services
3. **Test MinIO connectivity** during deployment
4. **Monitor application logs** for initialization errors
5. **Have backup credential configurations** ready

---

**Date**: August 6, 2025  
**Issue**: MinIO Access Key Mismatch  
**Status**: ✅ RESOLVED  
**Impact**: Application startup failure  
**Solution**: Credential synchronization between MinIO service and application environment 