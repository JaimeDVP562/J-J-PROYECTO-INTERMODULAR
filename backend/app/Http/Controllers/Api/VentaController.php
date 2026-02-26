<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Http\Resources\VentaResource;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    public function index()
    {
        $ventas = Venta::with('user', 'detalles')->get();
        return VentaResource::collection($ventas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total' => 'required|numeric',
            'fecha_venta' => 'required|date',
            'metodo_pago' => 'required|string|max:255',
        ]);

        $venta = Venta::create($validated);

        return response()->json([
            'mensaje' => 'Venta creada con éxito',
            'data' => new VentaResource($venta)
        ], 201);
    }

    public function show($id)
    {
        $venta = Venta::with('user', 'detalles')->find($id);
        if (!$venta) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new VentaResource($venta);
    }

    public function update(Request $request, $id)
    {
        $venta = Venta::find($id);
        if (!$venta) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'total' => 'required|numeric',
            'fecha_venta' => 'required|date',
            'metodo_pago' => 'required|string|max:255',
        ]);

        $venta->update($validated);

        return response()->json([
            'mensaje' => 'Venta actualizada con éxito',
            'data' => new VentaResource($venta)
        ]);
    }

    public function destroy($id)
    {
        $venta = Venta::find($id);
        if (!$venta) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $venta->delete();

        return response()->json(['mensaje' => 'Venta eliminada con éxito']);
    }
}
