<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetalleVenta;
use App\Http\Resources\DetalleVentaResource;
use Illuminate\Http\Request;

class DetalleVentaController extends Controller
{
    public function index()
    {
        $detalles = DetalleVenta::with('venta', 'producto')->get();
        return DetalleVentaResource::collection($detalles);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'venta_id' => 'required|exists:ventas,id',
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric',
            'subtotal' => 'required|numeric',
        ]);

        $detalle = DetalleVenta::create($validated);

        return response()->json([
            'mensaje' => 'Detalle de venta creado con éxito',
            'data' => new DetalleVentaResource($detalle)
        ], 201);
    }

    public function show($id)
    {
        $detalle = DetalleVenta::with('venta', 'producto')->find($id);
        if (!$detalle) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new DetalleVentaResource($detalle);
    }

    public function update(Request $request, $id)
    {
        $detalle = DetalleVenta::find($id);
        if (!$detalle) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'venta_id' => 'required|exists:ventas,id',
            'producto_id' => 'required|exists:productos,id',
            'cantidad' => 'required|integer|min:1',
            'precio_unitario' => 'required|numeric',
            'subtotal' => 'required|numeric',
        ]);

        $detalle->update($validated);

        return response()->json([
            'mensaje' => 'Detalle de venta actualizado con éxito',
            'data' => new DetalleVentaResource($detalle)
        ]);
    }

    public function destroy($id)
    {
        $detalle = DetalleVenta::find($id);
        if (!$detalle) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $detalle->delete();

        return response()->json(['mensaje' => 'Detalle de venta eliminado con éxito']);
    }
}
