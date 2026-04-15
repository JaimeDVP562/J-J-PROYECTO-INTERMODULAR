#!/bin/bash
# =============================================================================
# certbot-setup.sh — Configurar HTTPS en el servidor frontend
#
# Ejecutar DESPUÉS de:
#   1. terraform apply   (servidor frontend arrancado, EIP asignada)
#   2. Apuntar j-j-proyect.duckdns.org a la EIP del frontend en DuckDNS
#   3. Verificar que el dominio resuelve: ping j-j-proyect.duckdns.org
#
# Uso:
#   chmod +x certbot-setup.sh
#   ./certbot-setup.sh <BASTION_HOST> <FRONTEND_HOST>
#
# Ejemplo:
#   ./certbot-setup.sh 54.123.45.67 10.0.1.50
# =============================================================================

set -euo pipefail

BASTION_HOST="${1:?Uso: $0 <BASTION_HOST> <FRONTEND_HOST>}"
FRONTEND_HOST="${2:?Uso: $0 <BASTION_HOST> <FRONTEND_HOST>}"
SSH_USER="ubuntu"
KEY="$HOME/.ssh/vockey.pem"
PUBLIC_DOMAIN="j-j-proyect.duckdns.org"
ADMIN_EMAIL="jesusriosmlg@gmail.com"

echo "=============================================="
echo " Configurando HTTPS en $PUBLIC_DOMAIN"
echo " Frontend: $FRONTEND_HOST (vía bastion $BASTION_HOST)"
echo "=============================================="

# Verificar que el dominio resuelve a la IP del frontend
RESOLVED=$(dig +short "$PUBLIC_DOMAIN" | tail -1)
echo "DNS actual de $PUBLIC_DOMAIN: $RESOLVED"
if [ -z "$RESOLVED" ]; then
  echo "ERROR: $PUBLIC_DOMAIN no resuelve. Apunta el dominio en DuckDNS primero."
  exit 1
fi

ssh -i "$KEY" \
    -o StrictHostKeyChecking=no \
    -o ProxyJump="$SSH_USER@$BASTION_HOST" \
    "$SSH_USER@$FRONTEND_HOST" << ENDSSH
set -e

echo "=== Instalando Certbot ==="
apt-get install -y certbot python3-certbot-apache

echo "=== Emitiendo certificado para $PUBLIC_DOMAIN ==="
certbot --apache \
  -d $PUBLIC_DOMAIN \
  --non-interactive \
  --agree-tos \
  -m $ADMIN_EMAIL \
  --redirect

echo "=== Añadiendo proxy al VirtualHost HTTPS generado por Certbot ==="
# Certbot genera /etc/apache2/sites-enabled/*-le-ssl.conf
SSL_CONF=\$(ls /etc/apache2/sites-enabled/*-le-ssl.conf 2>/dev/null | head -1)

if [ -n "\$SSL_CONF" ] && ! grep -q "ProxyPass /api" "\$SSL_CONF"; then
  sed -i '/<\/VirtualHost>/i \    ProxyPreserveHost On\n    ProxyPass /api http://api.jj.internal/api\n    ProxyPassReverse /api http://api.jj.internal/api' "\$SSL_CONF"
  echo "Proxy añadido a \$SSL_CONF"
fi

echo "=== Añadiendo HSTS al VirtualHost HTTPS ==="
if ! grep -q "Strict-Transport-Security" /etc/apache2/conf-available/security-headers.conf 2>/dev/null; then
  echo 'Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"' \
    >> /etc/apache2/conf-available/security-headers.conf
fi

echo "=== Reiniciando Apache ==="
systemctl restart apache2

echo ""
echo "✓ HTTPS configurado correctamente en https://$PUBLIC_DOMAIN"
echo "✓ El certificado se renovará automáticamente vía cron de Certbot"
ENDSSH

echo ""
echo "Hecho. Verifica: curl -I https://$PUBLIC_DOMAIN"
