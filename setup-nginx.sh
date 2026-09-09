#!/bin/bash
set -e

DOMAIN="ajeer.qiwa-sa.info"
APP_PORT="3003"
EMAIL="admin@qiwa-sa.info"

echo "=================================================="
echo "🚀 Setting up Nginx & SSL for $DOMAIN"
echo "🌐 Target Application Port: $APP_PORT"
echo "=================================================="

# 1. Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (or use sudo)"
  exit 1
fi

# 2. Install Nginx and Certbot if not already installed
echo "📦 Checking and installing Nginx & Certbot..."
if ! command -v nginx &> /dev/null || ! command -v certbot &> /dev/null; then
  apt-get update -y
  apt-get install -y nginx certbot python3-certbot-nginx
fi

# 3. Create Certbot webroot directory
mkdir -p /var/www/certbot
chown -R www-data:www-data /var/www/certbot

# 4. Check if SSL certificate already exists
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "🔒 SSL certificate not found. Setting up temporary HTTP validation..."

  cat <<EOF > /etc/nginx/sites-available/$DOMAIN
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://127.0.0.1:$APP_PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

  ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
  nginx -t
  systemctl reload nginx

  echo "📜 Requesting Let's Encrypt SSL certificate for $DOMAIN..."
  certbot certonly --webroot -w /var/www/certbot \
    -d $DOMAIN \
    --non-interactive \
    --agree-tos \
    --email $EMAIL || {
      echo "⚠️ Certbot with email failed, trying register-unsafely-without-email..."
      certbot certonly --webroot -w /var/www/certbot \
        -d $DOMAIN \
        --non-interactive \
        --agree-tos \
        --register-unsafely-without-email
    }
fi

# 5. Copy production HTTPS Nginx configuration
echo "⚙️ Installing production Nginx configuration..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "$SCRIPT_DIR/nginx/$DOMAIN.conf" ]; then
  cp "$SCRIPT_DIR/nginx/$DOMAIN.conf" "/etc/nginx/sites-available/$DOMAIN"
else
  echo "❌ Configuration file $SCRIPT_DIR/nginx/$DOMAIN.conf not found!"
  exit 1
fi

# 6. Enable site
ln -sf "/etc/nginx/sites-available/$DOMAIN" /etc/nginx/sites-enabled/

# 7. Test Nginx configuration and reload
echo "🔍 Testing Nginx syntax..."
nginx -t

echo "🔄 Reloading Nginx..."
systemctl reload nginx

echo "=================================================="
echo "✅ Nginx & SSL setup successfully completed!"
echo "🌐 Visit: https://$DOMAIN"
echo "=================================================="