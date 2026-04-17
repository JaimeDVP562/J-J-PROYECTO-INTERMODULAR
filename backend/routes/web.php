<?php

use App\Http\Controllers\Admin\CategoriasController;
use App\Http\Controllers\Admin\ClientesController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FacturasController;
use App\Http\Controllers\Admin\JornadasController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\ProductosController;
use App\Http\Controllers\Admin\ProveedoresController;
use App\Http\Controllers\Admin\UsuariosController;
use App\Http\Controllers\Admin\VentasController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes — Panel de Administración Blade (Laravel Breeze pattern)
|--------------------------------------------------------------------------
*/

// Redirigir raíz al panel admin
Route::get('/', fn () => redirect()->route('admin.login'));

/*
|--------------------------------------------------------------------------
| Panel de Administración (/admin)
| Guard: web (sesiones Laravel, igual que Laravel Breeze)
| Estilos: Bootstrap 5 (CDN)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {

    // ── Autenticación ──────────────────────────────────────────────────
    Route::get('/login',   [LoginController::class, 'showLogin'])->name('login');
    Route::post('/login',  [LoginController::class, 'login']);
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // ── Área protegida (admin y gerente) ───────────────────────────────
    Route::middleware('auth')->group(function () {

        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // Usuarios — CRUD completo con vistas Blade
        Route::get('/usuarios',               [UsuariosController::class, 'index'])->name('usuarios.index');
        Route::get('/usuarios/nuevo',         [UsuariosController::class, 'create'])->name('usuarios.create');
        Route::post('/usuarios',              [UsuariosController::class, 'store'])->name('usuarios.store');
        Route::get('/usuarios/{id}/editar',   [UsuariosController::class, 'edit'])->name('usuarios.edit');
        Route::put('/usuarios/{id}',          [UsuariosController::class, 'update'])->name('usuarios.update');
        Route::delete('/usuarios/{id}',       [UsuariosController::class, 'destroy'])->name('usuarios.destroy');

        // Productos — CRUD completo con vistas Blade
        Route::get('/productos',              [ProductosController::class, 'index'])->name('productos.index');
        Route::get('/productos/nuevo',        [ProductosController::class, 'create'])->name('productos.create');
        Route::post('/productos',             [ProductosController::class, 'store'])->name('productos.store');
        Route::get('/productos/{id}/editar',  [ProductosController::class, 'edit'])->name('productos.edit');
        Route::put('/productos/{id}',         [ProductosController::class, 'update'])->name('productos.update');
        Route::delete('/productos/{id}',      [ProductosController::class, 'destroy'])->name('productos.destroy');

        // Clientes — CRUD completo
        Route::get('/clientes',               [ClientesController::class, 'index'])->name('clientes.index');
        Route::get('/clientes/nuevo',         [ClientesController::class, 'create'])->name('clientes.create');
        Route::post('/clientes',              [ClientesController::class, 'store'])->name('clientes.store');
        Route::get('/clientes/{id}/editar',   [ClientesController::class, 'edit'])->name('clientes.edit');
        Route::put('/clientes/{id}',          [ClientesController::class, 'update'])->name('clientes.update');
        Route::delete('/clientes/{id}',       [ClientesController::class, 'destroy'])->name('clientes.destroy');

        // Proveedores — CRUD completo
        Route::get('/proveedores',              [ProveedoresController::class, 'index'])->name('proveedores.index');
        Route::get('/proveedores/nuevo',        [ProveedoresController::class, 'create'])->name('proveedores.create');
        Route::post('/proveedores',             [ProveedoresController::class, 'store'])->name('proveedores.store');
        Route::get('/proveedores/{id}/editar',  [ProveedoresController::class, 'edit'])->name('proveedores.edit');
        Route::put('/proveedores/{id}',         [ProveedoresController::class, 'update'])->name('proveedores.update');
        Route::delete('/proveedores/{id}',      [ProveedoresController::class, 'destroy'])->name('proveedores.destroy');

        // Categorías — CRUD completo
        Route::get('/categorias',              [CategoriasController::class, 'index'])->name('categorias.index');
        Route::get('/categorias/nuevo',        [CategoriasController::class, 'create'])->name('categorias.create');
        Route::post('/categorias',             [CategoriasController::class, 'store'])->name('categorias.store');
        Route::get('/categorias/{id}/editar',  [CategoriasController::class, 'edit'])->name('categorias.edit');
        Route::put('/categorias/{id}',         [CategoriasController::class, 'update'])->name('categorias.update');
        Route::delete('/categorias/{id}',      [CategoriasController::class, 'destroy'])->name('categorias.destroy');

        // Facturas — listado + edición + eliminación
        Route::get('/facturas',               [FacturasController::class, 'index'])->name('facturas.index');
        Route::get('/facturas/{id}/editar',   [FacturasController::class, 'edit'])->name('facturas.edit');
        Route::put('/facturas/{id}',          [FacturasController::class, 'update'])->name('facturas.update');
        Route::delete('/facturas/{id}',       [FacturasController::class, 'destroy'])->name('facturas.destroy');

        // Ventas — listado + detalle + eliminación
        Route::get('/ventas',                 [VentasController::class, 'index'])->name('ventas.index');
        Route::get('/ventas/{id}',            [VentasController::class, 'show'])->name('ventas.show');
        Route::delete('/ventas/{id}',         [VentasController::class, 'destroy'])->name('ventas.destroy');

        // Jornadas — listado + eliminación
        Route::get('/jornadas',               [JornadasController::class, 'index'])->name('jornadas.index');
        Route::delete('/jornadas/{id}',       [JornadasController::class, 'destroy'])->name('jornadas.destroy');
    });
});
