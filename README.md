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
                    │  │ HTTPS    │  └────┬─────┘ │
                    │  └──────────┘       │        │
                    │               ┌─────▼──────┐ │
                    │               │  DATABASE  │ │
                    │               │  MySQL 8   │ │
                    │               └────────────┘ │
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
