# 🚀 Mini ERP API REST - FASE 1 MVP

Aplicación Laravel 11 para gestión empresarial multi-tenant con autenticación Sanctum y API REST completa.

## 📋 Descripción del Proyecto

Sistema ERP modular con funcionalidades para:
- **Autenticación y Multi-tenancy** - Gestión de empresas, usuarios y permisos
- **Facturación** - Clientes, proveedores, facturas e impuestos
- **Gestión de Stock** - Productos, almacenes e inventario
- **Control Horario** - Fichajes, horarios y horas extras
- **Dashboard** - Widgets y métricas KPI

---

## 🗄️ FASE 1 - MODELOS Y RECURSOS (MVP - 28 modelos)

### ✅ AUTENTICACIÓN Y MULTI-TENANT (8 modelos)

| Modelo | Descripción | Recursos |
|--------|------------|----------|
| **Empresa** | Empresa multi-tenant | EmpresaResource |
| **Usuario** | Usuarios del sistema | UsuarioResource |
| **Rol** | Roles de acceso | RolResource |
| **Permiso** | Permisos del sistema | PermisoResource |
| **RolPermiso** | Relación rol-permiso | - |
| **Módulo** | Módulos disponibles | ModuloResource |
| **EmpresaModulo** | Módulos por empresa | - |
| **RegistroAuditoria** | Auditoría de acciones | - |

**Controladores:**
- `AutenticacionController` - Login, registro, logout
- `EmpresaController` - CRUD empresas
- `RolController` - CRUD roles
- `PermisoController` - CRUD permisos
- `ModuloController` - CRUD módulos
- `RegistroAuditoriaController` - Ver auditoría

---

### 💰 FACTURACIÓN / CONTABILIDAD (7 modelos)

| Modelo | Descripción | Recursos |
|--------|------------|----------|
| **Cliente** | Clientes empresa | ClienteResource |
| **Proveedor** | Proveedores empresa | ProveedorResource |
| **Factura** | Facturas emitidas/recibidas | FacturaResource |
| **LineaFactura** | Líneas de factura | LineaFacturaResource |
| **MetodoPago** | Métodos de pago | MetodoPagoResource |
| **Impuesto** | Impuestos/tasas | ImpuestoResource |
| **EstadoFactura** | Estados de factura (lookup) | - |

**Controladores:**
- `ClienteController` - CRUD clientes
- `ProveedorController` - CRUD proveedores
- `FacturaController` - CRUD facturas
- `MetodoPagoController` - CRUD métodos pago
- `ImpuestoController` - CRUD impuestos

---

### 📦 STOCK / INVENTARIO (6 modelos)

| Modelo | Descripción | Recursos |
|--------|------------|----------|
| **Producto** | Productos catálogo | ProductoResource |
| **CategoriaProducto** | Categorías productos | CategoriaProductoResource |
| **Almacen** | Almacenes/depósitos | AlmacenResource |
| **MovimientoStock** | Movimientos inventario | MovimientoStockResource |
| **Inventario** | Stock actual | InventarioResource |
| **AlertaStock** | Alertas stock bajo | - |

**Controladores:**
- `ProductoController` - CRUD productos
- `CategoriaProductoController` - CRUD categorías
- `AlmacenController` - CRUD almacenes
- `MovimientoStockController` - Registrar movimientos
- `InventarioController` - Ver inventario

---

### ⏰ CONTROL HORARIO (4 modelos)

| Modelo | Descripción | Recursos |
|--------|------------|----------|
| **RegistroTiempo** | Fichajes entrada/salida | RegistroTiempoResource |
| **HorarioTrabajo** | Horarios asignados | HorarioTrabajoResource |
| **InformeTiempo** | Reportes de horas | - |
| **RegistroHorasExtras** | Horas extras trabajadas | RegistroHorasExtrasResource |

**Controladores:**
- `RegistroTiempoController` - Fichajes (clock in/out)
- `HorarioTrabajoController` - CRUD horarios
- `RegistroHorasExtrasController` - Registrar horas extras

---

### 📊 DASHBOARD (3 modelos)

| Modelo | Descripción | Recursos |
|--------|------------|----------|
| **WidgetDashboard** | Widgets configurables | - |
| **MetricaKPI** | Métricas KPI | MetricaKPIResource |
| **Actividad** | Registro de actividades | ActividadResource |

**Controladores:**
- `DashboardController` - Obtener datos dashboard
- `MetricasKPIController` - Gestionar KPIs
- `ActividadController` - Historial actividades

---

## 🎯 RESUMEN DE COMPONENTES

### Modelos Generados: **28**
- Modelos con Migration + Factory + Seeder: **16**
- Modelos con Migration + Factory: **5**
- Modelos solo Migration: **7**

### Archivos Creados

| Componente | Cantidad |
|-----------|----------|
| Modelos | 28 |
| Migraciones | 28 |
| Factories | 16 |
| Seeders | 13 |
| Controladores API | 22 |
| Resources | 20 |
| Form Requests | 30+ |
| Policies | 20+ |
| Middleware | 5 |

**Total: ~185 archivos**

---

## 🔐 SEGURIDAD

- **Autenticación:** Laravel Sanctum (token Bearer)
- **Autorización:** Policies + Middleware personalizado
- **Multi-tenancy:** Aislamiento por empresa
- **Validaciones:** Form Requests en todos los endpoints
- **CORS:** Configurado para desarrollo

---

## 🚀 QUICK START

```bash
# 1. Setup inicial
composer create-project laravel/laravel backend-api
cd backend-api
php artisan install:api

# 2. Ejecutar migraciones
php artisan migrate

# 3. Ejecutar seeders
php artisan db:seed

# 4. Iniciar servidor
php artisan serve
```

---

## 📚 Estructura de Carpetas

```
backend-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/
│   │   ├── Requests/Api/V1/
│   │   ├── Resources/Api/V1/
│   │   └── Middleware/
│   ├── Models/
│   └── Policies/
├── database/
│   ├── migrations/
│   ├── factories/
│   └── seeders/
├── routes/
│   └── api.php
└── ...
```

---

## 🔄 RELACIONES PRINCIPALES

```
Empresa (1) → (M) Usuario
Empresa (1) → (M) Cliente
Empresa (1) → (M) Proveedor
Empresa (1) → (M) Producto
Empresa (1) → (M) Almacen
Empresa (M) → (M) Modulo → EmpresaModulo

Rol (M) → (M) Permiso → RolPermiso
Usuario (M) → (1) Rol

Factura (1) → (M) LineaFactura
Factura (1) → (1) Proveedor / Cliente
LineaFactura (M) → (1) Producto
Factura (M) → (1) EstadoFactura

Producto (1) → (M) MovimientoStock
Almacen (1) → (M) Inventario
Producto (1) → (M) Inventario

RegistroTiempo (M) → (1) Usuario
HorarioTrabajo (M) → (1) Usuario
RegistroHorasExtras (M) → (1) Usuario
```

---

## 📝 PRÓXIMAS FASES

- **FASE 2:** Recursos Humanos (21 modelos)
- **FASE 3:** CRM + Notificaciones (27 modelos)
- **FASE 4:** Reportes avanzados (16 modelos)

---

## 📞 API Endpoints (Ejemplo)

```
POST   /api/v1/auth/login              - Iniciar sesión
POST   /api/v1/auth/registro           - Registrarse
POST   /api/v1/auth/logout             - Cerrar sesión

GET    /api/v1/empresas                - Listar empresas
POST   /api/v1/empresas                - Crear empresa
GET    /api/v1/empresas/{id}           - Ver empresa
PUT    /api/v1/empresas/{id}           - Actualizar empresa
DELETE /api/v1/empresas/{id}           - Eliminar empresa

GET    /api/v1/productos               - Listar productos
POST   /api/v1/productos               - Crear producto
GET    /api/v1/productos/{id}          - Ver producto
PUT    /api/v1/productos/{id}          - Actualizar producto
DELETE /api/v1/productos/{id}          - Eliminar producto

GET    /api/v1/facturas                - Listar facturas
POST   /api/v1/facturas                - Crear factura
GET    /api/v1/facturas/{id}           - Ver factura
PUT    /api/v1/facturas/{id}           - Actualizar factura
DELETE /api/v1/facturas/{id}           - Eliminar factura

... (más endpoints para cada recurso)
```

---

## 🛠️ Tecnología

- **Framework:** Laravel 11
- **PHP:** 8.2+
- **BD:** MySQL / MariaDB
- **Autenticación:** Sanctum
- **Validaciones:** Form Requests
- **Testing:** PHPUnit / Pest

---

**Estado:** ✅ MVP FASE 1 - Estructura completa lista para desarrollo

**Última actualización:** 20 de Enero de 2026
