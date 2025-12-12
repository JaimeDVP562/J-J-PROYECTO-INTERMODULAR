# Backend — Guía de presentación (categorías, CORS, .htaccess, roles y flujos)

Este README es una guía pensada para la defensa/presentación del backend. Contiene explicaciones "para tontos" sobre `_cors.php`, `.htaccess`, `categorias.php`, los controladores/modelos relevantes, los roles `admin`/`user` y el flujo completo de un `DELETE` (API → controlador → modelo → BD). Incluye ejemplos curl y "speaking points" que puedes leer en la defensa.

**Estructura rápida**
- `backend/api/_cors.php`       : helper CORS (cabeceras + preflight OPTIONS).
- `.htaccess`                  : rewrite rules para rutas amigables `/api/entidad/123`.
- `backend/api/categorias.php` : endpoint HTTP para CRUD de categorías (JSON API).
- `backend/modelo/categorias_modelo.php` : acceso a BD (PDO) para categorías.
- `backend/controlador/*.php`  : controladores (productos/proveedores) — encapsulan lógica.
- `backend/auth/jwt.php`       : helpers JWT (decodificar, require_role_or_403).

---

**1) `_cors.php` — qué hace y por qué mostrarlo**
- Función: pone cabeceras CORS necesarias para que el SPA o Postman puedan llamar la API desde otro origen.
- Cabeceras importantes:
  - `Access-Control-Allow-Origin: *` (desarrollo; en producción restringir).
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`.
  - `Access-Control-Allow-Headers: Content-Type, Authorization` (permite enviar Bearer token).
- Comportamiento: si la petición es `OPTIONS` responde 200 y sale (preflight).
- Nota para la defensa: explica que es una configuración de desarrollo y las medidas a tomar en producción (origenes concretos, allow-credentials si se usan cookies).

**2) `.htaccess` — qué hace y por qué está**
- Función: convierte URLs limpias en llamadas a los scripts PHP del backend.
- Reglas clave (ejemplos):
  - `/api/entidad/123` → `backend/api/entidad.php?id=123`
  - `/api/parent/5/child` → `backend/api/child.php?parent=5`
  - `/api/entidad` → `backend/api/entidad.php`
- Por qué es útil en la demo: permite mostrar rutas REST (más legible) sin cambiar la lógica del API.
- Precaución: reglas Apache; si el servidor es IIS o similar hay que adaptar la configuración.

**3) `categorias.php` — qué implementamos (resumen de responsabilidades)**
- Capa HTTP: valida método, parámetros, autorización, llama al modelo y devuelve JSON.
- Métodos soportados:
  - `GET /api/categorias` → listado paginado (`page`, `limit`).
  - `GET /api/categorias?id=NN` → devuelve categoría por id.
  - `POST /api/categorias` → crea categoría. `require_role_or_403(['admin','user'])`.
  - `PUT /api/categorias?id=NN` → actualiza. `require_role_or_403(['admin'])`.
  - `DELETE /api/categorias?id=NN` → borra. `require_role_or_403(['admin'])`.
- Validaciones: JSON válido, campo `nombre` obligatorio en POST.
- Respuestas: códigos HTTP apropiados (201, 204, 400, 401, 403, 404, 500).
- Logging: se registra cada acción con `Logger::info/warning/success/error` en `logs/api.log`.

**4) `categorias_modelo.php` — responsabilidades del modelo**
- Métodos:
  - `listarCategorias($limit,$offset)` → SELECT con LIMIT/OFFSET.
  - `contarCategorias()` → COUNT(*) para paginación.
  - `obtenerPorId($id)` → SELECT WHERE id.
  - `crearCategoria($data)` → INSERT y devuelve `lastInsertId()`.
  - `actualizarCategoria($id,$data)` → UPDATE; devuelve boolean si `rowCount()>0`.
  - `eliminarCategoria($id)` → DELETE; devuelve boolean si `rowCount()>0`.
- Nota: el modelo no hace validación HTTP ni auth; devuelve datos puros o `true/false`.

---

**RECURSOS: `categorias`, `productos` y `proveedores` (explicación conjunta)**

En la demo conviene explicar los tres recursos de seguido. Aquí están las responsabilidades, permisos, flujos y ejemplos para cada uno, uno tras otro.

1) `categorias`
- Capa HTTP: `backend/api/categorias.php` — valida método, parámetros y autorización; usa `CategoriasModelo`.
- Modelo: `backend/modelo/categorias_modelo.php` — `listar`, `contar`, `obtenerPorId`, `crear`, `actualizar`, `eliminar`.
- Roles: `GET` público; `POST` permite `admin,user`; `PUT/DELETE` solo `admin`.
- Flujo DELETE: API valida token/rol → confirma existencia via modelo → modelo ejecuta `DELETE` → API responde `204` si ok.
- Ejemplo curl:
```
curl -X DELETE "http://localhost/api/categorias?id=3" -H "Authorization: Bearer <TOKEN>"
```

2) `productos`
- Capa HTTP: `backend/api/productos.php` — usa `ProductosControlador` y `ProductosModelo`.
- Funcionalidades clave: paginación, búsqueda (`q`), ordenación, filtro por `proveedor`, `include=proveedor`, export CSV/JSON.
- Validaciones: `nombre` obligatorio; `stock` entero >=0; `precio` numérico; `proveedor` debe existir (se valida con `ProveedoresModelo`).
- Roles: `GET` público; `POST` requiere `admin|user`; `PUT/DELETE` requieren `admin`.
- Flujo DELETE: API (`productos.php`) exige `admin`, confirma existencia con `$controlador->verProducto`, llama `$controlador->eliminarProducto`, modelo ejecuta `DELETE` y devuelve resultado; API responde `204` si éxito.
- Ejemplo curl:
```
curl -X DELETE "http://localhost/api/productos?id=5" -H "Authorization: Bearer <TOKEN>"
```

3) `proveedores`
- Capa HTTP: `backend/api/proveedores.php` — usa `ProveedoresControlador` y `ProveedoresModelo`.
- Funcionalidades clave: CRUD con paginación; endpoint anidado `/proveedores/{id}/productos` para listar productos de un proveedor.
- Validaciones: `nombre` obligatorio en creación; el endpoint anidado verifica que el proveedor exista antes de listar productos.
- Roles: `GET` público; `POST` requiere `admin|user`; `PUT/DELETE` requieren `admin`.
- Flujo DELETE: API valida token/rol, confirma existencia vía controlador/modelo y delega `DELETE` al modelo; API responde `204` si OK.
- Ejemplo curl:
```
curl -X DELETE "http://localhost/api/proveedores?id=7" -H "Authorization: Bearer <TOKEN>"
```

---

**5) Roles y autorización (cómo se comprueba)**
- Componente: `backend/auth/jwt.php`.
- Flujo resumido:
  - `require_role_or_403(['admin'])` llama a `require_jwt_or_401()`.
  - `require_jwt_or_401()` extrae el token `Bearer` del header `Authorization` y llama a `jwt_decode()`.
  - `jwt_decode()` valida firma (HMAC-SHA256 con `JWT_SECRET`) y expiración (`exp`).
  - Si falta token → 401; si rol no permitido → 403.
- Roles usados en el proyecto (según endpoints):
  - `admin` : puede `PUT` y `DELETE` en recursos sensibles; puede también `POST`.
  - `user`  : puede `POST` (crear) en algunos recursos, pero no `PUT` ni `DELETE`.

**6) Flujo completo de `DELETE` — paso a paso (API → controlador → modelo → BD)**
Ejemplo: `DELETE /api/productos?id=5` (requiere rol `admin`)
1. Cliente envía `DELETE /api/productos?id=5` con header `Authorization: Bearer <token>`.
2. `.htaccess` (opcional) mapea la ruta a `backend/api/productos.php?id=5`.
3. `productos.php` (API layer):
   - Llama `require_role_or_403(['admin'])` → valida JWT y rol.
   - Comprueba que existe `id` en query string; si no, responde `400`.
   - Llama al controlador: `$controlador->verProducto($id)` para confirmar existencia.
   - Si existe, llama `$controlador->eliminarProducto($id)`.
4. `ProductosControlador::eliminarProducto($id)` delega a `ProductosModelo->eliminarProducto($id)`.
5. `ProductosModelo->eliminarProducto($id)` ejecuta la consulta SQL: `DELETE FROM productos WHERE id = :id` usando PDO (prepared statement).
6. El modelo devuelve `true` si `rowCount()>0`.
7. El controlador reenvía ese resultado al API; `productos.php` responde `204` si `true`, o `500` si hubo error.
8. Log: `Logger::success('DELETE /productos/5 - Eliminado exitosamente')`.

**7) Ejemplos curl (para la demo)**
- Login (recibir token):
```
curl -X POST http://localhost/backend/api/login.php -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}'
```
- Borrar producto (ejemplo):
```
curl -X DELETE "http://localhost/api/productos/5" -H "Authorization: Bearer <TOKEN>"
```
- Borrar categoría (ejemplo):
```
curl -X DELETE "http://localhost/api/categorias/3" -H "Authorization: Bearer <TOKEN>"
```
Nota: si usas la versión sin rewrite, apunta a `backend/api/categorias.php?id=3`.

**8) Speaking points (para leer en la defensa) — 1 línea por punto**
- `_cors.php`: "Habilitamos CORS en desarrollo para que SPA y herramientas externas puedan consumir la API; en producción lo restringiremos por dominio."
- `.htaccess`: "Rewrite rules simples para exponer rutas REST limpias sin tocar la lógica del backend."
- `categorias.php`: "Es la capa HTTP que valida, autoriza y llama al modelo; devuelve códigos HTTP adecuados y escribe logs."
- `categorias_modelo.php`: "Encapsula todas las consultas SQL usando PDO y prepared statements; devuelve datos o booleanos."
- `auth/jwt.php`: "Validación JWT mínima: firma HMAC-SHA256 y expiración; `require_role_or_403` centraliza control de acceso."
- `DELETE` flow: "El API valida token/rol, confirma existencia con el modelo, delega la eliminación al modelo y responde 204 en éxito — todo queda registrado en logs."

**9) Evidencias y dónde mostrarlas en la demo**
- Swagger UI: abrir `backend/public/swagger/index.html` para navegar y probar endpoints.
- Script BD: `backend/schema.sql` (muestra tablas y usuarios demo).
- Logs: `logs/api.log` para mostrar trazas de llamadas (ej. DELETE realizado durante la demo).

**10) Riesgos y notas de mejora (mencionar si te preguntan)**
- `JWT_SECRET` en `backend/config.php` es de ejemplo — en producción usar variable de entorno con secreto fuerte.
- `schema.sql` inserta usuarios con MD5 como fallback para desarrollo; documentarlo como riesgo y migrarlo a bcrypt/argon2 en producción.
- `Access-Control-Allow-Origin: *` es inseguro en producción.
- Sugerencia: añadir un `controlador` para `categorias` (como se hizo para `productos`) para un mejor separation of concerns.

---

Si quieres, puedo:
- Añadir un diagrama ASCII del flujo `DELETE` listo para pegar en una diapositiva.
- Generar una versión corta (`backend/README_TLDR.md`) con sólo 3-4 bullet points por recurso para las slides.
- Exportar ejemplos curl a un archivo `backend/docs/ejemplos_curl.md`.

---

**12) Resumen comparativo (categorías vs productos vs proveedores)**
- `categorias`: API llama directamente al modelo (controlador ausente). Más simple, menos capas.
- `productos` y `proveedores`: usan controladores para separar lógica de negocio de acceso a datos (mejor escalabilidad y testabilidad).
- Todos usan `auth/jwt.php` para proteger operaciones de escritura y `Logger` para trazabilidad.

**13) Archivos que puedes mostrar en la demo (orden recomendado)**
1. `backend/public/swagger/index.html` — abrir y mostrar endpoints.
2. `backend/schema.sql` — mostrar estructura y usuarios demo.
3. `backend/api/login.php` — explicar cómo se emite el token.
4. `backend/api/productos.php` y `backend/controlador/productos_controlador.php` — mostrar separación controlador/modelo.
5. `backend/api/categorias.php` y `backend/modelo/categorias_modelo.php` — mostrar el flujo directo API→modelo.
6. `logs/api.log` — mostrar una entrada real (p. ej. DELETE realizado durante la demo).

---

He añadido las secciones de `productos` y `proveedores` en el README de presentación. ¿Quieres que ahora:
- Genere un diagrama ASCII del flujo `DELETE` para pegar en la diapositiva, o
- Cree un `backend/README_TLDR.md` con una versión ultra-corta orientada a slides?

