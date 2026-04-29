#!/bin/bash
set -euo pipefail

# ─── Config ───────────────────────────────────────────────────────────────────
DUCKDNS_TOKEN="055a4b49-c08a-4d50-88c7-0c97d1cea7d6"
DUCKDNS_DOMAIN="j-j-proyect"
GH_REPO="JaimeDVP562/J-J-PROYECTO-INTERMODULAR"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Dependencias ─────────────────────────────────────────────────────────────
for cmd in terraform gh aws openssl curl; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: '$cmd' no encontrado."; exit 1; }
done

# ─── Terraform apply ──────────────────────────────────────────────────────────
echo "=== terraform apply ==="
cd "$SCRIPT_DIR"
terraform apply -auto-approve

# ─── Leer outputs ─────────────────────────────────────────────────────────────
BASTION_IP=$(terraform output -raw bastion_elastic_ip)
FRONTEND_PUBLIC_IP=$(terraform output -raw frontend_public_ip)
FRONTEND_PRIVATE_IP=$(terraform output -raw frontend_private_ip)
API_IP=$(terraform output -raw api_private_ip)
DB_IP=$(terraform output -raw database_private_ip)

echo ""
echo "IPs obtenidas:"
echo "  Bastion EIP:        $BASTION_IP"
echo "  Frontend público:   $FRONTEND_PUBLIC_IP"
echo "  Frontend privado:   $FRONTEND_PRIVATE_IP"
echo "  API privada:        $API_IP"
echo "  DB privada:         $DB_IP"

# ─── DuckDNS ──────────────────────────────────────────────────────────────────
echo ""
echo "=== Actualizando DuckDNS → $FRONTEND_PUBLIC_IP ==="
DUCK_RESP=$(curl -s "https://www.duckdns.org/update?domains=${DUCKDNS_DOMAIN}&token=${DUCKDNS_TOKEN}&ip=${FRONTEND_PUBLIC_IP}")
echo "DuckDNS: $DUCK_RESP"

# ─── Esperar DB bootstrap para obtener password ───────────────────────────────
echo ""
echo "=== Esperando bootstrap de la base de datos (hasta 8 min) ==="
for i in $(seq 1 48); do
  DB_PASS=$(ssh -i ~/.ssh/vockey.pem -o StrictHostKeyChecking=no \
    -o ProxyCommand="ssh -i ~/.ssh/vockey.pem -o StrictHostKeyChecking=no -W %h:%p ubuntu@${BASTION_IP}" \
    ubuntu@"${DB_IP}" \
    "sudo grep 'Password:' /var/log/user-data-db.log 2>/dev/null | awk '{print \$2}'" 2>/dev/null || true)
  if [ -n "$DB_PASS" ]; then
    echo "Password de DB obtenido."
    break
  fi
  echo "Intento $i/48 — DB aún arrancando..."
  sleep 10
done

if [ -z "${DB_PASS:-}" ]; then
  echo "No se pudo obtener el password de DB del log. Generando y reseteando..."
  DB_PASS=$(openssl rand -base64 24)
  ssh -i ~/.ssh/vockey.pem -o StrictHostKeyChecking=no \
    -o ProxyCommand="ssh -i ~/.ssh/vockey.pem -o StrictHostKeyChecking=no -W %h:%p ubuntu@${BASTION_IP}" \
    ubuntu@"${DB_IP}" \
    "sudo mysql -u root -e \"ALTER USER 'laravel_user'@'%' IDENTIFIED BY '${DB_PASS}'; FLUSH PRIVILEGES;\""
  echo "Password de DB reseteado."
fi

# ─── APP_KEY ──────────────────────────────────────────────────────────────────
APP_KEY="base64:$(openssl rand -base64 32)"
echo "APP_KEY generado."

# ─── GitHub Secrets ───────────────────────────────────────────────────────────
echo ""
echo "=== Actualizando GitHub Secrets ==="
gh secret set BASTION_HOST   --body "$BASTION_IP"           --repo "$GH_REPO"
gh secret set FRONTEND_HOST  --body "$FRONTEND_PRIVATE_IP"  --repo "$GH_REPO"
gh secret set API_HOST       --body "$API_IP"               --repo "$GH_REPO"
gh secret set DB_HOST        --body "$DB_IP"                --repo "$GH_REPO"
gh secret set DB_PASSWORD    --body "$DB_PASS"              --repo "$GH_REPO"
gh secret set APP_KEY        --body "$APP_KEY"              --repo "$GH_REPO"
echo "Secrets actualizados."

# ─── Resumen ──────────────────────────────────────────────────────────────────
echo ""
echo "============================================"
echo " Deploy completo."
echo " App: http://${FRONTEND_PUBLIC_IP}"
echo " Dominio: http://${DUCKDNS_DOMAIN}.duckdns.org"
echo "============================================"
echo ""
echo "Haz un git push para disparar el CI/CD."
