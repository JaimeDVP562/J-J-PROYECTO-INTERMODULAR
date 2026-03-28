# Documentación del proyecto: J-J Proyecto Intermodular

Este documento describe en detalle la aplicación, su arquitectura, instrucciones de desarrollo, pruebas y despliegue.

## Índice

1. Introducción
2. Objetivos
3. Requisitos
4. Planificación
5. Tecnologías
6. Diseño
7. Desarrollo
8. Pruebas
9. Despliegue
10. Manual de usuario
11. Conclusiones
12. Mejoras futuras
13. Anexos

---

## 1. Introducción

J-J Proyecto Intermodular es una aplicación web full-stack para la gestión empresarial (ERP) que cubre facturación, ventas, inventario, empleados, jornadas laborales y estadísticas. El repositorio contiene un backend API en Laravel y una SPA en Angular, junto con artefactos para despliegue con Docker y Terraform. Más información general en [README.md](README.md).

## 2. Objetivos

- Proveer una API REST sólida con Laravel para la lógica de negocio y persistencia.
- Ofrecer una interfaz SPA con Angular para la interacción de usuarios y vendedores.
- Facilitar el despliegue automatizado en infraestructura cloud mediante Terraform.
- Soportar pruebas automatizadas y seeders para entornos de desarrollo.

## 3. Requisitos

### Requisitos de software

- PHP 8.2+ y Composer (backend) — se declara en [backend/composer.json](backend/composer.json).
- Node.js (>=16) y npm (frontend) — ver [frontend/package.json](frontend/package.json).
- Docker y Docker Compose para entornos reproducibles — archivo [docker-compose.yml](docker-compose.yml).
- Terraform para despliegue (ficheros en `despliegue/`).

### Requisitos de sistema

- 4 GB RAM mínimo para desarrollo; 8+ GB recomendado si se ejecuta Docker con base de datos y servicios.
- Puerto 3306 (MySQL) configurado en Docker Compose para desarrollo.

### Variables y configuración

El proyecto usa variables de entorno para configuración sensible. En producción se espera un `.env` por servicio; la pipeline de CI usa secretos de GitHub Actions en [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Variables importantes (ejemplos):

- APP_KEY
- DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- API_HOST, FRONTEND_HOST (usadas en despliegue)

No debe incluirse información sensible en el repo. Se ha verificado que el deploy usa `secrets.*` en GitHub Actions.

## 4. Planificación

Este apartado refleja un posible reparto de hitos para entrega académica:

- Hito 1 (Semana 1): Estructura del proyecto, migraciones y seeders básicos.
- Hito 2 (Semana 2): CRUDs principales (productos, proveedores, facturas, ventas).
- Hito 3 (Semana 3): Interfaz Angular y conectividad con API.
- Hito 4 (Semana 4): Tests, documentación, y despliegue con Terraform.

Adapte plazos según calendario docente y revisiones.

## 5. Tecnologías

- Backend: Laravel 12, PHP ^8.2 — ver [backend/composer.json](backend/composer.json) y [backend/composer.lock](backend/composer.lock).
- Frontend: Angular 20 — ver [frontend/package.json](frontend/package.json) y [frontend/package-lock.json](frontend/package-lock.json).
- Base de datos de desarrollo: MySQL 8.0 (imagen en [docker-compose.yml](docker-compose.yml)).
- Infraestructura: Terraform (archivos en `despliegue/`).
- CI: GitHub Actions (archivo [.github/workflows/deploy.yml](.github/workflows/deploy.yml)).

## 6. Diseño

### Arquitectura general

La aplicación sigue arquitectura cliente (Angular) — API REST (Laravel) — Base de datos (MySQL). Se contempla un bastion host y separación de grupos de seguridad en la plantilla Terraform (`despliegue/main.tf`).

### Endpoints principales

La API expone recursos REST según las rutas definidas en [backend/routes/api.php](backend/routes/api.php). Algunos endpoints clave:

- POST /login — autenticación
- POST /logout — cierre de sesión
- /productos — CRUD de productos (apiResource)
- /proveedores — CRUD de proveedores
- /facturas — CRUD de facturas (incluye `facturas/next-number` y `facturas/{id}/resend-verifactu`)
- /ventas — CRUD y rutas específicas (`ventas/mis-hoy`, `ventas/pago-proveedor`)

Para lista completa, consulte [backend/routes/api.php](backend/routes/api.php).

### Modelado de datos (breve)

El directorio `backend/app/Models` contiene entidades como `Producto`, `Proveedor`, `Factura`, `Venta`, `Cliente`, `Empleado`, `Inventario`, `Categoria`. Las migraciones están en `database/migrations` y los seeders en `database/seeders`.

## 7. Desarrollo

### Estructura backend

- `app/Models` — modelos Eloquent.
- `app/Http/Controllers/Api` — controladores que implementan la API.
- `app/Services` — servicios como `VerifactuService.php` (integraciones externas /Mocks).
- `database/migrations` y `database/seeders` — esquema y datos de prueba.
- `tests/` — pruebas unitarias y de feature; `phpunit.xml` configura entorno de pruebas.

### Estructura frontend

- `src/app` — componentes y rutas de Angular.
- `src/environments` — configuración por entorno.
- `angular.json` y `tsconfig.*` definen compilación. Consulte [frontend/angular.json](frontend/angular.json).

### Comandos habituales (desarrollo local)

Backend:

```bash
cd backend
composer install
cp .env.example .env   # crear .env local y ajustar DB
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=0.0.0.0 --port=8000
```

Frontend:

```bash
cd frontend
npm ci
npm run start
```

Con Docker Compose (entorno integrado):

```bash
docker compose up --build
```

## 8. Pruebas

### Backend

Las pruebas PHP usan PHPUnit y `phpunit.xml` configura una base de datos SQLite en memoria para tests rápidos.

Ejecutar tests:

```bash
cd backend
composer install --dev
./vendor/bin/phpunit
```

### Frontend

Si existen tests de Angular (no obligatorios en este repo), ejecutar con:

```bash
cd frontend
npm ci
ng test
```

### Auditorías y linters

Recomendado ejecutar:

```bash
cd backend
composer audit

cd frontend
npm audit --production
```

Integrar PHPStan/PSalm y ESLint en CI para calidad continua.

## 9. Despliegue

### Docker Compose

El fichero principal es [docker-compose.yml](docker-compose.yml). Para desarrollo levantar servicios:

```bash
docker compose up --build
```

Revisar que la base de datos no quede expuesta en entornos públicos.

### Terraform

Los ficheros en `despliegue/` contienen recursos AWS (VPC, security groups, EC2, etc.). Archivo principal: [despliegue/main.tf](despliegue/main.tf).

Antes de aplicar en producción, corrige reglas demasiado permisivas (p. ej. permitir SSH desde 0.0.0.0/0). Ejemplo de comandos:

```bash
cd despliegue
terraform init
terraform plan
terraform apply
```

### CI / Deploy

La pipeline de despliegue está en [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Usa secrets de GitHub Actions para inyectar `APP_KEY`, `DB_PASSWORD`, claves SSH, etc. Ver el archivo para pasos exactos.

## 10. Manual de usuario

### Acceso

1. Abrir la URL del frontend (según despliegue).
2. Iniciar sesión con credenciales proporcionadas por el administrador (o crear usuario en seeders para desarrollo).

### Flujo rápido: emitir una factura

1. En el panel, ir a Facturación.
2. Crear Cliente (si no existe).
3. Añadir productos a la factura.
4. Guardar y confirmar — el sistema genera número siguiente (`/facturas/next-number`).
5. Enviar o reintentar envío a servicio de facturación (`facturas/{id}/resend-verifactu`).

### Flujo rápido: registrar venta

1. Ir a Ventas → Nueva Venta.
2. Añadir detalles de venta y método de pago.
3. Finalizar. Ver `ventas/mis-hoy` para ventas del usuario actual.

## 11. Conclusiones

El proyecto proporciona una base completa para un ERP educativo: arquitectura modular, API REST, SPA moderna y herramientas de despliegue. Se aprecian buenas prácticas (tests con SQLite, seeders) y áreas de mejora en seguridad y automatización.

## 12. Mejoras futuras (priorizadas)

1. Corregir reglas de seguridad en Terraform (evitar SSH abierto).
2. Integrar análisis estático y linters en CI (PHPStan/PSalm, ESLint).
3. Añadir escáner de secretos en pre-commit / CI (gitleaks/git-secrets).
4. Añadir cobertura de tests y métricas de calidad.
5. Hardenizar Dockerfiles y separar entornos (dev/prod) con variables seguras.

## 13. Anexos

- Ficheros clave:
  - [README.md](README.md)
  - [docker-compose.yml](docker-compose.yml)
  - [backend/composer.json](backend/composer.json)
  - [backend/phpunit.xml](backend/phpunit.xml)
  - [backend/routes/api.php](backend/routes/api.php)
  - [despliegue/main.tf](despliegue/main.tf)
  - [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

- Comandos útiles:

```bash
# Levantar entorno completo (Docker)
docker compose up --build

# Tests backend
cd backend && ./vendor/bin/phpunit

# Auditorías
cd backend && composer audit
cd frontend && npm audit --production
```

- Migrations y seeders: ver `database/migrations` y `database/seeders`.


