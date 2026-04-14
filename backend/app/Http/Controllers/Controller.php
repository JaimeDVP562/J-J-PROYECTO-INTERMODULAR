<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="J-J ERP API",
 *     version="1.0.0",
 *     description="API REST del sistema ERP J-J. Desarrollada con Laravel 12 y autenticada con Laravel Sanctum (Bearer Token). Permite gestionar productos, ventas, facturas, empleados, jornadas y más.",
 *     @OA\Contact(email="admin@negocio.test"),
 *     @OA\License(name="MIT", url="https://opensource.org/licenses/MIT")
 * )
 *
 * @OA\Server(url="http://localhost:8000", description="Desarrollo local")
 * @OA\Server(url="https://api.negocio.test", description="Producción")
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="Token",
 *     description="Token Sanctum obtenido en /api/login. Usar como: Authorization: Bearer {token}"
 * )
 *
 * @OA\Tag(name="Autenticación",  description="Login y logout")
 * @OA\Tag(name="Productos",      description="CRUD de productos")
 * @OA\Tag(name="Clientes",       description="CRUD de clientes")
 * @OA\Tag(name="Proveedores",    description="CRUD de proveedores")
 * @OA\Tag(name="Facturas",       description="Facturación y Verifactu")
 * @OA\Tag(name="Ventas",         description="Punto de venta y ventas")
 * @OA\Tag(name="Empleados",      description="CRUD de empleados")
 * @OA\Tag(name="Jornadas",       description="Control de jornada laboral")
 * @OA\Tag(name="Estadísticas",   description="Estadísticas del negocio")
 * @OA\Tag(name="Usuarios",       description="Gestión de usuarios del sistema")
 */
abstract class Controller
{
    //
}
