<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Models\Empleado;
use App\Models\Producto;
use App\Models\User;
use App\Models\Venta;

class DashboardController extends Controller
{
    public function index()
    {
        return view('admin.dashboard', [
            'totalUsuarios'  => User::count(),
            'totalProductos' => Producto::count(),
            'totalClientes'  => Cliente::count(),
            'totalEmpleados' => Empleado::count(),
            'ultimasVentas'  => Venta::latest('fecha_venta')->take(10)->get(),
        ]);
    }
}
