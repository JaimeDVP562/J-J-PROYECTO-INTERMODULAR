# 📚 Documentación de API - Mini ERP Modular SaaS

**Proyecto:** Mini ERP Modular  
**Autores:** Jesús Ríos López, Jaime Gavilán Torrero  
**Fecha:** Sprint 2 - Diciembre 2025  
**Base URL:** `http://localhost:8000/api`

---

## 📖 Índice

1. [Autenticación](#autenticación)
2. [Productos](#productos)
3. [Proveedores](#proveedores)
4. [Categorías](#categorías)
5. [Health Check](#health-check)
6. [Códigos de Respuesta HTTP](#códigos-de-respuesta-http)
7. [Verificación de Requisitos con Postman](#verificación-de-requisitos-con-postman)

---

## 🔐 Autenticación

La API utiliza **JWT (JSON Web Tokens)** para autenticación. Todos los endpoints de escritura (POST, PUT, DELETE) requieren autenticación.

### Login

**Endpoint:** `POST /api/login`

**Descripción:** Obtiene un token JWT para acceder a endpoints protegidos.

**Body:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

**Respuesta Exitosa (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Respuesta Error (401):**
```json
{
  "error": "Credenciales inválidas"
}
```

**Headers Requeridos:**
- `Content-Type: application/json`

---

## 📦 Productos

### Listar Productos

**Endpoint:** `GET /api/productos`

**Descripción:** Obtiene lista de productos con paginación, búsqueda y ordenación.

**Parámetros Query:**
- `page` (int, opcional): Número de página (default: 1)
- `limit` (int, opcional): Registros por página (default: 10, máx: 100)
- `q` (string, opcional): Búsqueda por nombre
- `sort` (string, opcional): Campo para ordenar (nombre, stock, precio)
- `order` (string, opcional): Orden ASC o DESC
- `proveedor` (int, opcional): Filtrar por ID de proveedor
- `export` (string, opcional): Exportar como 'csv' o 'json'

**Ejemplo:**
```
GET /api/productos?page=1&limit=10&q=laptop&sort=stock&order=desc
```

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Laptop Dell",
      "stock": 15,
      "precio": 899.99,
      "proveedor": 2,
      "ubicacionAlmacen": "A1"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0,
    "page": 1,
    "totalPages": 5
  }
}
```

---

### Obtener Producto por ID

**Endpoint:** `GET /api/productos?id={id}`

**Descripción:** Obtiene los detalles de un producto específico.

**Ejemplo:**
```
GET /api/productos?id=1
```

**Respuesta (200):**
```json
{
  "id": 1,
  "nombre": "Laptop Dell",
  "stock": 15,
  "precio": 899.99,
  "proveedor": 2,
  "ubicacionAlmacen": "A1"
}
```

**Respuesta Error (404):**
```json
{
  "error": "Producto no encontrado"
}
```

---

### Obtener Proveedor de Producto

**Endpoint:** `GET /api/productos?id={id}&include=proveedor`

**Descripción:** Obtiene el nombre del proveedor del producto.

**Ejemplo:**
```
GET /api/productos?id=1&include=proveedor
```

**Respuesta (200):**
```json
{
  "proveedor": "Proveedor XYZ"
}
```

---

### Crear Producto

**Endpoint:** `POST /api/productos`

**Descripción:** Crea un nuevo producto. **Requiere rol admin**.

**Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Laptop HP",
  "stock": 20,
  "precio": 799.99,
  "proveedor": 1,
  "ubicacionAlmacen": "B2"
}
```

**Respuesta (201):**
```json
{
  "id": 45,
  "nombre": "Laptop HP",
  "stock": 20,
  "precio": 799.99,
  "proveedor": 1,
  "ubicacionAlmacen": "B2"
}
```

**Errores:**
- 400: Validación fallida (stock negativo, precio inválido, nombre vacío)
- 401: Token no válido o ausente
- 403: Usuario no tiene permiso (no es admin)

---

### Actualizar Producto

**Endpoint:** `PUT /api/productos?id={id}`

**Descripción:** Actualiza un producto existente. **Requiere rol admin**.

**Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "stock": 25,
  "precio": 749.99
}
```

**Respuesta (200):**
```json
{
  "id": 1,
  "nombre": "Laptop Dell",
  "stock": 25,
  "precio": 749.99,
  "proveedor": 2,
  "ubicacionAlmacen": "A1"
}
```

**Errores:**
- 304: Sin cambios realizados
- 400: Falta ID o JSON inválido
- 404: Producto no encontrado

---

### Eliminar Producto

**Endpoint:** `DELETE /api/productos?id={id}`

**Descripción:** Elimina un producto. **Requiere rol admin**.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Respuesta (204):** Sin contenido

**Errores:**
- 404: Producto no encontrado
- 401/403: Autenticación/Autorización fallida

---

## 🏢 Proveedores

### Listar Proveedores

**Endpoint:** `GET /api/proveedores`

**Descripción:** Obtiene lista de proveedores con paginación.

**Parámetros Query:**
- `page` (int, opcional): Número de página (default: 1)
- `limit` (int, opcional): Registros por página (default: 10)

**Ejemplo:**
```
GET /api/proveedores?page=1&limit=10
```

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "TechSupply Inc",
      "telefono": "555-1234",
      "email": "info@techsupply.com",
      "direccion": "123 Tech St, Silicon Valley"
    }
  ],
  "pagination": {
    "total": 12,
    "limit": 10,
    "offset": 0,
    "page": 1,
    "totalPages": 2
  }
}
```

---

### Obtener Proveedor por ID

**Endpoint:** `GET /api/proveedores?id={id}`

**Descripción:** Obtiene los detalles de un proveedor específico.

**Ejemplo:**
```
GET /api/proveedores?id=1
```

**Respuesta (200):**
```json
{
  "id": 1,
  "nombre": "TechSupply Inc",
  "telefono": "555-1234",
  "email": "info@techsupply.com",
  "direccion": "123 Tech St, Silicon Valley"
}
```

---

### Obtener Productos de Proveedor (Endpoint Anidado)

**Endpoint:** `GET /api/proveedores/{id}/productos`

**Descripción:** Obtiene todos los productos que pertenecen a un proveedor específico.

**Parámetros Query:**
- `page` (int, opcional): Número de página (default: 1)
- `limit` (int, opcional): Registros por página (default: 10)

**Ejemplo:**
```
GET /api/proveedores/1/productos?page=1&limit=5
```

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 5,
      "nombre": "Mouse Logitech",
      "stock": 50,
      "precio": 29.99,
      "proveedor": 1,
      "ubicacionAlmacen": "C3"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 5,
    "offset": 0,
    "page": 1,
    "totalPages": 2
  },
  "proveedor": {
    "id": 1,
    "nombre": "TechSupply Inc",
    "telefono": "555-1234",
    "email": "info@techsupply.com",
    "direccion": "123 Tech St, Silicon Valley"
  }
}
```

**Errores:**
- 404: Proveedor no encontrado

---

### Crear Proveedor

**Endpoint:** `POST /api/proveedores`

**Descripción:** Crea un nuevo proveedor. **Requiere rol admin**.

**Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "NewTech Solutions",
  "telefono": "555-9999",
  "email": "contact@newtech.com",
  "direccion": "456 Innovation Ave"
}
```

**Respuesta (201):**
```json
{
  "id": 15,
  "nombre": "NewTech Solutions",
  "telefono": "555-9999",
  "email": "contact@newtech.com",
  "direccion": "456 Innovation Ave"
}
```

---

### Actualizar Proveedor

**Endpoint:** `PUT /api/proveedores?id={id}`

**Descripción:** Actualiza un proveedor existente. **Requiere rol admin**.

**Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "telefono": "555-8888",
  "email": "newemail@newtech.com"
}
```

**Respuesta (200):** Proveedor actualizado

---

### Eliminar Proveedor

**Endpoint:** `DELETE /api/proveedores?id={id}`

**Descripción:** Elimina un proveedor. **Requiere rol admin**.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Respuesta (204):** Sin contenido

---

## 🏷️ Categorías

### Listar Categorías

**Endpoint:** `GET /api/categorias`

**Descripción:** Obtiene lista de categorías con paginación.

**Parámetros Query:**
- `page` (int, opcional): Número de página (default: 1)
- `limit` (int, opcional): Registros por página (default: 10)

**Ejemplo:**
```
GET /api/categorias?page=1&limit=10
```

**Respuesta (200):**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Electrónica"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 10,
    "offset": 0
  }
}
```

---

### Obtener Categoría por ID

**Endpoint:** `GET /api/categorias?id={id}`

**Descripción:** Obtiene los detalles de una categoría específica.

**Ejemplo:**
```
GET /api/categorias?id=1
```

**Respuesta (200):**
```json
{
  "id": 1,
  "nombre": "Electrónica"
}
```

---

### Crear Categoría

**Endpoint:** `POST /api/categorias`

**Descripción:** Crea una nueva categoría. **Requiere rol admin**.

**Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Periféricos"
}
```

**Respuesta (201):**
```json
{
  "id": 10,
  "nombre": "Periféricos"
}
```

---

### Actualizar Categoría

**Endpoint:** `PUT /api/categorias?id={id}`

**Descripción:** Actualiza una categoría existente. **Requiere rol admin**.

**Headers Requeridos:**
```
Content-Type: application/json
Authorization: Bearer {token}
```

**Body:**
```json
{
  "nombre": "Electrónica y Computadoras"
}
```

**Respuesta (200):** Categoría actualizada

---

### Eliminar Categoría

**Endpoint:** `DELETE /api/categorias?id={id}`

**Descripción:** Elimina una categoría. **Requiere rol admin**.

**Headers Requeridos:**
```
Authorization: Bearer {token}
```

**Respuesta (204):** Sin contenido

---

## 🏥 Health Check

### Verificar Estado del Sistema

**Endpoint:** `GET /api/health`

**Descripción:** Verifica el estado del servidor y la conexión con la base de datos.

**Ejemplo:**
```
GET /api/health
```

**Respuesta Exitosa (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-04T10:30:45+00:00",
  "database": "connected",
  "api_version": "1.0",
  "environment": "production"
}
```

**Respuesta Error (503):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-12-04T10:30:45+00:00",
  "database": "disconnected",
  "error": "Database connection failed"
}
```

---

## 📊 Códigos de Respuesta HTTP

| Código | Significado | Descripción |
|--------|------------|-------------|
| 200 | OK | Solicitud exitosa, datos devueltos |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Solicitud exitosa sin contenido (DELETE) |
| 304 | Not Modified | Sin cambios realizados |
| 400 | Bad Request | Datos inválidos o incompletos |
| 401 | Unauthorized | Token no válido o ausente |
| 403 | Forbidden | Usuario no tiene permisos (no es admin) |
| 404 | Not Found | Recurso no encontrado |
| 405 | Method Not Allowed | Método HTTP no permitido en endpoint |
| 500 | Internal Server Error | Error en el servidor |
| 503 | Service Unavailable | Servicio no disponible (BD desconectada) |

---

## ✅ Verificación de Requisitos con Postman

### Requisito 1: CRUD Completo para Productos

**1.1 - Crear Producto**

```
POST http://localhost:8000/api/productos
Content-Type: application/json
Authorization: Bearer {token}

{
  "nombre": "Monitor Samsung 27\"",
  "stock": 30,
  "precio": 299.99,
  "proveedor": 1,
  "ubicacionAlmacen": "D1"
}
```

**Verificación:** HTTP 201, respuesta contiene ID del nuevo producto.

---

**1.2 - Leer Productos**

```
GET http://localhost:8000/api/productos
```

**Verificación:** HTTP 200, respuesta es array de productos con pagination.

---

**1.3 - Actualizar Producto**

```
PUT http://localhost:8000/api/productos?id=1
Content-Type: application/json
Authorization: Bearer {token}

{
  "stock": 35,
  "precio": 279.99
}
```

**Verificación:** HTTP 200, producto actualizado reflejado en respuesta.

---

**1.4 - Eliminar Producto**

```
DELETE http://localhost:8000/api/productos?id=1
Authorization: Bearer {token}
```

**Verificación:** HTTP 204 (sin contenido). Siguiente GET a ese ID retorna 404.

---

### Requisito 2: Paginación

**Test Paginación**

```
GET http://localhost:8000/api/productos?page=2&limit=5
```

**Verificación:** HTTP 200, respuesta incluye:
- `data`: array de máximo 5 registros
- `pagination.page`: 2
- `pagination.limit`: 5
- `pagination.total`: total de registros
- `pagination.totalPages`: calculado correctamente

---

### Requisito 3: JWT y Autenticación

**3.1 - Login Exitoso**

```
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Verificación:** HTTP 200, respuesta contiene `token` (string JWT).

---

**3.2 - Login Fallido**

```
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "incorrecta"
}
```

**Verificación:** HTTP 401, respuesta: `{"error": "Credenciales inválidas"}`

---

**3.3 - Operación sin Token**

```
POST http://localhost:8000/api/productos
Content-Type: application/json

{
  "nombre": "Test",
  "stock": 1,
  "precio": 10
}
```

**Verificación:** HTTP 401, error de autenticación.

---

**3.4 - Token Inválido**

```
POST http://localhost:8000/api/productos
Content-Type: application/json
Authorization: Bearer invalidtoken123

{
  "nombre": "Test",
  "stock": 1,
  "precio": 10
}
```

**Verificación:** HTTP 401, token rechazado.

---

### Requisito 4: Roles y Control de Acceso

**4.1 - Admin Puede Crear**

```
POST http://localhost:8000/api/productos
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "nombre": "Producto Admin",
  "stock": 10,
  "precio": 50.00
}
```

**Verificación:** HTTP 201, producto creado.

---

**4.2 - User No Puede Crear (Simular Rol User)**

*Nota: Actualmente, usar token de user si está disponible en BD.*

```
POST http://localhost:8000/api/productos
Content-Type: application/json
Authorization: Bearer {user_token}

{
  "nombre": "Producto User",
  "stock": 10,
  "precio": 50.00
}
```

**Verificación:** HTTP 403, respuesta: `{"error": "Acceso denegado"}`

---

### Requisito 5: Búsqueda

**Test Búsqueda por Nombre**

```
GET http://localhost:8000/api/productos?q=laptop
```

**Verificación:** HTTP 200, respuesta contiene solo productos cuyo nombre incluya "laptop" (case-insensitive).

---

### Requisito 6: Ordenación

**Test Ordenación por Stock (Ascendente)**

```
GET http://localhost:8000/api/productos?sort=stock&order=asc
```

**Verificación:** HTTP 200, productos ordenados por stock de menor a mayor.

---

**Test Ordenación por Precio (Descendente)**

```
GET http://localhost:8000/api/productos?sort=precio&order=desc
```

**Verificación:** HTTP 200, productos ordenados por precio de mayor a menor.

---

### Requisito 7: Exportación de Datos

**7.1 - Exportar como CSV**

```
GET http://localhost:8000/api/productos?export=csv
```

**Verificación:** HTTP 200, respuesta es archivo CSV descargable con productos.

---

**7.2 - Exportar como JSON**

```
GET http://localhost:8000/api/productos?export=json
```

**Verificación:** HTTP 200, respuesta es JSON array de productos.

---

### Requisito 8: Endpoint Anidado (Productos por Proveedor)

**Test Obtener Productos de Proveedor 1**

```
GET http://localhost:8000/api/proveedores/1/productos?page=1&limit=5
```

**Verificación:** HTTP 200, respuesta incluye:
- `data`: array de productos del proveedor 1
- `proveedor`: objeto con detalles del proveedor
- `pagination`: info de paginación

---

**Test Proveedor No Existe**

```
GET http://localhost:8000/api/proveedores/9999/productos
```

**Verificación:** HTTP 404, error "Proveedor no encontrado".

---

### Requisito 9: Health Check y Monitoreo

**Test Health Check**

```
GET http://localhost:8000/api/health
```

**Verificación:** HTTP 200, respuesta JSON con status "healthy" y DB conectada.

---

**Test Health Check - Método No Permitido**

```
POST http://localhost:8000/api/health
```

**Verificación:** HTTP 405, "Método no permitido".

---

### Requisito 10: Logging de Operaciones

**Verificación Manual:**

1. Realizar una operación (ej: POST /api/productos)
2. Verificar que existe archivo `backend/logs/api.log`
3. El log debe contener:
   - Timestamp
   - Nivel (INFO, SUCCESS, WARNING, ERROR)
   - Método HTTP (POST, GET, etc.)
   - Endpoint (/productos)
   - IP del cliente
   - Mensaje descriptivo

**Ejemplo de log esperado:**
```
[2025-12-04 10:35:22] [SUCCESS] [POST /api/productos] [127.0.0.1] POST /productos - Producto creado con ID 45
```

---

### Requisito 11: Validación de Datos

**11.1 - Stock Negativo**

```
POST http://localhost:8000/api/productos
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "nombre": "Test",
  "stock": -5,
  "precio": 10.00
}
```

**Verificación:** HTTP 400, error en validación.

---

**11.2 - Precio Inválido**

```
POST http://localhost:8000/api/productos
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "nombre": "Test",
  "stock": 10,
  "precio": "invalido"
}
```

**Verificación:** HTTP 400, error en validación.

---

**11.3 - Campo Obligatorio Faltante**

```
POST http://localhost:8000/api/productos
Content-Type: application/json
Authorization: Bearer {admin_token}

{
  "stock": 10,
  "precio": 50.00
}
```

**Verificación:** HTTP 400, error: "nombre es requerido".

---

### Requisito 12: Códigos de Estado HTTP Correctos

| Operación | Código Esperado | Comando Postman |
|-----------|---|---|
| GET exitoso | 200 | `GET /api/productos` |
| POST exitoso | 201 | `POST /api/productos` + admin token |
| DELETE exitoso | 204 | `DELETE /api/productos?id=1` + admin token |
| No encontrado | 404 | `GET /api/productos?id=9999` |
| No autorizado | 401 | Cualquier operación sin token |
| Prohibido | 403 | POST como user (no admin) |
| Bad Request | 400 | JSON inválido o datos incompletos |
| Método no permitido | 405 | `PATCH /api/productos` |

---

## 🔍 Ejemplo Flujo Completo en Postman

### 1. Login
```
POST http://localhost:8000/api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```
**Guardar token en variable: `{{token}}`**

### 2. Crear Producto
```
POST http://localhost:8000/api/productos
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Laptop Test",
  "stock": 5,
  "precio": 999.99,
  "proveedor": 1,
  "ubicacionAlmacen": "A1"
}
```

### 3. Listar Productos
```
GET http://localhost:8000/api/productos?page=1&limit=10
```

### 4. Buscar por Nombre
```
GET http://localhost:8000/api/productos?q=Laptop
```

### 5. Obtener Productos del Proveedor 1
```
GET http://localhost:8000/api/proveedores/1/productos
```

### 6. Exportar como CSV
```
GET http://localhost:8000/api/productos?export=csv
```

### 7. Verificar Health Check
```
GET http://localhost:8000/api/health
```

---

*Documentación generada en Sprint 2 - Diciembre 2025*
