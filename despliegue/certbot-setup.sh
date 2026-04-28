#!/bin/bash
# =============================================================================
# certbot-setup.sh — Configurar HTTPS en el servidor frontend
#
# Requisitos previos:
#   1. terraform apply completado (EIP asignada)
#   2. j-j-proyect.duckdns.org apuntando a la EIP del frontend en DuckDNS
#   3. vockey.pem disponible en ~/.ssh/vockey.pem
#   4. SSH agent activo con la clave cargada:
#        eval $(ssh-agent -s)
#        ssh-add ~/.ssh/vockey.pem
#
# Uso:
#   bash certbot-setup.sh <BASTION_HOST> <FRONTEND_PRIVATE_IP>
#
# Ejemplo:
#   bash certbot-setup.sh 100.24.132.201 172.31.19.165
# =============================================================================

set -euo pipefail

BASTION_HOST="${1:?Uso: $0 <BASTION_HOST> <FRONTEND_PRIVATE_IP>}"
FRONTEND_HOST="${2:?Uso: $0 <BASTION_HOST> <FRONTEND_PRIVATE_IP>}"
SSH_USER="ubuntu"
KEY="/c/Users/Jesus/.ssh/vockey.pem"
PUBLIC_DOMAIN="j-j-proyect.duckdns.org"
INTERNAL_DOMAIN="jj.internal"
ADMIN_EMAIL="jesusriosmlg@gmail.com"
DUCKDNS_TOKEN="055a4b49-c08a-4d50-88c7-0c97d1cea7d6"

echo "=============================================="
echo " Configurando HTTPS en $PUBLIC_DOMAIN"
echo " Frontend: $FRONTEND_HOST (vía bastion $BASTION_HOST)"
echo "=============================================="

ssh -i "$KEY" \
    -o StrictHostKeyChecking=no \
    -o "ProxyCommand=ssh -i $KEY -o StrictHostKeyChecking=no -W %h:%p $SSH_USER@$BASTION_HOST" \
    "$SSH_USER@$FRONTEND_HOST" << ENDSSH
set -e

echo "=== Instalando certbot y plugin DuckDNS ==="
sudo apt-get install -y python3-pip certbot
sudo pip3 install certbot-dns-duckdns

echo "=== Guardando token DuckDNS ==="
sudo mkdir -p /etc/letsencrypt/secrets
echo "dns_duckdns_token=$DUCKDNS_TOKEN" | sudo tee /etc/letsencrypt/secrets/duckdns.ini > /dev/null
sudo chmod 600 /etc/letsencrypt/secrets/duckdns.ini

echo "=== Obteniendo certificado via DNS challenge ==="
sudo certbot certonly \
  --authenticator dns-duckdns \
  --dns-duckdns-token="$DUCKDNS_TOKEN" \
  --dns-duckdns-propagation-seconds=60 \
  -d "$PUBLIC_DOMAIN" \
  --non-interactive --agree-tos -m "$ADMIN_EMAIL"

echo "=== Habilitando módulos Apache necesarios ==="
sudo a2enmod proxy proxy_http rewrite headers ssl
sudo a2enmod socache_shmcb

echo "=== Creando VirtualHost HTTP (frontend.conf) ==="
sudo a2dissite 000-default.conf 2>/dev/null || true
sudo mkdir -p /var/www/frontend

sudo tee /etc/apache2/sites-available/frontend.conf > /dev/null << 'APACHEEOF'
<VirtualHost *:80>
    ServerName j-j-proyect.duckdns.org
    RewriteEngine On
    RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</VirtualHost>
APACHEEOF

echo "=== Creando VirtualHost HTTPS (frontend-ssl.conf) ==="
sudo tee /etc/apache2/sites-available/frontend-ssl.conf > /dev/null << 'APACHEEOF'
<VirtualHost *:443>
    ServerName j-j-proyect.duckdns.org
    DocumentRoot /var/www/frontend

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/j-j-proyect.duckdns.org/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/j-j-proyect.duckdns.org/privkey.pem

    ProxyPreserveHost On
    ProxyPass /.well-known !
    ProxyPass /admin http://api.jj.internal/admin
    ProxyPassReverse /admin http://api.jj.internal/admin
    ProxyPass /api http://api.jj.internal/api
    ProxyPassReverse /api http://api.jj.internal/api

    <Directory /var/www/frontend>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    RewriteEngine On
    RewriteRule ^/\.well-known - [L]
    RewriteRule ^/admin - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ /index.html [L]

    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set Referrer-Policy "no-referrer"

    ErrorLog \${APACHE_LOG_DIR}/frontend_error.log
    CustomLog \${APACHE_LOG_DIR}/frontend_access.log combined
</VirtualHost>
APACHEEOF

sudo a2ensite frontend.conf frontend-ssl.conf
sudo chown -R www-data:www-data /var/www/frontend
sudo chmod -R 755 /var/www/frontend

echo "=== Reiniciando Apache ==="
sudo systemctl restart apache2

echo ""
echo "✓ HTTPS configurado en https://$PUBLIC_DOMAIN"
echo "✓ Renovación automática gestionada por el cron de certbot"
ENDSSH

echo ""
echo "Hecho. Verifica desde tu máquina:"
echo "  curl -I https://$PUBLIC_DOMAIN"
