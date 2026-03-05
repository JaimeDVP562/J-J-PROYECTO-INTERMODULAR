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
        $productos = \App\Models\Producto::with('categoria', 'proveedor')->get();
        return \App\Http\Resources\ProductoResource::collection($productos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'         => 'required|string|max:255',
            'sku'            => 'nullable|string|max:100|unique:productos,sku',
            'descripcion' => 'nullable|string',
            'precio' => 'required|numeric',
            'stock_quantity' => 'required|integer|min:0',
            'categoria_id' => 'nullable|exists:categorias,id',
            'proveedor_id' => 'required|exists:proveedores,id',
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
        $producto = \App\Models\Producto::with('categoria', 'proveedor')->find($id);
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
            'nombre'         => 'sometimes|string|max:255',
            'sku'            => 'nullable|string|max:100|unique:productos,sku,'. $id,
            'descripcion' => 'nullable|string',
            'precio' => 'sometimes|numeric',
            'stock_quantity' => 'sometimes|integer|min:0',
            'categoria_id' => 'nullable|exists:categorias,id',
            'proveedor_id' => 'sometimes|exists:proveedores,id',
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
