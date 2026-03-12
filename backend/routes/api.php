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
Route::post('login', [\App\Http\Controllers\Api\AuthController::class, 'login']);

// Rutas protegidas con autenticación
Route::middleware('auth.apitoken')->group(function () {
    Route::post('logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);

    // Recursos CRUD
    Route::apiResource('productos', ProductoController::class);
    Route::apiResource('proveedores', ProveedorController::class);
    Route::apiResource('clientes', \App\Http\Controllers\Api\ClienteController::class);
    Route::apiResource('facturas', \App\Http\Controllers\Api\FacturaController::class);
    Route::apiResource('detalle-facturas', \App\Http\Controllers\Api\DetalleFacturaController::class);
    Route::apiResource('empleados', \App\Http\Controllers\Api\EmpleadoController::class);
    Route::apiResource('inventarios', \App\Http\Controllers\Api\InventarioController::class);
    Route::post('ventas/pago-proveedor', [VentaController::class, 'pagoProveedor']);
    Route::get('ventas/mis-hoy', [VentaController::class, 'misHoy']);
    Route::apiResource('ventas', VentaController::class);
    Route::apiResource('detalle-ventas', \App\Http\Controllers\Api\DetalleVentaController::class);
    Route::apiResource('categorias', \App\Http\Controllers\Api\CategoriaController::class);

    // Jornadas
    Route::get('jornadas/activa', [JornadaController::class, 'activa']);
    Route::get('jornadas/resumen-hoy', [JornadaController::class, 'resumenHoy']);
    Route::get('jornadas/resumen-mensual', [JornadaController::class, 'resumenMensual']);
    Route::get('jornadas/usuario/{userId}', [JornadaController::class, 'jornadasUsuario']);
    Route::post('jornadas/admin', [JornadaController::class, 'adminStore']);
    Route::get('jornadas', [JornadaController::class, 'index']);
    Route::post('jornadas', [JornadaController::class, 'store']);
    Route::patch('jornadas/{id}/fin', [JornadaController::class, 'marcarFin']);
    Route::put('jornadas/{id}', [JornadaController::class, 'adminUpdate']);
    Route::delete('jornadas/{id}', [JornadaController::class, 'adminDestroy']);

    // Gestión de usuarios (solo admin)
    Route::get('usuarios', [UserController::class, 'index']);
    Route::post('usuarios', [UserController::class, 'store']);
    Route::put('usuarios/{id}', [UserController::class, 'update']);
    Route::delete('usuarios/{id}', [UserController::class, 'destroy']);

    // Cierre de caja
    Route::get('cierre-cajas/total-hoy', [CierreCajaController::class, 'totalHoy']);
    Route::get('cierre-cajas', [CierreCajaController::class, 'index']);
    Route::post('cierre-cajas', [CierreCajaController::class, 'store']);
    Route::get('cierre-cajas/{id}', [CierreCajaController::class, 'show']);

    // Devoluciones
    Route::get('devoluciones/mis-hoy', [DevolucionController::class, 'misHoy']);
    Route::get('devoluciones', [DevolucionController::class, 'index']);
    Route::post('devoluciones', [DevolucionController::class, 'store']);

    // Perfil
    Route::get('perfil', [PerfilController::class, 'show']);
    Route::post('perfil', [PerfilController::class, 'update']);
    Route::get('perfil/{id}', [PerfilController::class, 'showById']);

    // Estadísticas (admin/gerente)
    Route::get('estadisticas', [EstadisticasController::class, 'index']);

    // Ayuda
    Route::post('ayuda', [AyudaController::class, 'enviar']);
});
