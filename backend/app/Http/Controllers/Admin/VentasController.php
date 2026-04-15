<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Venta;

class VentasController extends Controller
{
    public function index()
    {
        $ventas = Venta::with(['user', 'cliente'])
            ->latest('fecha_venta')
            ->paginate(20);
        return view('admin.ventas.index', compact('ventas'));
    }

    public function show(int $id)
    {
        $venta = Venta::with(['user', 'cliente', 'detalles.producto'])->findOrFail($id);
        return view('admin.ventas.show', compact('venta'));
    }

    public function destroy(int $id)
    {
        Venta::findOrFail($id)->delete();

        return redirect()->route('admin.ventas.index')
            ->with('success', 'Venta eliminada correctamente.');
    }
}
