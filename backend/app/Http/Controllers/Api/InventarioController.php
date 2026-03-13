<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventario;
use App\Http\Resources\InventarioResource;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function index()
    {
        $inventarios = Inventario::with('producto')->get();
        return InventarioResource::collection($inventarios);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad_disponible' => 'required|integer|min:0',
            'cantidad_minima' => 'required|integer|min:0',
            'ubicacion' => 'nullable|string|max:255',
        ]);

        $inventario = Inventario::create($validated);

        return response()->json([
            'mensaje' => 'Inventario creado con éxito',
            'data' => new InventarioResource($inventario)
        ], 201);
    }

    public function show($id)
    {
        $inventario = Inventario::with('producto')->find($id);
        if (!$inventario) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new InventarioResource($inventario);
    }

    public function update(Request $request, $id)
    {
        $inventario = Inventario::find($id);
        if (!$inventario) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad_disponible' => 'required|integer|min:0',
            'cantidad_minima' => 'required|integer|min:0',
            'ubicacion' => 'nullable|string|max:255',
        ]);

        $inventario->update($validated);

        return response()->json([
            'mensaje' => 'Inventario actualizado con éxito',
            'data' => new InventarioResource($inventario)
        ]);
    }

    public function destroy($id)
    {
        $inventario = Inventario::find($id);
        if (!$inventario) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $inventario->delete();

        return response()->json(['mensaje' => 'Inventario eliminado con éxito']);
    }
}
