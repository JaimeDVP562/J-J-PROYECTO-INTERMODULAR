# J-J ERP — Sistema de Gestión Empresarial

Aplicación web full-stack para la gestión integral de un negocio: facturación, ventas, inventario, empleados, control de jornadas y estadísticas.

---

## Descripción

Sistema ERP (Enterprise Resource Planning) modular desarrollado como proyecto intermodular de DAW. Permite a administradores gestionar todos los recursos de la empresa desde un panel centralizado, y a los empleados (vendedores / gerentes) operar en el punto de venta, controlar su jornada laboral y consultar su actividad diaria.

---

## Objetivos

- Desarrollar una API REST con Laravel 12 como backend unificado.
- Implementar una SPA con Angular 20 como interfaz principal.
- Ofrecer un panel de administración web con Blade para gestión interna.
- Desplegar la infraestructura completa en AWS mediante Terraform.
- Automatizar el ciclo CI/CD con GitHub Actions.
- Aplicar buenas prácticas de seguridad en todos los niveles.

---

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend SPA | Angular 20 (Standalone Components) |
| Panel Admin | Blade + Bootstrap 5 + Bootstrap Icons |
| Backend | Laravel 12 (PHP 8.3) |
| Base de datos | MySQL 8.0 |
| Autenticación API | Laravel Sanctum (Bearer Token) |
| Autenticación Admin | Laravel Breeze pattern (sesiones web) |
| Documentación API | OpenAPI 3.0 / Swagger (`docs/openapi.yaml`) |
| Infraestructura | Terraform + AWS EC2 |
| Servidor web | Apache 2 + ModSecurity (WAF) |
| HTTPS | Let's Encrypt / Certbot |
| DNS | AWS Route53 |
| CI/CD | GitHub Actions |
| Entorno local | Docker Compose |
| Control de versiones | Git + GitHub |

---

## Arquitectura

```
Internet
   │
   ▼
┌─────────────┐     ┌─────────────────────────────────┐
│   BASTION   │────▶│   VPC Privada (Route53 DNS)     │
│  (SSH Jump) │     │                                 │
└─────────────┘     │  ┌──────────┐   ┌───────────┐  │
        EIP ──────▶ │  │ FRONTEND │   │    API    │  │
                    │  │ Apache   │──▶│  Laravel  │  │
                    │  │ Angular  │   │  PHP 8.3  │  │
                    │  └──────────┘   └─────┬─────┘  │
                    │                       │        │
                    │               ┌───────▼──────┐  │
                    │               │   Database   │  │
                    │               │   MySQL 8.0  │  │
                    │               └──────────────┘  │
                    └─────────────────────────────────┘
```

---

## Puesta en marcha local

### Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Git

### Arranque

```bash
# 1. Clonar el repositorio
git clone https://github.com/jesusrios/J-J-PROYECTO-INTERMODULAR.git
cd J-J-PROYECTO-INTERMODULAR

# 2. Levantar todos los servicios
docker compose up --build -d
```

Los contenedores ejecutan automáticamente `composer install`, migraciones y seeders.

### URLs disponibles

| Servicio | URL |
|----------|-----|
| Frontend (Angular SPA) | http://localhost |
| API REST (Laravel) | http://localhost:8000 |
| Panel Admin (Blade) | http://localhost:8000/admin |
| phpMyAdmin | http://localhost:8080 |

### Credenciales de desarrollo

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@negocio.test | password |
| Gerente | gerente@negocio.test | password |
| Vendedor | vendedor1@negocio.test | password |

---

## Guía de despliegue en AWS

### ¿Por qué hay que compilar el frontend antes de desplegar?

Angular es un framework TypeScript: el código fuente **no puede ejecutarse directamente en el navegador**. Antes de desplegar hay que compilarlo con `ng build --configuration production`, que realiza:

- Transpilación TypeScript → JavaScript compatible con todos los navegadores
- Compilación AOT (Ahead-of-Time): convierte las plantillas HTML en código JavaScript en tiempo de compilación, eliminando el compilador en tiempo de ejecución
- Tree-shaking: elimina el código no utilizado
- Minificación y ofuscación de todos los ficheros
- Hash en los nombres de fichero para cache-busting automático (`main.XXXXXXXX.js`)

El resultado es una carpeta `dist/frontend/browser/` con ficheros estáticos (HTML + JS + CSS) que Apache sirve directamente. **No hace falta Node.js en el servidor de producción**; el CI/CD compila en GitHub Actions y solo sube el resultado al EC2.

---

### Paso 1 — Aprovisionar infraestructura con Terraform

```bash
# Desde la raíz del repositorio
cd despliegue

# Inicializar providers
terraform init

# Revisar qué se va a crear (4 instancias EC2 + VPC + Route53 + EIPs)
terraform plan

# Crear la infraestructura (~3-5 minutos)
terraform apply

# Anotar las IPs de salida — se necesitan para los Secrets de GitHub
terraform output
```

La salida de `terraform output` mostrará:

| Output | Uso |
|--------|-----|
| `bastion_elastic_ip` | `BASTION_HOST` en GitHub Secrets |
| `api_private_ip` | `API_HOST` en GitHub Secrets |
| `frontend_public_ip` | `FRONTEND_HOST` en GitHub Secrets |
| `database_private_ip` | `DB_HOST` en GitHub Secrets |

---

### Paso 2 — Configurar GitHub Secrets

En el repositorio → **Settings → Secrets and variables → Actions**, añadir:

| Secret | Cómo obtenerlo |
|--------|----------------|
| `SSH_PRIVATE_KEY` | Contenido del fichero `.pem` de AWS (vockey) |
| `BASTION_HOST` | `terraform output bastion_elastic_ip` |
| `API_HOST` | `terraform output api_private_ip` |
| `FRONTEND_HOST` | `terraform output frontend_public_ip` |
| `APP_KEY` | Ejecutar `php artisan key:generate --show` en local |
| `DB_HOST` | `terraform output database_private_ip` |
| `DB_PASSWORD` | Contenido de `/root/mysql_credentials.txt` en el servidor BD |

---

### Paso 3 — Primer despliegue (push a main)

El pipeline `.github/workflows/deploy.yml` se activa automáticamente en cada push a `main`. Ejecuta 4 jobs en paralelo donde es posible:

```
push a main
    │
    ├── [Job 1] test-backend ──────────────────────────────────────────┐
    │   PHPUnit sobre PHP 8.3 · composer install · php artisan test    │
    │                                                                  ▼
    │                                                    [Job 3] deploy-backend
    │                                                    rsync → EC2 API
    │                                                    composer install --no-dev
    │                                                    php artisan migrate --force
    │                                                    config:cache · route:cache
    │                                                    restart php8.3-fpm + apache2
    │
    └── [Job 2] build-frontend ────────────────────────────────────────┐
        npm ci --legacy-peer-deps                                      │
        ng build --configuration production                            │
        → artefacto dist/ (1 día retención)                            ▼
                                                        [Job 4] deploy-frontend
                                                        Descarga artefacto dist/
                                                        rsync → EC2 Frontend
                                                        cp dist/* /var/www/frontend/
                                                        restart apache2
```

> Los jobs 3 y 4 solo se ejecutan en `refs/heads/main`. Los tests (jobs 1 y 2) también se ejecutan en PRs.

---

### Paso 4 — Verificar el despliegue

```bash
# Conectar al bastion
ssh -i vockey.pem ubuntu@<BASTION_HOST>

# Desde el bastion, conectar al servidor API
ssh ubuntu@<API_HOST>

# Verificar que Laravel responde
curl http://localhost/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@negocio.test","password":"password"}'

# Verificar el panel admin Blade
curl -I http://localhost/admin/login
```

Desde fuera del bastion:

```bash
# Frontend Angular (HTTPS con certificado Let's Encrypt)
curl -I https://frontend.j-j-proyect.com

# API REST
curl -I https://api.j-j-proyect.com/api/login

# Panel de administración Blade
curl -I https://api.j-j-proyect.com/admin/login
```

---

### Pipeline CI/CD (resumen)

| Workflow | Fichero | Activa en |
|----------|---------|-----------|
| Tests (backend + frontend) | `.github/workflows/tests.yml` | Push/PR a `main` y `develop` |
| Build + Deploy completo | `.github/workflows/deploy.yml` | Push a `main` o manual |

---

### GitHub Secrets necesarios

| Secret | Descripción |
|--------|-------------|
| `SSH_PRIVATE_KEY` | Clave privada PEM de AWS |
| `BASTION_HOST` | IP elástica del Bastion |
| `API_HOST` | IP privada del servidor API |
| `FRONTEND_HOST` | IP pública del Frontend |
| `APP_KEY` | Clave Laravel (`php artisan key:generate --show`) |
| `DB_HOST` | IP privada de la base de datos |
| `DB_PASSWORD` | Contraseña generada en el servidor BD |

---

## Documentación

| Documento | Ruta |
|-----------|------|
| OpenAPI / Swagger spec | `docs/openapi.yaml` |
| Diagrama Entidad-Relación | `docs/er-diagram.md` |

---

## Equipo

| Nombre | Módulo |
|--------|--------|
| Jesús Ríos | DAWEC — Frontend Angular |
| Jaime Gavilán | DWES — Backend Laravel / DAW — Despliegue AWS |

---

## Estado de requisitos

> `[OBL]` = Obligatorio · `[OPC]` = Opcional / Se valorará

---

### DIW — Diseño de Interfaces Web

| Estado | Requisito |
|--------|-----------|
| ✅ OBL | Paleta de color corporativa coherente (`#0a2342`, `#17375e`, semáforo verde/naranja/rojo), jerarquía tipográfica y contraste |
| ✅ OBL | CSS con alcance por componente, nomenclatura semántica, Flexbox, CSS Grid y media queries responsivas |
| ✅ OBL | Transiciones e interacciones hover/focus en todos los botones |
| ✅ OBL | Framework de estilos: Bootstrap 5 + Bootstrap Icons en Angular (`package.json`, `angular.json`) y en panel Blade (CDN) |
| ⚠️ OPC | Guía de estilos documentada — paleta coherente en código, sin documento formal |
| ⚠️ OPC | Herramienta de prototipado (Figma u otra) — sin mockups en el repositorio |

---

### DAW — Despliegue de Aplicaciones Web

| Estado | Requisito |
|--------|-----------|
| ✅ OBL | Despliegue en AWS sin Elastic Beanstalk ni servicios simplificados |
| ✅ OBL | 4 instancias EC2: Bastion, Frontend, API, Database |
| ✅ OBL | Infraestructura definida en Terraform (`despliegue/main.tf`) |
| ✅ OBL | Pipeline CI/CD con GitHub Actions (`.github/workflows/`) |
| ✅ OBL | Servidor web Apache con PHP 8.3 + Laravel en EC2 API |
| ✅ OBL | IP elástica (`aws_eip`) asignada al Bastion |
| ✅ OBL | HTTPS con Certbot / Let's Encrypt en servidor Frontend |
| ✅ OPC | Base de datos MySQL en EC2 dedicado |
| ✅ OPC | WAF ModSecurity activo en Frontend y en modo detección en API |
| ✅ OPC | DNS privado con AWS Route53 (zona privada, 4 registros A) |
| ⚠️ OPC | RDS — se usa EC2 con MySQL en lugar de RDS gestionado |
| ⚠️ OPC | Balanceador de carga — sin ELB |
| ⚠️ OPC | AWS CodeDeploy — no implementado |
| ⚠️ OPC | Servidor FTP seguro — no implementado |

---

### DWES — Desarrollo Web en Entorno Servidor

| Estado | Requisito |
|--------|-----------|
| ✅ OBL | Laravel 12 con PHP 8.3 |
| ✅ OBL | Base de datos MySQL 8.0 |
| ✅ OBL | Tres roles: `admin`, `gerente`, `vendedor` |
| ✅ OBL | Esquema completo mediante migraciones (31 migraciones + `personal_access_tokens`) |
| ✅ OBL | Seeders (11) y Factories (9) para todos los modelos |
| ✅ OBL | Rutas protegidas con `Route::middleware('auth:sanctum')` |
| ✅ OBL | API REST con más de 60 endpoints (`apiResource` + rutas personalizadas) |
| ✅ OBL | Control de versiones con Git / GitHub |
| ✅ OBL | **Laravel Sanctum**: `HasApiTokens`, `createToken()`, guard `auth:sanctum`, tabla `personal_access_tokens` |
| ✅ OBL | **Laravel Breeze** (pattern): `LoginController` con guard `web` y sesiones para el panel admin |
| ✅ OBL | **Panel de administración Blade**: `/admin` con login, dashboard, CRUD usuarios / productos / empleados, listado clientes |
| ✅ OBL | **Swagger / OpenAPI**: spec completa en `docs/openapi.yaml` + anotaciones `@OA\*` en controladores + paquete `darkaonline/l5-swagger` |
| ✅ OBL | **Diagrama Entidad-Relación**: `docs/er-diagram.md` con diagrama ASCII y tabla de relaciones |
| ✅ OBL | **Nombrado explícito de rutas**: todas las rutas con `->name()` o `->names()` en `api.php` y `web.php` |

---

### DAWEC — Desarrollo de Aplicaciones Web en Entorno Cliente

| Estado | Requisito |
|--------|-----------|
| ✅ OBL | Proyecto generado con Angular CLI 20.3 (LTS) |
| ✅ OBL | Control de versiones con Git / GitHub; ramas `main`, `develop`, `feature/*`; tag `v1.0.0` |
| ✅ OBL | Routing con guards (`AuthGuard`, `AdminGuard`) en `app.routes.ts` |
| ✅ OBL | Token almacenado en `localStorage` (`api_token`, `current_user`) |
| ✅ OBL | Módulo de administración (`/usuarios`) con acceso restringido por rol |
| ✅ OBL | Services: `AuthService` y `ApiService` |
| ✅ OBL | README en la raíz con título, descripción, objetivos y tecnologías |
| ✅ OBL | Conexión con la API REST de Laravel (45+ métodos en `ApiService`) |
| ✅ OBL | **`@Input()` / `@Output()`**: `PaginadorComponent` con `@Input() paginaActual/totalPaginas` y `@Output() paginaCambiada`; usado en `UsuariosComponent` |
| ✅ OBL | **`catchError` en peticiones HTTP**: `handleError()` centralizado en `ApiService` aplicado a todos los métodos |
| ✅ OBL | **Tests unitarios Angular**: 3 archivos `.spec.ts` (AuthService, ApiService, PaginadorComponent) con 27 tests |
| ✅ OBL | **Tests en GitHub Actions**: workflow `tests.yml` ejecuta PHPUnit y `ng test` en cada push |
| ⚠️ OBL | Trello con gestión de sprints — pendiente (requiere servicio externo) |
| ⚠️ OPC | Librería de componentes UI — CSS propio + Bootstrap; sin Material Design ni PrimeNG |

---

### IPE2 — Plan de Empresa

| Estado | Requisito |
|--------|-----------|
| ⚠️ OBL | Marca, slogan y propuesta de valor — sin documentación de identidad en el repositorio |
| ⚠️ OBL | Trámites jurídicos y plan de empresa — sin documento incorporado al proyecto |

---

### Inglés — Presentación

| Estado | Requisito |
|--------|-----------|
| ⚠️ OBL | Introducción y conclusión en inglés — pendiente de preparar para la exposición oral |
