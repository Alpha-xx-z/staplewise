# 🔒 Security Checklist & Best Practices

## 🚨 **CRITICAL: Never Hardcode Credentials**

### ❌ **What NOT to do:**
```typescript
// NEVER do this!
const minioClient = new Client({
  accessKey: 'minioadmin',  // ❌ Hardcoded credentials
  secretKey: 'minioadmin',  // ❌ Hardcoded credentials
});

const emailTransporter = nodemailer.createTransport({
  auth: {
    user: 'staplewise.business@gmail.com',  // ❌ Hardcoded email
    pass: 'nnwp fnhb yqxm qexj'            // ❌ Hardcoded password
  }
});
```

### ✅ **What to do instead:**
```typescript
// ALWAYS use environment variables
const minioClient = new Client({
  accessKey: process.env.MINIO_ACCESS_KEY || '',
  secretKey: process.env.MINIO_SECRET_KEY || '',
});

const emailTransporter = nodemailer.createTransport({
  auth: {
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || ''
  }
});
```

---

## 🔐 **Environment Variables Security**

### 1. **Never Commit .env Files**
```bash
# Add to .gitignore
.env
.env.local
.env.production
.env.staging
```

### 2. **Use Strong Passwords**
```bash
# Generate strong passwords
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 16  # For database passwords
```

### 3. **Secure File Permissions**
```bash
# Set proper permissions for .env files
chmod 600 .env
chown root:root .env
```

---

## 🛡️ **Production Security Checklist**

### ✅ **Environment Variables**
- [ ] All credentials moved to environment variables
- [ ] No hardcoded passwords in source code
- [ ] Strong JWT secret (32+ characters)
- [ ] Unique passwords for each service
- [ ] .env file not committed to git

### ✅ **Database Security**
- [ ] Strong database passwords
- [ ] Database user has minimal required privileges
- [ ] Database not accessible from internet
- [ ] Regular database backups
- [ ] Encrypted database connections

### ✅ **File Storage Security**
- [ ] MinIO credentials secured
- [ ] Bucket policies configured
- [ ] Access keys rotated regularly
- [ ] SSL/TLS enabled for file storage

### ✅ **Email Security**
- [ ] Gmail App Password used (not regular password)
- [ ] Email credentials in environment variables
- [ ] Email sending rate limited
- [ ] Email templates sanitized

### ✅ **Server Security**
- [ ] Firewall configured (UFW)
- [ ] SSH key-based authentication only
- [ ] Root login disabled
- [ ] Regular security updates
- [ ] SSL certificates installed

### ✅ **Application Security**
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Rate limiting implemented
- [ ] Error messages don't leak sensitive info

---

## 🔧 **Security Commands**

### **Generate Strong Secrets**
```bash
# JWT Secret
openssl rand -base64 32

# Database Password
openssl rand -base64 16

# MinIO Access Key
openssl rand -base64 12

# MinIO Secret Key
openssl rand -base64 24
```

### **Check for Hardcoded Credentials**
```bash
# Search for potential hardcoded credentials
grep -r "password\|secret\|key\|token" src/ --exclude-dir=node_modules
grep -r "@gmail.com\|@yahoo.com\|@hotmail.com" src/
grep -r "minioadmin\|admin\|root" src/
```

### **Secure File Permissions**
```bash
# Secure environment files
chmod 600 .env
chmod 600 /root/.my.cnf

# Secure application files
chmod 755 /var/www/staplewise
chown -R www-data:www-data /var/www/staplewise
```

---

## 🚨 **Security Alerts**

### **Immediate Actions Required:**
1. **Change all passwords** if credentials were ever committed to git
2. **Rotate access keys** for MinIO and other services
3. **Regenerate JWT secret** if it was hardcoded
4. **Update email app password** if it was exposed

### **Regular Security Tasks:**
- [ ] Monthly password rotation
- [ ] Quarterly access key rotation
- [ ] Weekly security updates
- [ ] Daily backup verification
- [ ] Monthly security audit

---

## 📋 **Deployment Security Checklist**

### **Before Deployment:**
- [ ] All hardcoded credentials removed
- [ ] Environment variables configured
- [ ] Strong passwords generated
- [ ] SSL certificates ready
- [ ] Firewall rules configured

### **After Deployment:**
- [ ] Application accessible via HTTPS only
- [ ] All endpoints require authentication
- [ ] File uploads validated and sanitized
- [ ] Error logs don't contain sensitive data
- [ ] Backup system working

---

## 🔍 **Security Monitoring**

### **Log Monitoring:**
```bash
# Monitor for suspicious activity
tail -f /var/log/nginx/access.log | grep -E "(404|403|500)"
tail -f /var/log/auth.log | grep -E "(Failed|Invalid)"
docker compose logs app | grep -E "(error|Error|ERROR)"
```

### **Health Checks:**
```bash
# Check application health
curl -f https://your-domain.com/api/health

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Check firewall status
ufw status verbose
```

---

## 📞 **Security Incident Response**

### **If Credentials are Compromised:**
1. **Immediately rotate all passwords and keys**
2. **Check for unauthorized access**
3. **Review logs for suspicious activity**
4. **Update security measures**
5. **Document the incident**

### **Emergency Contacts:**
- **VPS Provider:** Contact for server access issues
- **Domain Provider:** Contact for DNS/domain issues
- **Email Provider:** Contact for email security issues

---

## 🎯 **Security Best Practices Summary**

1. **Never hardcode credentials** - Always use environment variables
2. **Use strong, unique passwords** - Generate with cryptographic tools
3. **Keep secrets secure** - Proper file permissions and access control
4. **Regular updates** - Keep all software and dependencies updated
5. **Monitor logs** - Watch for suspicious activity
6. **Backup regularly** - Secure, encrypted backups
7. **Test security** - Regular security audits and penetration testing

**Remember: Security is not a one-time task, it's an ongoing process!** 🔒 