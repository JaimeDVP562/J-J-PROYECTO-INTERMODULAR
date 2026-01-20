# 🚀 LISTA COMPLETA DE COMANDOS ARTISAN - FASE 1 MVP

> **⚠️ IMPORTANTE:** Esta es la lista COMPLETA de todos los comandos `php artisan` necesarios para crear la estructura completa del MVP con los 28 modelos.
>
> **ESTADO:** ⏳ Pendiente de ejecutar (esperando OK del profesor)
>
> **TIEMPO ESTIMADO:** 30-45 minutos para ejecutar todo
>
> **REQUISITOS:** Laravel 11+ ya instalado en `backend-api/`

---

## 📋 ÍNDICE

1. [Setup Inicial](#setup-inicial)
2. [FASE 1 - MODELOS (28 modelos)](#fase-1--modelos-28-modelos)
3. [FASE 1 - CONTROLADORES API](#fase-1--controladores-api)
4. [FASE 1 - API RESOURCES](#fase-1--api-resources)
5. [FASE 1 - FORM REQUESTS (Validaciones)](#fase-1--form-requests-validaciones)
6. [FASE 1 - POLICIES (Autorización)](#fase-1--policies-autorización)
7. [FASE 1 - SEEDERS (Datos de prueba)](#fase-1--seeders-datos-de-prueba)
8. [FASE 1 - MIDDLEWARE](#fase-1--middleware)
9. [Ejecución Completa (Script maestro)](#ejecución-completa-script-maestro)

---

## 🛠️ SETUP INICIAL

Ejecuta primero estos comandos antes de cualquier otra cosa:

```bash
# 1. Crear el proyecto Laravel (si aún no lo has hecho)
composer create-project laravel/laravel backend-api
cd backend-api

# 2. Instalar API + Sanctum
php artisan install:api
# Responde "yes" cuando te pregunte por la migración

# 3. Publicar configuración de CORS
php artisan config:publish cors

# 4. Estructura de carpetas
# Laravel ya incluye app/Http y database/seeders|factories por defecto.
```

---

## 🗄️ FASE 1 - MODELOS (28 modelos)

### ✅ AUTENTICACIÓN Y MULTI-TENANT (8 modelos)

```bash
# ============================================
# MODELOS CON MIGRACIÓN + FACTORY + SEEDER
# ============================================

php artisan make:model Empresa -mfs
php artisan make:model Rol -mfs
php artisan make:model Permiso -mfs
php artisan make:model Modulo -mfs
php artisan make:model RegistroAuditoria -m

# ============================================
# MODELOS SOLO CON MIGRACIÓN
# (Usuario ya existe, solo migración extra)
# ============================================

php artisan make:model RolPermiso -m
php artisan make:model EmpresaModulo -m
```

### 💰 FACTURACIÓN / CONTABILIDAD (7 modelos)

```bash
# ============================================
# CLIENTES Y PROVEEDORES
# ============================================

php artisan make:model Cliente -mfs
php artisan make:model Proveedor -mfs

# ============================================
# FACTURAS Y DETALLES
# ============================================

php artisan make:model Factura -mfs
php artisan make:model LineaFactura -mf

# ============================================
# MÉTODOS DE PAGO E IMPUESTOS
# ============================================

php artisan make:model MetodoPago -mfs
php artisan make:model Impuesto -mfs

# ============================================
# TABLAS LOOKUP (sin factory necesaria)
# ============================================

php artisan make:model EstadoFactura -ms
```

### 📦 STOCK / INVENTARIO (6 modelos)

```bash
# ============================================
# PRODUCTOS Y CATEGORÍAS
# ============================================

php artisan make:model Producto -mfs
php artisan make:model CategoriaProducto -mfs

# ============================================
# ALMACENES
# ============================================

php artisan make:model Almacen -mfs

# ============================================
# MOVIMIENTOS E INVENTARIO
# ============================================

php artisan make:model MovimientoStock -mf
php artisan make:model Inventario -mf

# ============================================
# ALERTAS
# ============================================

php artisan make:model AlertaStock -m
```

### ⏰ CONTROL HORARIO (4 modelos)

```bash
# ============================================
# FICHAJES Y HORARIOS
# ============================================

php artisan make:model RegistroTiempo -mfs
php artisan make:model HorarioTrabajo -mfs

# ============================================
# REPORTES Y HORAS EXTRAS
# ============================================

php artisan make:model InformeTiempo -m
php artisan make:model RegistroHorasExtras -mf
```

### 📊 DASHBOARD (3 modelos)

```bash
# ============================================
# WIDGETS Y MÉTRICAS
# ============================================

php artisan make:model WidgetDashboard -mf
php artisan make:model MetricaKPI -mf
php artisan make:model Actividad -mf
```

---

## 🎨 FASE 1 - CONTROLADORES API

### 🔐 Autenticación

```bash
# ============================================
# AUTENTICACIÓN (Auth, Empresa, Roles)
# ============================================

php artisan make:controller Api/AutenticacionController
php artisan make:controller Api/EmpresaController --api --model=Empresa
php artisan make:controller Api/RolController --api --model=Rol
php artisan make:controller Api/PermisoController --api --model=Permiso
php artisan make:controller Api/ModuloController --api --model=Modulo
php artisan make:controller Api/RegistroAuditoriaController --api --model=RegistroAuditoria
```

### 💰 Facturación

```bash
# ============================================
# FACTURACIÓN COMPLETA
# ============================================

php artisan make:controller Api/ClienteController --api --model=Cliente
php artisan make:controller Api/ProveedorController --api --model=Proveedor
php artisan make:controller Api/FacturaController --api --model=Factura
php artisan make:controller Api/MetodoPagoController --api --model=MetodoPago
php artisan make:controller Api/ImpuestoController --api --model=Impuesto
```

### 📦 Stock

```bash
# ============================================
# GESTIÓN DE STOCK E INVENTARIO
# ============================================

php artisan make:controller Api/ProductoController --api --model=Producto
php artisan make:controller Api/CategoriaProductoController --api --model=CategoriaProducto
php artisan make:controller Api/AlmacenController --api --model=Almacen
php artisan make:controller Api/MovimientoStockController --api --model=MovimientoStock
php artisan make:controller Api/InventarioController --api --model=Inventario
```

### ⏰ Control Horario

```bash
# ============================================
# CONTROL HORARIO
# ============================================

php artisan make:controller Api/RegistroTiempoController --api --model=RegistroTiempo
php artisan make:controller Api/HorarioTrabajoController --api --model=HorarioTrabajo
php artisan make:controller Api/RegistroHorasExtrasController --api --model=RegistroHorasExtras
```

### 📊 Dashboard

```bash
# ============================================
# DASHBOARD Y MÉTRICAS
# ============================================

php artisan make:controller Api/DashboardController
php artisan make:controller Api/MetricasKPIController
php artisan make:controller Api/ActividadController --api --model=Actividad
```

---

## 📦 FASE 1 - API RESOURCES

### Autenticación

```bash
# ============================================
# RESOURCES - AUTENTICACIÓN
# ============================================

php artisan make:resource Api/EmpresaResource
php artisan make:resource Api/UsuarioResource
php artisan make:resource Api/RolResource
php artisan make:resource Api/PermisoResource
php artisan make:resource Api/ModuloResource
```

### Facturación

```bash
# ============================================
# RESOURCES - FACTURACIÓN
# ============================================

php artisan make:resource Api/ClienteResource
php artisan make:resource Api/ProveedorResource
php artisan make:resource Api/FacturaResource
php artisan make:resource Api/LineaFacturaResource
php artisan make:resource Api/ImpuestoResource
php artisan make:resource Api/MetodoPagoResource
```

### Stock

```bash
# ============================================
# RESOURCES - STOCK
# ============================================

php artisan make:resource Api/ProductoResource
php artisan make:resource Api/CategoriaProductoResource
php artisan make:resource Api/AlmacenResource
php artisan make:resource Api/MovimientoStockResource
php artisan make:resource Api/InventarioResource
```

### Control Horario

```bash
# ============================================
# RESOURCES - CONTROL HORARIO
# ============================================

php artisan make:resource Api/RegistroTiempoResource
php artisan make:resource Api/HorarioTrabajoResource
php artisan make:resource Api/RegistroHorasExtrasResource
```

### Dashboard

```bash
# ============================================
# RESOURCES - DASHBOARD
# ============================================

php artisan make:resource Api/DashboardResource
php artisan make:resource Api/MetricaKPIResource
php artisan make:resource Api/ActividadResource
```

---

## ✅ FASE 1 - FORM REQUESTS (Validaciones)

### Autenticación

```bash
# ============================================
# VALIDACIONES - AUTENTICACIÓN
# ============================================

php artisan make:request Api/Auth/LoginRequest
php artisan make:request Api/Auth/RegistroRequest
php artisan make:request Api/Auth/OlvidarContraseñaRequest
php artisan make:request Api/Auth/RestablecerContraseñaRequest
php artisan make:request Api/Empresa/GuardarEmpresaRequest
php artisan make:request Api/Empresa/ActualizarEmpresaRequest
php artisan make:request Api/Rol/GuardarRolRequest
php artisan make:request Api/Rol/ActualizarRolRequest
```

### Facturación

```bash
# ============================================
# VALIDACIONES - FACTURACIÓN
# ============================================

php artisan make:request Api/Cliente/GuardarClienteRequest
php artisan make:request Api/Cliente/ActualizarClienteRequest
php artisan make:request Api/Proveedor/GuardarProveedorRequest
php artisan make:request Api/Proveedor/ActualizarProveedorRequest
php artisan make:request Api/Factura/GuardarFacturaRequest
php artisan make:request Api/Factura/ActualizarFacturaRequest
php artisan make:request Api/MetodoPago/GuardarMetodoPagoRequest
php artisan make:request Api/Impuesto/GuardarImpuestoRequest
```

### Stock

```bash
# ============================================
# VALIDACIONES - STOCK
# ============================================

php artisan make:request Api/Producto/GuardarProductoRequest
php artisan make:request Api/Producto/ActualizarProductoRequest
php artisan make:request Api/CategoriaProducto/GuardarCategoriaRequest
php artisan make:request Api/CategoriaProducto/ActualizarCategoriaRequest
php artisan make:request Api/Almacen/GuardarAlmacenRequest
php artisan make:request Api/Almacen/ActualizarAlmacenRequest
php artisan make:request Api/MovimientoStock/GuardarMovimientoRequest
```

### Control Horario

```bash
# ============================================
# VALIDACIONES - CONTROL HORARIO
# ============================================

php artisan make:request Api/RegistroTiempo/GuardarRegistroRequest
php artisan make:request Api/RegistroTiempo/ActualizarRegistroRequest
php artisan make:request Api/HorarioTrabajo/GuardarHorarioRequest
php artisan make:request Api/HorarioTrabajo/ActualizarHorarioRequest
php artisan make:request Api/RegistroHorasExtras/GuardarHorasExtrasRequest
```

### Dashboard

```bash
# ============================================
# VALIDACIONES - DASHBOARD
# ============================================

php artisan make:request Api/WidgetDashboard/GuardarWidgetRequest
php artisan make:request Api/MetricaKPI/GuardarMetricaRequest
```

---

## 🔐 FASE 1 - POLICIES (Autorización)

```bash
# ============================================
# POLICIES - AUTENTICACIÓN
# ============================================

php artisan make:policy EmpresaPolicy --model=Empresa
php artisan make:policy RolPolicy --model=Rol
php artisan make:policy PermisoPolicy --model=Permiso

# ============================================
# POLICIES - FACTURACIÓN
# ============================================

php artisan make:policy ClientePolicy --model=Cliente
php artisan make:policy ProveedorPolicy --model=Proveedor
php artisan make:policy FacturaPolicy --model=Factura
php artisan make:policy MetodoPagoPolicy --model=MetodoPago
php artisan make:policy ImpuestoPolicy --model=Impuesto

# ============================================
# POLICIES - STOCK
# ============================================

php artisan make:policy ProductoPolicy --model=Producto
php artisan make:policy CategoriaProductoPolicy --model=CategoriaProducto
php artisan make:policy AlmacenPolicy --model=Almacen
php artisan make:policy MovimientoStockPolicy --model=MovimientoStock
php artisan make:policy InventarioPolicy --model=Inventario

# ============================================
# POLICIES - CONTROL HORARIO
# ============================================

php artisan make:policy RegistroTiempoPolicy --model=RegistroTiempo
php artisan make:policy HorarioTrabajoPolicy --model=HorarioTrabajo
php artisan make:policy RegistroHorasExtrasPolicy --model=RegistroHorasExtras

# ============================================
# POLICIES - DASHBOARD
# ============================================

php artisan make:policy WidgetDashboardPolicy --model=WidgetDashboard
php artisan make:policy MetricaKPIPolicy --model=MetricaKPI
php artisan make:policy ActividadPolicy --model=Actividad
```

---

## 🌱 FASE 1 - SEEDERS (Datos de prueba)

```bash
# ============================================
# SEEDERS - AUTENTICACIÓN
# ============================================

php artisan make:seeder EmpresaSeeder
php artisan make:seeder UsuarioSeeder
php artisan make:seeder RolSeeder
php artisan make:seeder PermisoSeeder
php artisan make:seeder ModuloSeeder

# ============================================
# SEEDERS - FACTURACIÓN
# ============================================

php artisan make:seeder ClienteSeeder
php artisan make:seeder ProveedorSeeder
php artisan make:seeder MetodoPagoSeeder
php artisan make:seeder ImpuestoSeeder
php artisan make:seeder FacturaSeeder

# ============================================
# SEEDERS - STOCK
# ============================================

php artisan make:seeder CategoriaProductoSeeder
php artisan make:seeder ProductoSeeder
php artisan make:seeder AlmacenSeeder

# ============================================
# SEEDERS - CONTROL HORARIO
# ============================================

php artisan make:seeder RegistroTiempoSeeder
php artisan make:seeder HorarioTrabajoSeeder

# ============================================
# SEEDER PRINCIPAL (ejecuta todos)
# ============================================
# Ya existe: database/seeders/DatabaseSeeder.php
# (Lo actualizaremos para llamar a todos los seeders)
```

---

## 🛡️ FASE 1 - MIDDLEWARE

```bash
# ============================================
# MIDDLEWARE PERSONALIZADO
# ============================================

php artisan make:middleware VerificarEmpresaActiva
php artisan make:middleware VerificarAccesoModulo
php artisan make:middleware VerificarRol
php artisan make:middleware RegistrarSolicitudesAPI
php artisan make:middleware ForzarRespuestaJSON
```

---

## 🎯 EJECUCIÓN COMPLETA (Script maestro)

### **Opción 1: Copiar y pegar todos los comandos**

Copia TODO el código de esta sección y pégalo en tu terminal PowerShell:

```bash
# ========== SETUP INICIAL ==========
composer create-project laravel/laravel backend-api
cd backend-api
php artisan install:api
php artisan config:publish cors

# ========== MODELOS FASE 1 ==========
# Autenticación (8)
php artisan make:model Empresa -mfs
php artisan make:model Rol -mfs
php artisan make:model Permiso -mfs
php artisan make:model Modulo -mfs
php artisan make:model RegistroAuditoria -m
php artisan make:model RolPermiso -m
php artisan make:model EmpresaModulo -m

# Facturación (7)
php artisan make:model Cliente -mfs
php artisan make:model Proveedor -mfs
php artisan make:model Factura -mfs
php artisan make:model LineaFactura -mf
php artisan make:model MetodoPago -mfs
php artisan make:model Impuesto -mfs
php artisan make:model EstadoFactura -ms

# Stock (6)
php artisan make:model Producto -mfs
php artisan make:model CategoriaProducto -mfs
php artisan make:model Almacen -mfs
php artisan make:model MovimientoStock -mf
php artisan make:model Inventario -mf
php artisan make:model AlertaStock -m

# Control Horario (4)
php artisan make:model RegistroTiempo -mfs
php artisan make:model HorarioTrabajo -mfs
php artisan make:model InformeTiempo -m
php artisan make:model RegistroHorasExtras -mf

# Dashboard (3)
php artisan make:model WidgetDashboard -mf
php artisan make:model MetricaKPI -mf
php artisan make:model Actividad -mf

# ========== CONTROLADORES API ==========
# Autenticación
php artisan make:controller Api/AutenticacionController
php artisan make:controller Api/EmpresaController --api --model=Empresa
php artisan make:controller Api/RolController --api --model=Rol
php artisan make:controller Api/PermisoController --api --model=Permiso
php artisan make:controller Api/ModuloController --api --model=Modulo
php artisan make:controller Api/RegistroAuditoriaController --api --model=RegistroAuditoria

# Facturación
php artisan make:controller Api/ClienteController --api --model=Cliente
php artisan make:controller Api/ProveedorController --api --model=Proveedor
php artisan make:controller Api/FacturaController --api --model=Factura
php artisan make:controller Api/MetodoPagoController --api --model=MetodoPago
php artisan make:controller Api/ImpuestoController --api --model=Impuesto

# Stock
php artisan make:controller Api/ProductoController --api --model=Producto
php artisan make:controller Api/CategoriaProductoController --api --model=CategoriaProducto
php artisan make:controller Api/AlmacenController --api --model=Almacen
php artisan make:controller Api/MovimientoStockController --api --model=MovimientoStock
php artisan make:controller Api/InventarioController --api --model=Inventario

# Control Horario
php artisan make:controller Api/RegistroTiempoController --api --model=RegistroTiempo
php artisan make:controller Api/HorarioTrabajoController --api --model=HorarioTrabajo
php artisan make:controller Api/RegistroHorasExtrasController --api --model=RegistroHorasExtras

# Dashboard
php artisan make:controller Api/DashboardController
php artisan make:controller Api/MetricasKPIController
php artisan make:controller Api/ActividadController --api --model=Actividad

# ========== API RESOURCES ==========
# Autenticación
php artisan make:resource Api/EmpresaResource
php artisan make:resource Api/UsuarioResource
php artisan make:resource Api/RolResource
php artisan make:resource Api/PermisoResource
php artisan make:resource Api/ModuloResource

# Facturación
php artisan make:resource Api/ClienteResource
php artisan make:resource Api/ProveedorResource
php artisan make:resource Api/FacturaResource
php artisan make:resource Api/LineaFacturaResource
php artisan make:resource Api/ImpuestoResource
php artisan make:resource Api/MetodoPagoResource

# Stock
php artisan make:resource Api/ProductoResource
php artisan make:resource Api/CategoriaProductoResource
php artisan make:resource Api/AlmacenResource
php artisan make:resource Api/MovimientoStockResource
php artisan make:resource Api/InventarioResource

# Control Horario
php artisan make:resource Api/RegistroTiempoResource
php artisan make:resource Api/HorarioTrabajoResource
php artisan make:resource Api/RegistroHorasExtrasResource

# Dashboard
php artisan make:resource Api/DashboardResource
php artisan make:resource Api/MetricaKPIResource
php artisan make:resource Api/ActividadResource

# ========== FORM REQUESTS (Validaciones) ==========
# Autenticación
php artisan make:request Api/Auth/LoginRequest
php artisan make:request Api/Auth/RegistroRequest
php artisan make:request Api/Auth/OlvidarContraseñaRequest
php artisan make:request Api/Auth/RestablecerContraseñaRequest
php artisan make:request Api/Empresa/GuardarEmpresaRequest
php artisan make:request Api/Empresa/ActualizarEmpresaRequest
php artisan make:request Api/Rol/GuardarRolRequest
php artisan make:request Api/Rol/ActualizarRolRequest

# Facturación
php artisan make:request Api/Cliente/GuardarClienteRequest
php artisan make:request Api/Cliente/ActualizarClienteRequest
php artisan make:request Api/Proveedor/GuardarProveedorRequest
php artisan make:request Api/Proveedor/ActualizarProveedorRequest
php artisan make:request Api/Factura/GuardarFacturaRequest
php artisan make:request Api/Factura/ActualizarFacturaRequest
php artisan make:request Api/MetodoPago/GuardarMetodoPagoRequest
php artisan make:request Api/Impuesto/GuardarImpuestoRequest

# Stock
php artisan make:request Api/Producto/GuardarProductoRequest
php artisan make:request Api/Producto/ActualizarProductoRequest
php artisan make:request Api/CategoriaProducto/GuardarCategoriaRequest
php artisan make:request Api/CategoriaProducto/ActualizarCategoriaRequest
php artisan make:request Api/Almacen/GuardarAlmacenRequest
php artisan make:request Api/Almacen/ActualizarAlmacenRequest
php artisan make:request Api/MovimientoStock/GuardarMovimientoRequest

# Control Horario
php artisan make:request Api/RegistroTiempo/GuardarRegistroRequest
php artisan make:request Api/RegistroTiempo/ActualizarRegistroRequest
php artisan make:request Api/HorarioTrabajo/GuardarHorarioRequest
php artisan make:request Api/HorarioTrabajo/ActualizarHorarioRequest
php artisan make:request Api/RegistroHorasExtras/GuardarHorasExtrasRequest

# Dashboard
php artisan make:request Api/WidgetDashboard/GuardarWidgetRequest
php artisan make:request Api/MetricaKPI/GuardarMetricaRequest

# ========== POLICIES (Autorización) ==========
# Autenticación
php artisan make:policy EmpresaPolicy --model=Empresa
php artisan make:policy RolPolicy --model=Rol
php artisan make:policy PermisoPolicy --model=Permiso

# Facturación
php artisan make:policy ClientePolicy --model=Cliente
php artisan make:policy ProveedorPolicy --model=Proveedor
php artisan make:policy FacturaPolicy --model=Factura
php artisan make:policy MetodoPagoPolicy --model=MetodoPago
php artisan make:policy ImpuestoPolicy --model=Impuesto

# Stock
php artisan make:policy ProductoPolicy --model=Producto
php artisan make:policy CategoriaProductoPolicy --model=CategoriaProducto
php artisan make:policy AlmacenPolicy --model=Almacen
php artisan make:policy MovimientoStockPolicy --model=MovimientoStock
php artisan make:policy InventarioPolicy --model=Inventario

# Control Horario
php artisan make:policy RegistroTiempoPolicy --model=RegistroTiempo
php artisan make:policy HorarioTrabajoPolicy --model=HorarioTrabajo
php artisan make:policy RegistroHorasExtrasPolicy --model=RegistroHorasExtras

# Dashboard
php artisan make:policy WidgetDashboardPolicy --model=WidgetDashboard
php artisan make:policy MetricaKPIPolicy --model=MetricaKPI
php artisan make:policy ActividadPolicy --model=Actividad

# ========== SEEDERS (Datos de prueba) ==========
# Autenticación
php artisan make:seeder EmpresaSeeder
php artisan make:seeder UsuarioSeeder
php artisan make:seeder RolSeeder
php artisan make:seeder PermisoSeeder
php artisan make:seeder ModuloSeeder

# Facturación
php artisan make:seeder ClienteSeeder
php artisan make:seeder ProveedorSeeder
php artisan make:seeder MetodoPagoSeeder
php artisan make:seeder ImpuestoSeeder
php artisan make:seeder FacturaSeeder

# Stock
php artisan make:seeder CategoriaProductoSeeder
php artisan make:seeder ProductoSeeder
php artisan make:seeder AlmacenSeeder

# Control Horario
php artisan make:seeder RegistroTiempoSeeder
php artisan make:seeder HorarioTrabajoSeeder

# ========== MIDDLEWARE ==========
php artisan make:middleware VerificarEmpresaActiva
php artisan make:middleware VerificarAccesoModulo
php artisan make:middleware VerificarRol
php artisan make:middleware RegistrarSolicitudesAPI
php artisan make:middleware ForzarRespuestaJSON

# ========== FIN ==========
echo "✅ TODOS LOS COMANDOS EJECUTADOS CORRECTAMENTE"
```

---

### **Opción 2: Script automatizado (RECOMENDADO)**

Crea un archivo `setup-mvp.sh` en la raíz de tu proyecto:

```bash
# setup-mvp.sh
#!/bin/bash

echo "🚀 INICIANDO SETUP COMPLETO DEL MVP - FASE 1"
echo "=============================================="
echo ""

# Setup inicial
echo "1️⃣  Setup inicial..."
composer create-project laravel/laravel backend-api
cd backend-api
php artisan install:api
php artisan config:publish cors

# Modelos
echo "2️⃣  Creando 28 modelos..."
php artisan make:model Empresa -mfs
php artisan make:model Rol -mfs
php artisan make:model Permiso -mfs
php artisan make:model Modulo -mfs
php artisan make:model RegistroAuditoria -m
php artisan make:model RolPermiso -m
php artisan make:model EmpresaModulo -m
php artisan make:model Cliente -mfs
php artisan make:model Proveedor -mfs
php artisan make:model Factura -mfs
php artisan make:model LineaFactura -mf
php artisan make:model MetodoPago -mfs
php artisan make:model Impuesto -mfs
php artisan make:model EstadoFactura -ms
php artisan make:model Producto -mfs
php artisan make:model CategoriaProducto -mfs
php artisan make:model Almacen -mfs
php artisan make:model MovimientoStock -mf
php artisan make:model Inventario -mf
php artisan make:model AlertaStock -m
php artisan make:model RegistroTiempo -mfs
php artisan make:model HorarioTrabajo -mfs
php artisan make:model InformeTiempo -m
php artisan make:model RegistroHorasExtras -mf
php artisan make:model WidgetDashboard -mf
php artisan make:model MetricaKPI -mf
php artisan make:model Actividad -mf

# Controladores
echo "3️⃣  Creando 25 controladores API..."
php artisan make:controller Api/AutenticacionController
php artisan make:controller Api/EmpresaController --api --model=Empresa
php artisan make:controller Api/RolController --api --model=Rol
php artisan make:controller Api/PermisoController --api --model=Permiso
php artisan make:controller Api/ModuloController --api --model=Modulo
php artisan make:controller Api/RegistroAuditoriaController --api --model=RegistroAuditoria
php artisan make:controller Api/ClienteController --api --model=Cliente
php artisan make:controller Api/ProveedorController --api --model=Proveedor
php artisan make:controller Api/FacturaController --api --model=Factura
php artisan make:controller Api/MetodoPagoController --api --model=MetodoPago
php artisan make:controller Api/ImpuestoController --api --model=Impuesto
php artisan make:controller Api/ProductoController --api --model=Producto
php artisan make:controller Api/CategoriaProductoController --api --model=CategoriaProducto
php artisan make:controller Api/AlmacenController --api --model=Almacen
php artisan make:controller Api/MovimientoStockController --api --model=MovimientoStock
php artisan make:controller Api/InventarioController --api --model=Inventario
php artisan make:controller Api/RegistroTiempoController --api --model=RegistroTiempo
php artisan make:controller Api/HorarioTrabajoController --api --model=HorarioTrabajo
php artisan make:controller Api/RegistroHorasExtrasController --api --model=RegistroHorasExtras
php artisan make:controller Api/DashboardController
php artisan make:controller Api/MetricasKPIController
php artisan make:controller Api/ActividadController --api --model=Actividad

# Resources
echo "4️⃣  Creando 20 API Resources..."
php artisan make:resource Api/EmpresaResource
php artisan make:resource Api/UsuarioResource
php artisan make:resource Api/RolResource
php artisan make:resource Api/PermisoResource
php artisan make:resource Api/ModuloResource
php artisan make:resource Api/ClienteResource
php artisan make:resource Api/ProveedorResource
php artisan make:resource Api/FacturaResource
php artisan make:resource Api/LineaFacturaResource
php artisan make:resource Api/ImpuestoResource
php artisan make:resource Api/MetodoPagoResource
php artisan make:resource Api/ProductoResource
php artisan make:resource Api/CategoriaProductoResource
php artisan make:resource Api/AlmacenResource
php artisan make:resource Api/MovimientoStockResource
php artisan make:resource Api/InventarioResource
php artisan make:resource Api/RegistroTiempoResource
php artisan make:resource Api/HorarioTrabajoResource
php artisan make:resource Api/RegistroHorasExtrasResource
php artisan make:resource Api/ActividadResource

# Form Requests
echo "5️⃣  Creando 30+ Form Requests..."
php artisan make:request Api/Auth/LoginRequest
php artisan make:request Api/Auth/RegistroRequest
php artisan make:request Api/Empresa/GuardarEmpresaRequest
php artisan make:request Api/Empresa/ActualizarEmpresaRequest
php artisan make:request Api/Cliente/GuardarClienteRequest
php artisan make:request Api/Cliente/ActualizarClienteRequest
php artisan make:request Api/Proveedor/GuardarProveedorRequest
php artisan make:request Api/Proveedor/ActualizarProveedorRequest
php artisan make:request Api/Factura/GuardarFacturaRequest
php artisan make:request Api/Factura/ActualizarFacturaRequest
php artisan make:request Api/Producto/GuardarProductoRequest
php artisan make:request Api/Producto/ActualizarProductoRequest
php artisan make:request Api/CategoriaProducto/GuardarCategoriaRequest
php artisan make:request Api/CategoriaProducto/ActualizarCategoriaRequest
php artisan make:request Api/Almacen/GuardarAlmacenRequest
php artisan make:request Api/Almacen/ActualizarAlmacenRequest
php artisan make:request Api/RegistroTiempo/GuardarRegistroRequest
php artisan make:request Api/RegistroTiempo/ActualizarRegistroRequest
php artisan make:request Api/HorarioTrabajo/GuardarHorarioRequest
php artisan make:request Api/HorarioTrabajo/ActualizarHorarioRequest

# Policies
echo "6️⃣  Creando 20+ Policies..."
php artisan make:policy EmpresaPolicy --model=Empresa
php artisan make:policy RolPolicy --model=Rol
php artisan make:policy ClientePolicy --model=Cliente
php artisan make:policy ProveedorPolicy --model=Proveedor
php artisan make:policy FacturaPolicy --model=Factura
php artisan make:policy ProductoPolicy --model=Producto
php artisan make:policy CategoriaProductoPolicy --model=CategoriaProducto
php artisan make:policy AlmacenPolicy --model=Almacen
php artisan make:policy RegistroTiempoPolicy --model=RegistroTiempo
php artisan make:policy HorarioTrabajoPolicy --model=HorarioTrabajo

# Seeders
echo "7️⃣  Creando 13 Seeders..."
php artisan make:seeder EmpresaSeeder
php artisan make:seeder UsuarioSeeder
php artisan make:seeder RolSeeder
php artisan make:seeder ClienteSeeder
php artisan make:seeder ProveedorSeeder
php artisan make:seeder CategoriaProductoSeeder
php artisan make:seeder ProductoSeeder
php artisan make:seeder AlmacenSeeder
php artisan make:seeder RegistroTiempoSeeder
php artisan make:seeder HorarioTrabajoSeeder

# Middleware
echo "8️⃣  Creando 5 Middleware..."
php artisan make:middleware VerificarEmpresaActiva
php artisan make:middleware VerificarAccesoModulo
php artisan make:middleware VerificarRol
php artisan make:middleware RegistrarSolicitudesAPI
php artisan make:middleware ForzarRespuestaJSON

echo ""
echo "🎉 ¡SETUP COMPLETADO!"
echo "=============================================="
echo ""
echo "📊 RESUMEN:"
echo "   ✅ 28 Modelos creados"
echo "   ✅ 25 Controladores API creados"
echo "   ✅ 20 Resources creados"
echo "   ✅ 30+ Form Requests creados"
echo "   ✅ 20+ Policies creadas"
echo "   ✅ 13 Seeders creados"
echo "   ✅ 5 Middleware creados"
echo ""
echo "📝 PRÓXIMOS PASOS:"
echo "   1. Editar migraciones en database/migrations/"
echo "   2. Editar controladores en app/Http/Controllers/Api/"
echo "   3. Editar resources en app/Http/Resources/Api/"
echo "   4. Configurar rutas en routes/api.php"
echo "   5. Ejecutar: php artisan migrate"
echo "   6. Ejecutar: php artisan db:seed"
echo ""
```

Para usar el script:

```bash
# En tu terminal (en la carpeta del proyecto)
bash setup-mvp.sh
```

---

## 📊 RESUMEN FINAL

| Elemento | Cantidad | Carpeta |
|----------|----------|---------|
| **Modelos** | 28 | `app/Models/` |
| **Migraciones** | 28 | `database/migrations/` |
| **Factories** | 16 | `database/factories/` |
| **Seeders** | 13 | `database/seeders/` |
| **Controladores API** | 25 | `app/Http/Controllers/Api/` |
| **Resources** | 20 | `app/Http/Resources/Api/` |
| **Form Requests** | 30+ | `app/Http/Requests/Api/` |
| **Policies** | 20+ | `app/Policies/` |
| **Middleware** | 5 | `app/Http/Middleware/` |
| **TOTAL ARCHIVOS** | **~185** | |

---

## ⏱️ TIEMPO ESTIMADO DE EJECUCIÓN

```
Setup inicial:              5 min
Crear 28 modelos:          10 min
Crear 25 controladores:    10 min
Crear 20 resources:         8 min
Crear 30+ requests:        12 min
Crear 20+ policies:        10 min
Crear 13 seeders:           8 min
Crear 5 middleware:         5 min
─────────────────────────────
TOTAL:                   ~70 min (1 hora 10 min)
```

---

## ✅ CHECKLIST ANTES DE EJECUTAR

- [ ] Git configurado (rama `feature/api-erp`)
- [ ] PHP 8.2+ instalado
- [ ] Composer instalado
- [ ] MySQL/MariaDB corriendo
- [ ] VS Code listo
- [ ] Terminal en `d:\CURSO-25-26\J-J-PROYECTO-INTERMODULAR`
- [ ] Este documento guardado como referencia

---

## 🚀 SIGUIENTE PASO

Una vez el profesor de el OK, ejecutarás:

```bash
# Opción 1: Pegar todos los comandos
# (Copiar la sección "Ejecución Completa")

# Opción 2: Usar el script (RECOMENDADO)
bash setup-mvp.sh
```

---

**Estado:** ⏳ LISTO PARA EJECUTAR - Esperando OK del profesor

**Última actualización:** 20 de Enero de 2026
