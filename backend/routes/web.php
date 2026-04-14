<?php

use App\Http\Controllers\Admin\ClientesController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmpleadosController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\Admin\ProductosController;
use App\Http\Controllers\Admin\UsuariosController;
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

        // Empleados — CRUD completo con vistas Blade
        Route::get('/empleados',              [EmpleadosController::class, 'index'])->name('empleados.index');
        Route::get('/empleados/nuevo',        [EmpleadosController::class, 'create'])->name('empleados.create');
        Route::post('/empleados',             [EmpleadosController::class, 'store'])->name('empleados.store');
        Route::get('/empleados/{id}/editar',  [EmpleadosController::class, 'edit'])->name('empleados.edit');
        Route::put('/empleados/{id}',         [EmpleadosController::class, 'update'])->name('empleados.update');
        Route::delete('/empleados/{id}',      [EmpleadosController::class, 'destroy'])->name('empleados.destroy');

        // Clientes — listado (solo lectura)
        Route::get('/clientes', [ClientesController::class, 'index'])->name('clientes.index');
    });
});
