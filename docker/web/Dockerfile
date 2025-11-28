FROM php:8.2-apache

# Instala dependencias y extensiones necesarias (pdo, pdo_mysql, mysqli)
RUN apt-get update \
  && apt-get install -y --no-install-recommends default-mysql-client libzip-dev unzip \
  && docker-php-ext-install pdo pdo_mysql mysqli \
  && a2enmod rewrite \
  && rm -rf /var/lib/apt/lists/*

# Copia todo el repo (ajusta si prefieres copiar solo ./www)
COPY . /var/www/html/

RUN chown -R www-data:www-data /var/www/html \
  && find /var/www/html -type d -exec chmod 755 {} \; \
  && find /var/www/html -type f -exec chmod 644 {} \;

EXPOSE 80
CMD ["apache2-foreground"]
