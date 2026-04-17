<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Cliente;
use App\Models\Proveedor;
use Illuminate\Http\Request;

class FacturasController extends Controller
{
    public function index()
    {
        $facturas = Factura::with(['cliente', 'user'])
            ->latest()
            ->paginate(20);
        return view('admin.facturas.index', compact('facturas'));
    }

    public function edit(int $id)
    {
        $factura   = Factura::with(['cliente', 'detalles'])->findOrFail($id);
        $clientes  = Cliente::orderBy('nombre')->get();
        $proveedores = Proveedor::orderBy('nombre')->get();
        return view('admin.facturas.edit', compact('factura', 'clientes', 'proveedores'));
    }

    public function update(Request $request, int $id)
    {
        $factura = Factura::findOrFail($id);

        $request->validate([
            'status'         => ['required', 'in:pending,paid,cancelled'],
            'invoice_date'   => ['nullable', 'date'],
            'due_date'       => ['nullable', 'date'],
            'payment_method' => ['nullable', 'string', 'max:50'],
            'cliente_id'     => ['nullable', 'exists:clientes,id'],
        ]);

        $factura->update($request->only('status', 'invoice_date', 'due_date', 'payment_method', 'cliente_id'));

        return redirect()->route('admin.facturas.index')
            ->with('success', 'Factura actualizada correctamente.');
    }

    public function destroy(int $id)
    {
        Factura::findOrFail($id)->delete();

        return redirect()->route('admin.facturas.index')
            ->with('success', 'Factura eliminada correctamente.');
    }
}
