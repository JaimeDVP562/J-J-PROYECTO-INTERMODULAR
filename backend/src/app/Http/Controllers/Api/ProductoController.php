<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $productos = \App\Models\Producto::all();
        return \App\Http\Resources\ProductoResource::collection($productos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
            // Agrega aquí otras validaciones según tu modelo
        ]);

        $producto = \App\Models\Producto::create($validated);

        return response()->json([
            'mensaje' => 'Producto creado con éxito',
            'data' => new \App\Http\Resources\ProductoResource($producto)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $producto = \App\Models\Producto::find($id);
        if (!$producto) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new \App\Http\Resources\ProductoResource($producto);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $producto = \App\Models\Producto::find($id);
        if (!$producto) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        $validated = $request->validate([
            'nombre' => 'string|max:255',
            'precio' => 'numeric',
            'stock' => 'integer',
            // Agrega aquí otras validaciones según tu modelo
        ]);
        $producto->update($validated);
        return response()->json([
            'mensaje' => 'Actualizado correctamente',
            'data' => new \App\Http\Resources\ProductoResource($producto)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $producto = \App\Models\Producto::find($id);
        if (!$producto) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        $producto->delete();
        return response()->json(['mensaje' => 'Eliminado correctamente'], 200);
    }
}
