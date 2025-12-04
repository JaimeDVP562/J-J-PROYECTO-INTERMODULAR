# 🧪 Casos de Prueba (Test Cases)

**Proyecto:** Mini ERP Modular SaaS  
**Autores:** Jesús Ríos López, Jaime Gavilán Torrero  
**Fecha:** Sprint 2 - Diciembre 2025

---

## Operaciones de Productos

| ID | Endpoint | Método | Entrada | Caso de Prueba | Expected | HTTP Code |
|----|----------|--------|---------|---|---|---|
| TC001 | `/api/productos` | GET | Sin parámetros | Listar todos los productos | Array con pagination | 200 |
| TC002 | `/api/productos?page=2&limit=5` | GET | Paginación | Obtener página 2 con límite 5 | Array paginado | 200 |
| TC003 | `/api/productos?q=laptop` | GET | Búsqueda | Buscar productos por nombre | Productos coincidentes | 200 |
| TC004 | `/api/productos?sort=stock&order=asc` | GET | Ordenación | Ordenar por stock ascendente | Productos ordenados | 200 |
| TC005 | `/api/productos?export=csv` | GET | Exportación CSV | Descargar productos como CSV | CSV file | 200 |
| TC006 | `/api/productos?export=json` | GET | Exportación JSON | Descargar productos como JSON | JSON array | 200 |
| TC007 | `/api/productos?id=1` | GET | ID válido | Obtener producto por ID | Producto completo | 200 |
| TC008 | `/api/productos?id=9999` | GET | ID inválido | Obtener producto inexistente | Error 404 | 404 |
| TC009 | `/api/productos?id=1&include=proveedor` | GET | Include proveedor | Obtener nombre del proveedor del producto | Objeto proveedor | 200 |
| TC010 | `/api/productos` | POST | JSON válido | Crear nuevo producto como admin | Producto creado | 201 |
| TC011 | `/api/productos` | POST | JSON sin nombre | Crear sin campo nombre | Error validación | 400 |
| TC012 | `/api/productos` | POST | User no admin | Crear como usuario regular | Error 403 | 403 |
| TC013 | `/api/productos?id=1` | PUT | JSON válido | Actualizar producto existente | Producto actualizado | 200 |
| TC014 | `/api/productos?id=1` | PUT | Sin parámetro ID | Actualizar sin ID | Error 400 | 400 |
| TC015 | `/api/productos?id=9999` | PUT | ID inexistente | Actualizar producto no existente | Error 404 | 404 |
| TC016 | `/api/productos?id=1` | DELETE | ID válido | Eliminar producto existente | Sin contenido | 204 |
| TC017 | `/api/productos?id=9999` | DELETE | ID inexistente | Eliminar producto no existente | Error 404 | 404 |
| TC018 | `/api/productos` | PATCH | Sin GET/POST/PUT/DELETE | Método no permitido | Error 405 | 405 |

## Operaciones de Proveedores

| ID | Endpoint | Método | Entrada | Caso de Prueba | Expected | HTTP Code |
|----|----------|--------|---------|---|---|---|
| TC019 | `/api/proveedores` | GET | Sin parámetros | Listar todos los proveedores | Array con pagination | 200 |
| TC020 | `/api/proveedores?page=1&limit=10` | GET | Paginación | Obtener primera página | Array paginado | 200 |
| TC021 | `/api/proveedores?id=1` | GET | ID válido | Obtener proveedor por ID | Proveedor completo | 200 |
| TC022 | `/api/proveedores?id=9999` | GET | ID inválido | Obtener proveedor inexistente | null | 200 |
| TC023 | `/api/proveedores/1/productos` | GET | ID válido sin anidación | Endpoint anidado - productos de proveedor | Array productos | 200 |
| TC024 | `/api/proveedores/1/productos?page=1&limit=5` | GET | Anidación con paginación | Productos paginados del proveedor | Array paginado | 200 |
| TC025 | `/api/proveedores/9999/productos` | GET | Proveedor no existe | Obtener productos de proveedor inexistente | Error 404 | 404 |
| TC026 | `/api/proveedores` | POST | JSON válido | Crear nuevo proveedor como admin | Proveedor creado | 201 |
| TC027 | `/api/proveedores` | POST | JSON sin nombre | Crear sin campo nombre | Error validación | 400 |
| TC028 | `/api/proveedores` | POST | User no admin | Crear como usuario regular | Error 403 | 403 |
| TC029 | `/api/proveedores?id=1` | PUT | JSON válido | Actualizar proveedor existente | Proveedor actualizado | 200 |
| TC030 | `/api/proveedores?id=1` | PUT | Sin parámetro ID | Actualizar sin ID | Error 400 | 400 |
| TC031 | `/api/proveedores?id=9999` | PUT | ID inexistente | Actualizar proveedor no existente | Error 404 | 404 |
| TC032 | `/api/proveedores?id=1` | DELETE | ID válido | Eliminar proveedor existente | Sin contenido | 204 |
| TC033 | `/api/proveedores?id=9999` | DELETE | ID inexistente | Eliminar proveedor no existente | Error 404 | 404 |

## Operaciones de Categorías

| ID | Endpoint | Método | Entrada | Caso de Prueba | Expected | HTTP Code |
|----|----------|--------|---------|---|---|---|
| TC034 | `/api/categorias` | GET | Sin parámetros | Listar todas las categorías | Array con pagination | 200 |
| TC035 | `/api/categorias?page=1&limit=10` | GET | Paginación | Obtener primera página | Array paginado | 200 |
| TC036 | `/api/categorias?id=1` | GET | ID válido | Obtener categoría por ID | Categoría completa | 200 |
| TC037 | `/api/categorias?id=9999` | GET | ID inválido | Obtener categoría inexistente | Error 404 | 404 |
| TC038 | `/api/categorias` | POST | JSON válido | Crear nueva categoría como admin | Categoría creada | 201 |
| TC039 | `/api/categorias` | POST | JSON sin nombre | Crear sin campo nombre | Error validación | 400 |
| TC040 | `/api/categorias` | POST | User no admin | Crear como usuario regular | Error 403 | 403 |
| TC041 | `/api/categorias?id=1` | PUT | JSON válido | Actualizar categoría existente | Categoría actualizada | 200 |
| TC042 | `/api/categorias?id=1` | PUT | Sin parámetro ID | Actualizar sin ID | Error 400 | 400 |
| TC043 | `/api/categorias?id=9999` | PUT | ID inexistente | Actualizar categoría no existente | Error 404 | 404 |
| TC044 | `/api/categorias?id=1` | DELETE | ID válido | Eliminar categoría existente | Sin contenido | 204 |
| TC045 | `/api/categorias?id=9999` | DELETE | ID inexistente | Eliminar categoría no existente | Error 404 | 404 |

## Autenticación y Autorización

| ID | Endpoint | Método | Entrada | Caso de Prueba | Expected | HTTP Code |
|----|----------|--------|---------|---|---|---|
| TC046 | `/api/login` | POST | Usuario admin + password | Login con credenciales válidas | JWT token | 200 |
| TC047 | `/api/login` | POST | Usuario incorrecto | Login con usuario inexistente | Error credenciales | 401 |
| TC048 | `/api/login` | POST | Password incorrecto | Login con contraseña inválida | Error credenciales | 401 |
| TC049 | `/api/login` | POST | Sin credenciales | JSON incompleto | Error validación | 400 |
| TC050 | `/api/productos` | POST | Token inválido | Crear producto sin JWT válido | Error 401 | 401 |
| TC051 | `/api/productos` | POST | Role user | Crear producto como role "user" | Error 403 | 403 |
| TC052 | `/api/login` | GET | Sin método POST | GET en endpoint login | Error 405 | 405 |

## Health Check y Monitoreo

| ID | Endpoint | Método | Entrada | Caso de Prueba | Expected | HTTP Code |
|----|----------|--------|---------|---|---|---|
| TC053 | `/api/health` | GET | Sin parámetros | Verificar estado del servidor | JSON status + BD | 200 |
| TC054 | `/api/health` | GET | BD disponible | Health check con BD operativa | healthy status | 200 |
| TC055 | `/api/health` | GET | BD no disponible (simulado) | Health check con BD desconectada | unhealthy status | 503 |
| TC056 | `/api/health` | POST | Método POST | POST en health check | Error 405 | 405 |

## Casos Especiales

| ID | Endpoint | Método | Entrada | Caso de Prueba | Expected | HTTP Code |
|----|----------|--------|---------|---|---|---|
| TC057 | `/api/productos` | POST | Stock negativo | Crear producto con stock negativo | Error validación | 400 |
| TC058 | `/api/productos` | POST | Precio inválido | Crear producto con precio no numérico | Error validación | 400 |
| TC059 | `/api/productos?proveedor=1` | GET | Filtro proveedor | Filtrar productos por proveedor | Productos del proveedor | 200 |
| TC060 | `/api/productos` | POST | Proveedor no existe | Crear producto con proveedor inválido | Error validación | 400 |

---

*Documento generado en el Sprint 2 - Diciembre 2025*
