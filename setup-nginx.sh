#!/bin/bash

echo "🚀 Setting up Nginx for StapleWise..."

# Update system and install Nginx
echo "📦 Installing Nginx..."
apt update
apt install -y nginx

# Create Nginx configuration for StapleWise
echo "⚙️ Creating Nginx configuration..."
cat > /etc/nginx/sites-available/staplewise << 'EOF'
server {
    listen 80;
    server_name 31.97.229.127;
    
    # Proxy to Node.js application
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Health check endpoint
    location /api/health {
        proxy_pass http://localhost:3000/api/health;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # MinIO console (optional)
    location /minio/ {
        proxy_pass http://localhost:9001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the StapleWise site
echo "🔗 Enabling StapleWise site..."
ln -sf /etc/nginx/sites-available/staplewise /etc/nginx/sites-enabled/

# Remove default site
echo "🗑️ Removing default Nginx site..."
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
if nginx -t; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

# Restart Nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx

# Enable Nginx to start on boot
echo "🔧 Enabling Nginx to start on boot..."
systemctl enable nginx

# Check Nginx status
echo "📊 Checking Nginx status..."
systemctl status nginx --no-pager

# Test the setup
echo "🧪 Testing the setup..."
echo "Testing application access..."
curl -s http://localhost:3000/api/health || echo "❌ Application not responding on port 3000"

echo "Testing Nginx proxy..."
curl -s http://localhost/api/health || echo "❌ Nginx proxy not working"

echo "Testing external access..."
curl -s http://31.97.229.127/api/health || echo "❌ External access not working"

echo ""
echo "🎉 Nginx setup completed!"
echo ""
echo "📋 Summary:"
echo "✅ Nginx installed and configured"
echo "✅ StapleWise site enabled"
echo "✅ Default site removed"
echo "✅ Nginx restarted and enabled"
echo ""
echo "🌐 Your application should now be accessible at:"
echo "   http://31.97.229.127"
echo ""
echo "🔍 To check logs:"
echo "   tail -f /var/log/nginx/error.log"
echo "   tail -f /var/log/nginx/access.log"
echo ""
echo "🔄 To restart Nginx:"
echo "   systemctl restart nginx" 