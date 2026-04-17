<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\ProveedorController;
use App\Http\Controllers\Api\JornadaController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VentaController;
use App\Http\Controllers\Api\CierreCajaController;
use App\Http\Controllers\Api\DevolucionController;
use App\Http\Controllers\Api\PerfilController;
use App\Http\Controllers\Api\AyudaController;
use App\Http\Controllers\Api\EstadisticasController;

// Rutas públicas
Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'login'])->name('auth.login');

// Rutas protegidas con autenticación (Laravel Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [\App\Http\Controllers\Api\AuthController::class, 'logout'])->name('auth.logout');

    // Recursos CRUD
    Route::apiResource('productos', ProductoController::class)->names('productos');
    Route::apiResource('proveedores', ProveedorController::class)->names('proveedores');
    Route::apiResource('clientes', \App\Http\Controllers\Api\ClienteController::class)->names('clientes');

    // Colocar la ruta específica antes del resource para evitar que
    // 'next-number' sea interpretado como {factura} por la ruta 'show'
    Route::get('facturas/next-number', [\App\Http\Controllers\Api\FacturaController::class, 'nextNumber'])->name('facturas.next-number');
    Route::apiResource('facturas', \App\Http\Controllers\Api\FacturaController::class)->names('facturas');
    Route::post('facturas/{id}/resend-verifactu', [\App\Http\Controllers\Api\FacturaController::class, 'resendVerifactu'])->name('facturas.resend-verifactu');

    Route::apiResource('detalle-facturas', \App\Http\Controllers\Api\DetalleFacturaController::class)->names('detalle-facturas');
    Route::apiResource('empleados', \App\Http\Controllers\Api\EmpleadoController::class)->names('empleados');
    Route::apiResource('inventarios', \App\Http\Controllers\Api\InventarioController::class)->names('inventarios');

    Route::post('ventas/pago-proveedor', [VentaController::class, 'pagoProveedor'])->name('ventas.pago-proveedor');
    Route::get('ventas/mis-hoy', [VentaController::class, 'misHoy'])->name('ventas.mis-hoy');
    Route::apiResource('ventas', VentaController::class)->names('ventas');
    Route::apiResource('detalle-ventas', \App\Http\Controllers\Api\DetalleVentaController::class)->names('detalle-ventas');
    Route::apiResource('categorias', \App\Http\Controllers\Api\CategoriaController::class)->names('categorias');

    // Jornadas
    Route::get('jornadas/activa', [JornadaController::class, 'activa'])->name('jornadas.activa');
    Route::get('jornadas/resumen-hoy', [JornadaController::class, 'resumenHoy'])->name('jornadas.resumen-hoy');
    Route::get('jornadas/resumen-mensual', [JornadaController::class, 'resumenMensual'])->name('jornadas.resumen-mensual');
    Route::get('jornadas/usuario/{userId}', [JornadaController::class, 'jornadasUsuario'])->name('jornadas.usuario');
    Route::post('jornadas/admin', [JornadaController::class, 'adminStore'])->name('jornadas.admin-store');
    Route::get('jornadas', [JornadaController::class, 'index'])->name('jornadas.index');
    Route::post('jornadas', [JornadaController::class, 'store'])->name('jornadas.store');
    Route::patch('jornadas/{id}/fin', [JornadaController::class, 'marcarFin'])->name('jornadas.marcar-fin');
    Route::put('jornadas/{id}', [JornadaController::class, 'adminUpdate'])->name('jornadas.admin-update');
    Route::delete('jornadas/{id}', [JornadaController::class, 'adminDestroy'])->name('jornadas.admin-destroy');

    // Gestión de usuarios (solo admin)
    Route::get('usuarios', [UserController::class, 'index'])->name('usuarios.index');
    Route::post('usuarios', [UserController::class, 'store'])->name('usuarios.store');
    Route::put('usuarios/{id}', [UserController::class, 'update'])->name('usuarios.update');
    Route::delete('usuarios/{id}', [UserController::class, 'destroy'])->name('usuarios.destroy');

    // Cierre de caja
    Route::get('cierre-cajas/total-hoy', [CierreCajaController::class, 'totalHoy'])->name('cierre-cajas.total-hoy');
    Route::get('cierre-cajas', [CierreCajaController::class, 'index'])->name('cierre-cajas.index');
    Route::post('cierre-cajas', [CierreCajaController::class, 'store'])->name('cierre-cajas.store');
    Route::get('cierre-cajas/{id}', [CierreCajaController::class, 'show'])->name('cierre-cajas.show');

    // Devoluciones
    Route::get('devoluciones/mis-hoy', [DevolucionController::class, 'misHoy'])->name('devoluciones.mis-hoy');
    Route::get('devoluciones', [DevolucionController::class, 'index'])->name('devoluciones.index');
    Route::post('devoluciones', [DevolucionController::class, 'store'])->name('devoluciones.store');

    // Empresa emisora
    Route::get('empresa', [\App\Http\Controllers\Api\EmpresaController::class, 'show'])->name('empresa.show');

    // Perfil
    Route::get('perfil', [PerfilController::class, 'show'])->name('perfil.show');
    Route::post('perfil', [PerfilController::class, 'update'])->name('perfil.update');
    Route::get('perfil/{id}', [PerfilController::class, 'showById'])->name('perfil.show-by-id');

    // Estadísticas (admin/gerente)
    Route::get('estadisticas', [EstadisticasController::class, 'index'])->name('estadisticas.index');

    // Ayuda
    Route::post('ayuda', [AyudaController::class, 'enviar'])->name('ayuda.enviar');
});
