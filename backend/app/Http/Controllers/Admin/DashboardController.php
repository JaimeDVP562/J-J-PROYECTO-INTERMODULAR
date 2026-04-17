<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
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
            'totalVendedores' => User::where('rol', 'vendedor')->count(),
            'ultimasVentas'  => Venta::with('user')->latest('fecha_venta')->take(10)->get(),
        ]);
    }
}
