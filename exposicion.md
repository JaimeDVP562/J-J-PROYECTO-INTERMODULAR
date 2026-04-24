Exposición — J-J ERP (guion narrativo, 8–10 min)

---

## 0. Introducción (30–45 s)

J-J ERP centraliza la gestión de un negocio: punto de venta, facturación, inventario, control horario y panel de administración.

Stack: Laravel 12 (PHP 8.3) · Angular 20 · Blade admin · OpenAPI/Swagger · AWS + Terraform · GitHub Actions.

---

## 1. Arquitectura y despliegue (≈90 s)

**Infraestructura como código** — cuatro instancias EC2 definidas en Terraform:
- `despliegue/main.tf` L143–L195: Bastion, Frontend, API, Database.
- EIPs: L199 (Bastion) y L205 (Frontend).
- DNS interno vía Route 53 zona privada: L216.

**CI/CD** — `.github/workflows/ci-cd-deploy.yml`:
- Jobs: `test-backend` L17 · `build-frontend` L48 · `deploy-backend` L81 · `deploy-frontend` L156.
- Transferencia con rsync: L107 (backend) y L185 (frontend).

**HTTPS** — `despliegue/certbot-setup.sh`:
- Instalación de certbot + plugin DuckDNS: L43.
- Configuración Apache con certificados Let's Encrypt: L82–L83.

**Local** — `docker-compose.yml`:
- Servicios backend (L24) y frontend (L55).
- Arranque del contenedor backend: `composer install` + migraciones + seed: L51.

---

## 2. Backend — qué hace y dónde (≈2 min)

**Dependencias** — `backend/composer.json`:
- `laravel/framework ^12` L12 · `laravel/sanctum ^4` L13 · `darkaonline/l5-swagger ^9` L10.

**Autenticación con Sanctum**:
- `backend/app/Models/User.php` L10: `use HasApiTokens`; aplicado en L15.
- `backend/app/Http/Controllers/Api/AuthController.php` L55: `createToken()` con TTL de 12 h.
- Logout revoca el token actual: L75.

**Rutas API REST** — `backend/routes/api.php`:
- Grupo `auth:sanctum`: L19.
- `Route::apiResource` para todos los recursos (productos, facturas, ventas, etc.): L23–L39.

**Panel admin Blade** — `backend/routes/web.php`:
- Prefijo `/admin`: L31. Rutas de login: L34–L35.

**Facturación electrónica**:
- `backend/app/Http/Controllers/Api/FacturaController.php` L64: asignación atómica de número de factura con `invoice_counters` + `lockForUpdate`.
- Comprobación de la tabla antes de usar: L285.
- `backend/app/Services/VerifactuService.php` L8: clase encapsulada; método `send()`: L56.

**Swagger/OpenAPI** — `backend/app/Http/Controllers/Controller.php` L6–L15: anotaciones `@OA\Info` y `@OA\Server` que generan la documentación automáticamente.

---

## 3. Frontend — experiencia y pruebas (≈2 min)

**Stack y librerías** — `frontend/package.json`:
- `@angular/core ^20` L28 · `bootstrap ^5.3` L32.

**Guards y rutas** — `frontend/src/app/app.routes.ts`:
- `canActivate: [AuthGuard]` en la ruta principal: L20.
- `canActivate: [AdminGuard]` en `/usuarios`: L28.

**Persistencia del token** — `frontend/src/app/auth/auth.service.ts`:
- `localStorage.setItem('api_token', ...)` L16.
- `localStorage.setItem('current_user', ...)` L19.

**Capa de API** — `frontend/src/app/services/api.service.ts`:
- `handleError()` centralizado: L33. Todos los métodos HTTP usan `catchError(this.handleError)`.

**Componente reutilizable** — `frontend/src/app/paginador/paginador.ts`:
- `@Input()` (página actual, total, etiqueta): L12–L14.
- `@Output() paginaCambiada`: L16.

**Tests unitarios en CI**:
- `frontend/src/app/auth/auth.service.spec.ts` L7 · `frontend/src/app/services/api.service.spec.ts` L7 · `frontend/src/app/paginador/paginador.spec.ts` L4.
- `.github/workflows/tests.yml` L70: `ng test --watch=false --browsers=ChromeHeadlessCI`.

---

## 4. Seguridad (30–45 s)

**WAF / ModSecurity** — `despliegue/templates/frontend.sh.tftpl` L72–L74:
- Instala `libapache2-mod-security2` y pone `SecRuleEngine DetectionOnly`.

**Sanctum + HTTPS**: toda la API exige token Bearer y el tráfico va cifrado con certificado Let's Encrypt (ver sección 1).

---

## 5. Cierre (30 s)

El proyecto cubre los requisitos obligatorios con evidencia directa en el código:
backend Laravel 12 + Sanctum + Swagger · frontend Angular 20 + guards + tests · infra Terraform + GitHub Actions · HTTPS con certbot.
