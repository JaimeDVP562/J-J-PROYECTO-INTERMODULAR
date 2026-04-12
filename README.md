# J-J Proyecto Intermodular — Sistema ERP de Gestión Empresarial

Aplicación web full-stack para la gestión integral de un negocio: facturación, ventas, inventario, empleados, control de jornadas y estadísticas.

## Descripción

Sistema ERP (Enterprise Resource Planning) modular desarrollado como proyecto intermodular de DAW. Permite a administradores gestionar todos los recursos de la empresa desde un panel centralizado, y a los empleados (vendedores/gerentes) operar en el punto de venta, controlar su jornada laboral y consultar su actividad diaria.

## Objetivos

- Desarrollar una API REST con Laravel 12 que sirva como backend unificado.
- Implementar una SPA con Angular 20 como interfaz de usuario.
- Desplegar la infraestructura completa en AWS mediante Terraform.
- Automatizar el ciclo CI/CD con GitHub Actions.
- Aplicar buenas prácticas de seguridad en todos los niveles (autenticación, autorización, HTTPS, WAF).

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 20 (Standalone Components) |
| Backend | Laravel 12 (PHP 8.3) |
| Base de datos | MySQL 8.0 |
| Autenticación | Bearer Token (API Token propio) |
| Infraestructura | Terraform + AWS EC2 |
| Servidor web | Apache 2 + ModSecurity (WAF) |
| HTTPS | Let's Encrypt / Certbot |
| DNS | AWS Route53 |
| CI/CD | GitHub Actions |
| Entorno local | Docker Compose |
| Control de versiones | Git + GitHub |

## Arquitectura

```
Internet
   │
   ▼
┌─────────────┐     ┌──────────────────────────────┐
│   BASTION   │────▶│  VPC Privada (Route53 DNS)   │
│  (SSH Jump) │     │                              │
└─────────────┘     │  ┌──────────┐  ┌──────────┐ │
        EIP ──────▶ │  │ FRONTEND │  │   API    │ │
                    │  │ Apache   │──▶│ Laravel  │ │
                    │  │ Angular  │  │ PHP 8.2  │ │
                    │  └──────────┘       │        │
                    └──────────────────────────────┘
```

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 20+](https://nodejs.org/)
- [PHP 8.3+](https://www.php.net/) y [Composer](https://getcomposer.org/)
- [Terraform](https://www.terraform.io/) (para despliegue en AWS)
- [AWS CLI](https://aws.amazon.com/cli/) configurado (para despliegue)

## Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/<usuario>/J-J-PROYECTO-INTERMODULAR.git
cd J-J-PROYECTO-INTERMODULAR

# 2. Levantar todos los servicios con Docker Compose
docker compose up --build

# Servicios disponibles:
# Frontend  → http://localhost
# API       → http://localhost:8000
# phpMyAdmin → http://localhost:8080
# MySQL     → localhost:3306
```

### Credenciales por defecto (desarrollo)

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@negocio.test | password |
| Gerente | gerente@negocio.test | password |
| Vendedor | vendedor1@negocio.test | password |

## Despliegue en AWS

```bash
cd despliegue

# Inicializar Terraform
terraform init

# Revisar el plan
terraform plan

# Aplicar infraestructura
terraform apply

# Ver IPs generadas (usar para configurar GitHub Secrets)
terraform output
```

### GitHub Secrets necesarios

| Secret | Descripción |
|--------|-------------|
| `SSH_PRIVATE_KEY` | Clave privada PEM de AWS (vockey) |
| `BASTION_HOST` | IP elástica del Bastion (`terraform output bastion_elastic_ip`) |
| `API_HOST` | IP privada del servidor API (`terraform output api_private_ip`) |
| `FRONTEND_HOST` | IP pública del Frontend (`terraform output frontend_public_ip`) |
| `APP_KEY` | Clave Laravel (`php artisan key:generate --show`) |
| `DB_HOST` | IP privada de la BD (`terraform output database_private_ip`) |
| `DB_PASSWORD` | Contraseña generada en `/root/mysql_credentials.txt` del servidor BD |

## Pipeline CI/CD

El pipeline de GitHub Actions se activa en cada push a `main`:

1. **Tests Backend** — `php artisan test`
2. **Tests Frontend** — `ng test --watch=false`
3. **Build Frontend** — `ng build --configuration production`
4. **Deploy Backend** → EC2 API (rsync + composer + migrate)
5. **Deploy Frontend** → EC2 Frontend (rsync + apache restart)

## Seguimiento del Proyecto

- **Trello (Sprints):** _[Enlace al tablero Trello](#)_
- **Repositorio:** `main` = producción | `develop` = integración | `feature/*` = nuevas funcionalidades

## Equipo

| Nombre | Módulo |
|--------|--------|
| Jesús Ríos | DAWEC (Frontend Angular) |
| Jaime Gavilán | DWES (Backend Laravel) / DAW (Despliegue AWS) |

---

## Estado de Requisitos por Módulo

> `[OBL]` = Obligatorio · `[OPC]` = Opcional / Se valorará

---

### ✅ Requisitos Cumplidos

#### DIW — Diseño de Interfaces Web

- `[OBL]` Principios del diseño: paleta de color corporativa coherente (`#0a2342`, `#17375e`, semáforo verde/naranja/rojo), jerarquía tipográfica y contraste
- `[OBL]` Buenas prácticas en estilos: CSS con alcance por componente, nomenclatura semántica (`.stat-card`, `.balance-card.ingresos`…), Flexbox y CSS Grid, media queries responsivas
- `[OBL]` Transiciones en interacciones y estados hover/focus definidos en todos los botones

---

#### DAW — Despliegue de Aplicaciones Web

- `[OBL]` Despliegue realizado en AWS
- `[OBL]` 4 instancias EC2 (Bastion, Frontend, API, Database)
- `[OBL]` Sin Elastic Beanstalk ni servicios de aprovisionamiento simplificado
- `[OBL]` Infraestructura definida en Terraform (`despliegue/main.tf`)
- `[OBL]` Pipeline CI/CD con GitHub Actions (`.github/workflows/deploy.yml`)
- `[OBL]` Servidor web Apache con PHP 8.2 + Laravel integrados en EC2 API
- `[OBL]` IP elástica (`aws_eip`) asignada al Bastion, accesible por SSH
- `[OBL]` HTTPS con Certbot / Let's Encrypt en el servidor Frontend
- `[OPC]` Base de datos MySQL en EC2 dedicado (instancia `Database`)
- `[OPC]` WAF ModSecurity activo en servidor Frontend y en modo detección en API
- `[OPC]` DNS privado con AWS Route53 (zona privada con 4 registros A)

---

#### DWES — Desarrollo Web en Entorno Servidor

- `[OBL]` Laravel 12 con PHP 8.3
- `[OBL]` Base de datos MySQL 8.0
- `[OBL]` Dos o más roles diferenciados: `admin`, `gerente`, `vendedor`
- `[OBL]` Todo el esquema construido mediante Migraciones (31 migraciones, sin PHPMyAdmin)
- `[OBL]` Datos poblados con Seeders (11 seeders) y Factory (`UserFactory`)
- `[OBL]` Protección de rutas con `Route::middleware(...)->group(...)` en `routes/api.php`
- `[OBL]` API REST completa con más de 60 endpoints usando `apiResource` y rutas personalizadas
- `[OBL]` Control de versiones con Git

---

#### DAWEC — Desarrollo de Aplicaciones Web en Entorno Cliente

- `[OBL]` Proyecto generado con Angular CLI 20.3 (LTS)
- `[OBL]` Control de versiones con Git y GitHub — rama `main` de producción, ramas `develop` y `feature/*`
- `[OBL]` Routing configurado con guards (`AuthGuard`, `AdminGuard`) en `app.routes.ts`
- `[OBL]` Token almacenado en `localStorage` (`api_token`, `current_user`)
- `[OBL]` Módulo de administración (`/usuarios`) accesible únicamente con rol admin o gerente
- `[OBL]` Services: `AuthService` y `ApiService`
- `[OBL]` README en la raíz con título, descripción, objetivos y tecnologías
- `[OBL]` Conexión con la API REST del módulo DWES (45+ métodos en `ApiService`)

---

### ❌ Requisitos No Cumplidos

#### DIW — Diseño de Interfaces Web

- `[OBL]` **Framework o librería de estilos** — CSS vanilla puro; sin Bootstrap, Tailwind, Material ni similar
- `[OPC]` **Guía de estilos documentada** — paleta coherente en código pero sin documento formal
- `[OPC]` **Herramienta de prototipado (Figma u otra)** — sin prototipos ni mockups en el repositorio

---

#### DAW — Despliegue de Aplicaciones Web

- `[OPC]` **RDS** — se usa EC2 con MySQL en lugar de RDS
- `[OPC]` **Balanceador de carga** — sin ELB ni instancia EC2 dedicada como balanceador
- `[OPC]` **AWS CodeDeploy** — no implementado
- `[OPC]` **Servidor FTP seguro** — sin SFTP ni FTPS

---

#### DWES — Desarrollo Web en Entorno Servidor

- `[OBL]` **Laravel Breeze o Jetstream** — autenticación completamente personalizada con tokens propios
- `[OBL]` **Laravel Sanctum** — tokens manuales (`api_token` en tabla `users`) en lugar de Sanctum
- `[OBL]` **Panel de administración con Blade** — proyecto API REST pura; el admin vive en Angular, sin vistas Blade
- `[OBL]` **Documentación Swagger / OpenAPI** — sin paquete ni anotaciones en los controllers
- `[OBL]` **Esquema Entidad-Relación** — sin diagrama E/R documentado en el repositorio
- `[OBL]` **Factories para todos los modelos** — solo existe `UserFactory`; faltan Producto, Cliente, Factura, etc.
- `[OBL]` **Nombrado explícito de rutas con `->name(...)`** — solo nombres automáticos de `apiResource()`

---

#### Optativa — React / Micro-frontends

- `[OPC]` **Componentes React como widgets** — sin integración React; todo el frontend es Angular
- `[OPC]` **Arquitectura micro-frontend** — SPA Angular monolítica sin módulos independientes

---

#### IPE2 — Plan de Empresa

- `[OBL]` **Marca, slogan y propuesta de valor** — sin documentación de identidad de marca en el repositorio
- `[OBL]` **Trámites jurídicos y plan de empresa** — sin documento de plan de empresa incorporado al proyecto

---

#### Inglés — Presentación

- `[OBL]` **Introducción y conclusión en inglés** — pendiente de preparar diapositivas y exposición oral en inglés (2-3 min por parte, todos los miembros del equipo)

---

#### DAWEC — Desarrollo de Aplicaciones Web en Entorno Cliente

- `[OBL]` **Release con tag de versión en Git** — sin ningún `git tag` en el repositorio
- `[OBL]` **Trello con sprints** — sin enlace a tablero Trello con seguimiento de tareas
- `[OBL]` **`@Input()` / `@Output()`** — sin comunicación padre-hijo entre componentes
- `[OBL]` **`try...catch` / `catchError` en peticiones HTTP** — `ApiService` no maneja errores; solo el interceptor captura el 401
- `[OBL]` **Tests unitarios en Angular** — sin archivos `.spec.ts`
- `[OBL]` **Tests de Angular en GitHub Actions** — el workflow solo ejecuta `build`, no `ng test`
- `[OPC]` **Librería de componentes UI** — CSS vanilla, sin Material Design, PrimeNG ni similar


### Estado de requisitos (análisis)

- ✅ Angular CLI 20 LTS para el proyecto frontend. (Angular 20 detectado)
- ⚠️ Control de versiones con Git/GitHub; rama `main` de producción y release final etiquetado (tag). (Git/GitHub presente; no se encontraron `git tag` en el repo)
- ⚠️ Uso de ramas (feature/*) y Pull Requests para integración. (Workflow recomendado, ramas no verificadas en lectura estática)
- ✅ README en GitHub con título, descripción, objetivos y tecnologías.
- ❌ Enlace a Trello (o similar) con gestión de tareas y sprints. (no encontrado)
- ✅ Routing en la aplicación (Angular routing) y guards para rutas protegidas. (guards detectados)

- Comunicación entre componentes (Angular):
  - ❌ Uso de `@Input()` / `@Output()`. (no detectado)
  - ✅ Uso de `Services` para compartir lógica y datos. (`AuthService`, `ApiService` presentes)

- ✅ Consumo de API: conexión desde Angular a la API desarrollada en Laravel (HttpClient usado).

- ✅ Backend: Laravel 12 y PHP 8.x.
- ✅ Base de datos: MySQL 8.x.

- Autenticación y seguridad:
  - ❌ Panel de administración con autenticación tradicional (Breeze/Jetstream). (no implementado)
  - ❌ API Security: Laravel Sanctum para tokens de acceso en la API. (no implementado; uso de `api_token` personalizado)
  - ⚠️ Separación de autenticación (Admin → sesiones / Usuario → tokens). (admin usa frontend/Angular, no sesiones Blade)

- ✅ Validación: uso de validadores (`validate()` / FormRequest parcial detectado en controllers).
- ❌ Feedback visual de errores en vistas (Blade). (no hay panel Blade)

- ✅ Esquema y datos: todo el esquema se construye mediante Migraciones (31 migraciones detectadas).
- ⚠️ Uso de Seeders y Factories: Seeders aplicados (11 seeders), pero Factories completas NO (solo `UserFactory` existe).
- ❌ Diagrama Entidad-Relación (E/R) incluido en el repositorio. (no encontrado)

- Rutas y lógica:
  - ✅ Protección de rutas y zonas privadas (`Route::middleware(...)` en `routes/api.php`).
  - ✅ Agrupación de rutas por funcionalidad (`Route::group`).
  - ❌ Nombrado explícito de rutas con `->name(...)`. (no generalizado; `apiResource` usado)
  - ✅ Separación entre `web.php` (vistas) y `api.php` (API REST).

- API REST:
  - ❌ API REST para usuarios con autenticación mediante Sanctum. (Sanctum no implementado)
  - ✅ CRUD para entidades principales (productos, ventas, facturas, etc.).
  - ❌ Documentación Swagger / OpenAPI (no detectada).
  - ✅ Consumida por el frontend Angular.

- Frontend cliente (SPA):
  - ✅ Token almacenado en `localStorage` (`api_token`, `current_user`).
  - ❌ Manejo de errores en peticiones HTTP (`try/catch` o `catchError`) a nivel de `ApiService`. (solo interceptor trata 401)

- Roles y permisos:
  - ✅ Mínimo dos roles: `admin`, `gerente`, `vendedor` (roles detectados in seeders/migrations).
  - ✅ Módulo de administración accesible por rol (guards/middleware presentes).
  - ❌ Diferenciación Admin → Blade (no implementado; admin en Angular).

- Panel de administración:
  - ❌ Uso de Blade (layouts, components, slots). (no implementado)
  - ⚠️ Paginación en listados (`paginate()`) — no verificada en todos los endpoints (parcial).
  - ✅ CRUD desde la interfaz (Angular) disponible para entidades principales.

- Pruebas y CI:
  - ❌ Tests backend (PHPUnit) completos — sólo tests ejemplo/placeholder detectados.
  - ❌ Tests frontend (Angular) — no se encontraron `.spec.ts`.
  - ❌ Ejecución de tests en CI (GitHub Actions) antes del deploy — workflow no verificado en lectura estática.

- Despliegue e infra:
  - ✅ Infraestructura descrita en Terraform (`despliegue/`).
  - ✅ Despliegue en AWS (EC2) definido en Terraform.
  - ✅ IP elástica (`aws_eip`) para Bastion en Terraform.
  - ✅ HTTPS con Certbot/Let's Encrypt en plantillas de despliegue (user-data templates).
  - ⚠️ Pipelines CI/CD para deploy automatizado (referenciado en README; workflow no comprobado en repo durante análisis estático).

- Diseño (DIW):
  - ✅ Principios de diseño y buenas prácticas CSS señaladas como cumplidas en el repositorio.

- IPE2 (empresa):
  - ❌ Documentación de marca, slogan y plan legal financiera (no encontrada).

- Presentación:
  - ❌ Introducción y conclusión en inglés preparadas (material no incluido en el repo).
