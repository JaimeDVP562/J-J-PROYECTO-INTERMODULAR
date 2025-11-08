# 🏢 PROYECTO FINAL - MINI ERP MODULAR

> **Proyecto Final de Curso 2025-26**  
> Sistema ERP escalable y modular con activación de módulos por suscripción

---

## 📋 ÍNDICE

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Módulos del ERP](#módulos-del-erp)
5. [Sistema de Roles y Permisos](#sistema-de-roles-y-permisos)
6. [Base de Datos Multi-Tenant](#base-de-datos-multi-tenant)
7. [Planes de Suscripción](#planes-de-suscripción)
8. [Despliegue en AWS](#despliegue-en-aws)
9. [Roadmap de Desarrollo](#roadmap-de-desarrollo)

---

## 🎯 DESCRIPCIÓN DEL PROYECTO

Mini ERP **SaaS modular y escalable** que permite a las empresas activar solo los módulos que necesitan según su plan de suscripción. El sistema implementa:

- ✅ **Multi-tenant:** Una instalación para múltiples empresas
- ✅ **Módulos activables:** Cada empresa activa solo lo que contrata
- ✅ **Roles y permisos granulares:** Control total de accesos
- ✅ **Escalable:** Arquitectura preparada para crecer
- ✅ **SaaS:** Modelo de negocio por suscripción

---

## 🛠️ STACK TECNOLÓGICO

### Backend
- **Framework:** Laravel 10+ (PHP 8.2+)
- **API:** RESTful API
- **Autenticación:** Laravel Sanctum / JWT
- **Base de Datos:** MySQL 8.0 / PostgreSQL
- **Cache:** Redis
- **Colas:** Laravel Queues + Redis
- **WebSockets:** Laravel Echo + Pusher (notificaciones en tiempo real)

### Frontend
- **React 18+** (Módulos principales: Facturación, Stock, CRM)
- **Angular 17+** (Módulos secundarios: Control Horario, Vacaciones, RRHH)
- **State Management:** Redux (React) / NgRx (Angular)
- **UI Framework:** Tailwind CSS / Material UI
- **Routing:** React Router / Angular Router

### Despliegue
- **Hosting:** AWS
- **Servidores:** EC2
- **Base de Datos:** RDS (MySQL/PostgreSQL)
- **Almacenamiento:** S3
- **CDN:** CloudFront
- **Balanceo:** Elastic Load Balancer
- **DNS:** Route 53
- **CI/CD:** GitHub Actions / AWS CodePipeline

---

## 🏗️ ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React/Angular)              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Dashboard │ │Facturación│ │   Stock  │ │   CRM    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS/REST API
┌──────────────────────▼──────────────────────────────────┐
│              API GATEWAY (Laravel)                       │
│  ┌────────────────────────────────────────────────┐     │
│  │  Autenticación (Sanctum/JWT)                   │     │
│  │  Autorización (Roles & Permissions)            │     │
│  │  Rate Limiting                                 │     │
│  └────────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              BACKEND - MÓDULOS (Laravel)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Facturación│ │   Stock  │ │   CRM    │ │   RRHH   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Proyectos│ │  Horario │ │Vacaciones│ │   BI     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
│  MySQL/RDS   │ │  Redis   │ │  S3 Files  │
│  (Datos)     │ │  (Cache) │ │(Documentos)│
└──────────────┘ └──────────┘ └────────────┘
```

---

## 🧩 MÓDULOS DEL ERP

### **FASE 1 - MVP (Mínimo Viable Product)**

#### 1. 🔐 Autenticación y Gestión de Usuarios
- Login/Logout
- Registro de empresas (trial de 30 días)
- Roles y permisos
- Multi-tenant

#### 2. 📊 Dashboard Principal
- KPIs generales
- Gráficos de ventas, stock, horarios
- Accesos rápidos a módulos
- Notificaciones

#### 3. 💰 Contabilidad / Facturación
- Crear, editar, eliminar facturas
- Listado y buscador de facturas
- Estados: Borrador, Enviada, Pagada, Vencida
- Exportar a PDF
- Enviar por email
- Clientes y productos asociados
- Estadísticas de facturación

#### 4. 📦 Gestión de Stock / Inventario
- Alta, baja, modificación de productos
- Control de existencias
- Alertas de stock mínimo
- Movimientos de entrada/salida
- Categorías de productos
- Códigos de barras
- Historial de movimientos

#### 5. ⏰ Control Horario
- Fichar entrada/salida
- Resumen diario/semanal/mensual
- Cálculo de horas trabajadas
- Horas positivas/negativas
- Vista empleado vs vista admin
- Exportar informes
- Gráficos de productividad

#### 6. ⚙️ Configuración General
- Datos de la empresa
- Gestión de usuarios
- Roles y permisos
- Preferencias del sistema
- Activación/desactivación de módulos

---

### **FASE 2 - AMPLIACIÓN**

#### 7. 🏖️ Gestión de Vacaciones
- Solicitar vacaciones
- Aprobar/rechazar (admin/manager)
- Calendario compartido
- Días disponibles/consumidos/pendientes
- Historial de solicitudes
- Notificaciones automáticas

#### 8. 👥 CRM (Customer Relationship Management)
- Base de datos de clientes
- Contactos y empresas
- Historial de interacciones
- Oportunidades de venta
- Pipeline de ventas
- Seguimiento de leads
- Tareas y recordatorios

#### 9. 🛒 Gestión de Compras / Proveedores
- Alta de proveedores
- Órdenes de compra
- Recepción de mercancía
- Pagos a proveedores
- Historial de compras
- Evaluación de proveedores
- Alertas de pedidos pendientes

#### 10. 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real (WebSockets)
- Email automático
- Centro de notificaciones
- Alertas configurables por módulo

---

### **FASE 3 - ESCALABILIDAD**

#### 11. 📋 Gestión de Proyectos
- Crear proyectos
- Tareas y subtareas (Kanban, Lista)
- Asignación de recursos/personal
- Seguimiento de tiempos por proyecto
- Presupuesto vs Real
- Entregables y milestones
- Gantt opcional

#### 12. 👨‍💼 RRHH (Recursos Humanos)
- Expedientes de empleados
- Contratos y documentación
- Nóminas (integración con contabilidad)
- Evaluaciones de desempeño
- Formación y capacitaciones
- Bajas y ausencias médicas
- Organigrama

#### 13. 📈 Business Intelligence / Reportes
- KPIs avanzados
- Gráficos interactivos (Chart.js, D3.js)
- Comparativas mensuales/anuales
- Informes personalizables
- Exportación a Excel/PDF
- Dashboard ejecutivo

#### 14. 📞 Mesa de Ayuda / Tickets
- Sistema de tickets (soporte interno/externo)
- Asignación automática
- Prioridades (baja, media, alta, crítica)
- SLAs configurables
- Base de conocimiento (FAQ)
- Historial de incidencias

---

### **FASE 4 - AVANZADO**

#### 15. 📄 Gestión Documental
- Repositorio de documentos
- Control de versiones
- Carpetas por proyecto/cliente/empleado
- Permisos por rol
- Búsqueda avanzada
- Previsualización de archivos
- Firma electrónica

#### 16. 💵 Tesorería / Flujo de Caja
- Previsión de ingresos/gastos
- Cuentas bancarias
- Conciliación bancaria
- Movimientos de caja
- Gráficos de flujo de efectivo
- Alertas de saldo bajo

#### 17. 🚗 Gestión de Activos
- Inventario de equipos (ordenadores, vehículos, maquinaria)
- Mantenimientos programados
- Asignación a empleados
- Depreciación
- Garantías y seguros
- Historial de reparaciones

#### 18. 🌍 Multi-empresa / Multi-sede
- Gestionar varias empresas desde un ERP
- Consolidación de datos
- Permisos por empresa/sede
- Reportes consolidados

#### 19. 🔍 Auditoría / Logs
- Registro de todas las acciones
- Quién hizo qué y cuándo
- Trazabilidad completa
- Exportar logs
- Buscar eventos específicos

#### 20. 📱 App Móvil (PWA)
- Fichar desde móvil con geolocalización
- Consultar vacaciones
- Aprobar solicitudes
- Ver notificaciones
- Dashboard móvil

---

## 🔐 SISTEMA DE ROLES Y PERMISOS

### Roles del Sistema

```
┌─────────────────────────────────────────────────┐
│  SUPER ADMIN (Desarrollador/Soporte)            │
├─────────────────────────────────────────────────┤
│  ✅ Acceso a TODAS las empresas                  │
│  ✅ Gestionar módulos globales                   │
│  ✅ Activar/desactivar empresas                  │
│  ✅ Ver facturación de todas las empresas        │
│  ✅ Impersonate (acceder como otro usuario)      │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  ADMIN EMPRESA (Administrador de la empresa)    │
├─────────────────────────────────────────────────┤
│  ✅ Dashboard completo de su empresa             │
│  ✅ Gestionar usuarios de su empresa             │
│  ✅ Activar módulos contratados                  │
│  ✅ Acceso total a módulos activos               │
│  ✅ Configuración de la empresa                  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  MANAGER (Gerente/Jefe de Área)                 │
├─────────────────────────────────────────────────┤
│  ✅ Ver informes de su área                      │
│  ✅ Aprobar solicitudes (vacaciones, compras)    │
│  ✅ Gestionar equipo asignado                    │
│  ✅ Acceso lectura/escritura a módulos asignados │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  EMPLEADO (Usuario estándar)                    │
├─────────────────────────────────────────────────┤
│  ✅ Ver solo sus datos personales                │
│  ✅ Fichar entrada/salida                        │
│  ✅ Solicitar vacaciones                         │
│  ✅ Consultar sus nóminas                        │
│  ✅ Acceso limitado según permisos               │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  VIEWER (Solo lectura)                          │
├─────────────────────────────────────────────────┤
│  ✅ Ver dashboards                               │
│  ✅ Ver informes                                 │
│  ❌ No puede crear ni modificar nada             │
└─────────────────────────────────────────────────┘
```

### Permisos Granulares por Módulo

Cada módulo tiene permisos específicos:
- **view** - Ver datos
- **create** - Crear registros
- **edit** - Editar registros
- **delete** - Eliminar registros
- **approve** - Aprobar solicitudes
- **export** - Exportar datos

Ejemplos:
- `facturacion.view` - Ver facturas
- `facturacion.create` - Crear facturas
- `facturacion.export` - Exportar facturas a PDF/Excel
- `rrhh.approve` - Aprobar solicitudes de RRHH
- `stock.edit` - Editar productos del inventario

---

## 🗄️ BASE DE DATOS MULTI-TENANT

### Tablas Core del Sistema

#### 1. **companies** (Empresas/Organizaciones)
```sql
id, name, slug, email, phone, address, city, country,
plan (basic, professional, premium, enterprise),
trial_ends_at, subscription_starts_at, subscription_ends_at,
is_active, created_at, updated_at
```

#### 2. **modules** (Módulos disponibles)
```sql
id, name, slug, description, icon, color,
requires_plan (basic, professional, premium, enterprise),
is_active, order, created_at, updated_at
```

#### 3. **company_modules** (Módulos activos por empresa)
```sql
id, company_id, module_id,
activated_at, expires_at, is_active,
created_at, updated_at
```

#### 4. **users** (Usuarios del sistema)
```sql
id, company_id, name, email, password, phone, avatar,
role_id, is_active, email_verified_at,
last_login_at, created_at, updated_at
```

#### 5. **roles** (Roles)
```sql
id, company_id (null = rol global), name, slug,
description, created_at, updated_at
```

#### 6. **permissions** (Permisos)
```sql
id, module_id, name, slug, description,
created_at, updated_at
```

#### 7. **role_permissions** (Asignación permisos a roles)
```sql
id, role_id, permission_id
```

#### 8. **audit_logs** (Logs de auditoría)
```sql
id, company_id, user_id, action, module, model_type,
model_id, old_values (JSON), new_values (JSON),
ip_address, user_agent, created_at
```

### Tablas por Módulo

#### Facturación
- `invoices` (facturas)
- `invoice_items` (líneas de factura)
- `clients` (clientes)
- `payment_methods` (métodos de pago)
- `taxes` (impuestos)

#### Stock
- `products` (productos)
- `categories` (categorías)
- `warehouses` (almacenes)
- `stock_movements` (movimientos)
- `inventory` (inventario actual)

#### CRM
- `crm_contacts` (contactos)
- `crm_companies` (empresas cliente)
- `crm_opportunities` (oportunidades)
- `crm_activities` (actividades)
- `crm_pipeline_stages` (etapas del pipeline)

#### Control Horario
- `time_entries` (fichajes)
- `time_schedules` (horarios)
- `time_reports` (informes)

#### Vacaciones
- `vacation_requests` (solicitudes)
- `vacation_balances` (saldo de días)
- `vacation_policies` (políticas de vacaciones)

*(Y así sucesivamente para cada módulo...)*

---

## 💼 PLANES DE SUSCRIPCIÓN

### Plan Básico - 49€/mes
- ✅ Facturación
- ✅ Stock (hasta 500 productos)
- ✅ Control Horario (hasta 10 empleados)
- ✅ 5 usuarios
- ✅ 1 GB almacenamiento

### Plan Profesional - 99€/mes
- ✅ Todo lo del Plan Básico
- ✅ CRM
- ✅ Gestión de Proyectos
- ✅ Gestión de Vacaciones
- ✅ Gestión de Compras
- ✅ Stock ilimitado
- ✅ 20 usuarios
- ✅ 10 GB almacenamiento

### Plan Premium - 199€/mes
- ✅ Todo lo del Plan Profesional
- ✅ RRHH Completo
- ✅ Business Intelligence
- ✅ Gestión Documental
- ✅ Mesa de Ayuda
- ✅ Tesorería
- ✅ API Access
- ✅ 50 usuarios
- ✅ 50 GB almacenamiento
- ✅ Soporte prioritario

### Plan Enterprise - Personalizado
- ✅ Todos los módulos
- ✅ Multi-empresa
- ✅ Servidor dedicado
- ✅ Desarrollo de módulos personalizados
- ✅ Integración con otros sistemas
- ✅ Usuarios ilimitados
- ✅ Almacenamiento ilimitado
- ✅ SLA garantizado 99.9%
- ✅ Soporte 24/7

---

## ☁️ DESPLIEGUE EN AWS

### Arquitectura AWS

```
Route 53 (DNS)
    ↓
CloudFront (CDN)
    ↓
Application Load Balancer
    ↓
┌─────────────────────────────────┐
│  EC2 Auto Scaling Group          │
│  ┌───────┐  ┌───────┐  ┌───────┐│
│  │ EC2-1 │  │ EC2-2 │  │ EC2-3 ││
│  │Laravel│  │Laravel│  │Laravel││
│  └───────┘  └───────┘  └───────┘│
└─────────────────────────────────┘
    ↓              ↓
┌────────┐    ┌────────┐
│  RDS   │    │ Redis  │
│ MySQL  │    │ElastiCache│
└────────┘    └────────┘
    ↓
┌────────┐
│   S3   │
│(Files) │
└────────┘
```

### Servicios AWS Utilizados

- **EC2:** Servidores para Laravel (t3.medium o superior)
- **RDS:** Base de datos MySQL/PostgreSQL (Multi-AZ para HA)
- **ElastiCache (Redis):** Cache y colas
- **S3:** Almacenamiento de archivos (facturas, documentos)
- **CloudFront:** CDN para frontend React/Angular
- **Route 53:** DNS
- **Application Load Balancer:** Balanceo de carga
- **Auto Scaling:** Escalado automático según demanda
- **CloudWatch:** Monitoreo y logs
- **SNS/SES:** Notificaciones y emails
- **Lambda:** Funciones serverless (tareas programadas)
- **VPC:** Red privada virtual
- **IAM:** Gestión de accesos

### Estimación de Costes AWS (Mensual)

**Entorno Básico:**
- EC2 (2x t3.medium): ~$70
- RDS (db.t3.medium): ~$80
- ElastiCache (cache.t3.micro): ~$15
- S3 (100GB): ~$2.5
- CloudFront (1TB transferencia): ~$85
- **Total aproximado: $250-300/mes**

**Entorno Producción (escalado):**
- EC2 (4x t3.large): ~$280
- RDS (db.m5.large Multi-AZ): ~$350
- ElastiCache (cache.m5.large): ~$120
- S3 (1TB): ~$25
- CloudFront (10TB): ~$750
- Load Balancer: ~$25
- Route 53: ~$1
- **Total aproximado: $1,500-2,000/mes**

---

## 🗺️ ROADMAP DE DESARROLLO

### Mes 1-2: Planificación y Base
- ✅ Diseño completo de base de datos
- ✅ Mockups/wireframes de todas las vistas
- ✅ Setup proyecto Laravel + React/Angular
- ✅ Configuración AWS (VPC, EC2, RDS)
- ✅ CI/CD con GitHub Actions
- ✅ Sistema de autenticación multi-tenant
- ✅ Panel de SuperAdmin

### Mes 3-4: MVP - Fase 1
- Dashboard principal
- Módulo de Facturación completo
- Módulo de Stock completo
- Módulo de Control Horario básico
- Sistema de roles y permisos funcional
- Testing y corrección de bugs

### Mes 5-6: Ampliación - Fase 2
- Módulo de Vacaciones
- Módulo CRM básico
- Módulo de Compras/Proveedores
- Sistema de notificaciones en tiempo real
- Mejoras de UI/UX
- Testing y optimización

### Mes 7-8: Escalabilidad - Fase 3
- Módulo de Proyectos
- Módulo RRHH completo
- Business Intelligence / Reportes avanzados
- Mesa de Ayuda / Tickets
- API REST documentada (Swagger)

### Mes 9-10: Avanzado - Fase 4
- Gestión Documental
- Tesorería / Flujo de Caja
- Gestión de Activos
- Multi-empresa
- App móvil (PWA)

### Mes 11-12: Refinamiento y Lanzamiento
- Testing exhaustivo (unit, integration, E2E)
- Optimización de performance
- Seguridad y auditoría
- Documentación completa
- Plan de marketing
- **Lanzamiento oficial** 🚀

---

## 📚 RECURSOS Y REFERENCIAS

### Documentación Técnica
- Laravel: https://laravel.com/docs
- React: https://react.dev
- Angular: https://angular.io
- AWS: https://docs.aws.amazon.com

### Librerías Útiles
- **Laravel:**
  - Spatie Laravel Permission (roles)
  - Laravel Excel (exportar)
  - Laravel Sanctum (auth)
  - Laravel Queues (trabajos en segundo plano)
  
- **React:**
  - Redux Toolkit
  - React Query
  - Axios
  - Chart.js / Recharts
  
- **Angular:**
  - NgRx
  - Angular Material
  - PrimeNG

### Inspiración (ERPs existentes)
- Odoo
- ERPNext
- Dolibarr
- SAP Business One

---

## 📝 NOTAS IMPORTANTES

### Consideraciones de Seguridad
- ✅ HTTPS obligatorio en producción
- ✅ Encriptación de datos sensibles
- ✅ Backups automáticos diarios
- ✅ 2FA para admins
- ✅ Rate limiting en API
- ✅ Validación exhaustiva de inputs
- ✅ Protección contra SQL Injection, XSS, CSRF
- ✅ Logs de auditoría completos

### Performance
- ✅ Cache agresivo (Redis)
- ✅ Lazy loading de módulos
- ✅ Paginación en listados
- ✅ Índices optimizados en BD
- ✅ CDN para assets estáticos
- ✅ Compresión Gzip/Brotli

### Escalabilidad
- ✅ Código modular y desacoplado
- ✅ Microservicios (opcional, más adelante)
- ✅ Colas para tareas pesadas
- ✅ Auto-scaling en AWS
- ✅ Database sharding (si es necesario)

---

## 🎓 CRITERIOS DE EVALUACIÓN (Proyecto Final)

### Funcionalidad (40%)
- Módulos implementados funcionan correctamente
- Navegación fluida
- Sin errores críticos
- Requisitos cumplidos

### Código (30%)
- Buenas prácticas (PSR-12 en PHP, ESLint en JS)
- Código limpio y comentado
- Arquitectura escalable
- Testing (unit, integration)

### Diseño (15%)
- UI/UX profesional
- Responsive design
- Accesibilidad (WCAG 2.1)
- Consistencia visual

### Despliegue (15%)
- Aplicación desplegada en AWS
- CI/CD configurado
- Dominio propio
- HTTPS activo
- Monitoreo básico

---

## 🚀 ¡ADELANTE CON EL PROYECTO!

Este README es tu guía completa. Guárdalo bien y úsalo como referencia durante todo el desarrollo.

**Próximos pasos:**
1. Estudiar la SPA actual (proyectoServicioTécnico)
2. Crear nuevo proyecto Laravel + React/Angular
3. Diseñar esquema de BD completo
4. Empezar con el MVP (Fase 1)

---

*Última actualización: Noviembre 2025*  
*Proyecto Final - Curso 2025-26*
