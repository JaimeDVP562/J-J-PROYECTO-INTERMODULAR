<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\ProveedorController;
use App\Http\Controllers\Api\AuthController;


// Ruta de prueba
Route::get('/prueba', function () {
    return ['mensaje' => 'API funcionando correctamente'];
});

// ------------------- RUTAS PÚBLICAS -------------------
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Productos y Proveedors: solo index y show públicos
Route::apiResource('productos', ProductoController::class, ['as' => 'api'])->only(['index', 'show']);
Route::apiResource('proveedors', ProveedorController::class, ['as' => 'api'])->only(['index', 'show']);

// ------------------- RUTAS PRIVADAS -------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('productos', ProductoController::class, ['as' => 'api'])->except(['index', 'show']);
    Route::apiResource('proveedors', ProveedorController::class, ['as' => 'api'])->except(['index', 'show']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
