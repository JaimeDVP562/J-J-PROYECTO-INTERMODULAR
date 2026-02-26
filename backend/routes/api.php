<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\ProveedorController;
use App\Http\Controllers\Api\JornadaController;
use App\Http\Controllers\Api\UserController;

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
    Route::apiResource('ventas', \App\Http\Controllers\Api\VentaController::class);
    Route::apiResource('detalle-ventas', \App\Http\Controllers\Api\DetalleVentaController::class);
    Route::apiResource('categorias', \App\Http\Controllers\Api\CategoriaController::class);

    // Jornadas
    Route::get('jornadas/activa', [JornadaController::class, 'activa']);
    Route::get('jornadas/resumen-hoy', [JornadaController::class, 'resumenHoy']);
    Route::get('jornadas', [JornadaController::class, 'index']);
    Route::post('jornadas', [JornadaController::class, 'store']);
    Route::patch('jornadas/{id}/fin', [JornadaController::class, 'marcarFin']);

    // Gestión de usuarios (solo admin)
    Route::get('usuarios', [UserController::class, 'index']);
    Route::post('usuarios', [UserController::class, 'store']);
    Route::put('usuarios/{id}', [UserController::class, 'update']);
    Route::delete('usuarios/{id}', [UserController::class, 'destroy']);
});
