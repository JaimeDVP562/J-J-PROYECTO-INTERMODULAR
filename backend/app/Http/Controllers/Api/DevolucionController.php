<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devolucion;
use App\Models\Venta;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DevolucionController extends Controller
{
    public function index()
    {
        $devoluciones = Devolucion::with('venta.detalles.producto', 'user')
            ->orderBy('fecha', 'desc')
            ->get();
        return response()->json($devoluciones);
    }

    public function misHoy(Request $request)
    {
        $devoluciones = Devolucion::with('venta')
            ->where('user_id', $request->user()->id)
            ->whereDate('fecha', today())
            ->orderBy('fecha', 'desc')
            ->get();
        return response()->json($devoluciones);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'venta_id' => 'required|exists:ventas,id',
            'motivo'   => 'nullable|string|max:500',
        ]);

        $devolucion = null;

        DB::transaction(function () use ($validated, $request, &$devolucion) {
            $venta = Venta::with('detalles')->lockForUpdate()->findOrFail($validated['venta_id']);

            if ($venta->devuelta) {
                abort(422, 'Esta venta ya fue devuelta.');
            }

            // Restore stock for each item
            foreach ($venta->detalles as $detalle) {
                Producto::find($detalle->producto_id)?->increment('stock_quantity', $detalle->cantidad);
            }

            $venta->update(['devuelta' => true]);

            $devolucion = Devolucion::create([
                'venta_id' => $venta->id,
                'user_id'  => $request->user()->id,
                'motivo'   => $validated['motivo'] ?? null,
                'importe'  => $venta->total,
                'fecha'    => now(),
            ]);
        });

        return response()->json([
            'mensaje' => 'Devolución procesada correctamente.',
            'data'    => $devolucion->load('user'),
        ], 201);
    }
}
