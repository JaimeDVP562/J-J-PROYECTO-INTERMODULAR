<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetalleFactura;
use App\Http\Resources\DetalleFacturaResource;
use Illuminate\Http\Request;

class DetalleFacturaController extends Controller
{
    public function index()
    {
        $detalles = DetalleFactura::with('factura', 'producto')->get();
        return DetalleFacturaResource::collection($detalles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'factura_id' => 'required|exists:facturas,id',
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric',
            'subtotal' => 'required|numeric',
        ]);

        $detalle = DetalleFactura::create($validated);

        return response()->json([
            'mensaje' => 'Detalle de factura creado con éxito',
            'data' => new DetalleFacturaResource($detalle)
        ], 201);
    }

    public function show($id)
    {
        $detalle = DetalleFactura::with('factura', 'producto')->find($id);
        if (!$detalle) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new DetalleFacturaResource($detalle);
    }

    public function update(Request $request, $id)
    {
        $detalle = DetalleFactura::find($id);
        if (!$detalle) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'factura_id' => 'required|exists:facturas,id',
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric',
            'subtotal' => 'required|numeric',
        ]);

        $detalle->update($validated);

        return response()->json([
            'mensaje' => 'Detalle de factura actualizado con éxito',
            'data' => new DetalleFacturaResource($detalle)
        ]);
    }

    public function destroy($id)
    {
        $detalle = DetalleFactura::find($id);
        if (!$detalle) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $detalle->delete();

        return response()->json(['mensaje' => 'Detalle de factura eliminado con éxito']);
    }
}
