<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use App\Http\Resources\ProveedorResource;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    // GET /api/proveedors
    public function index()
    {
        $proveedors = Proveedor::all();
        return ProveedorResource::collection($proveedors);
    }

    // POST /api/proveedors
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            // Agrega aquí otras validaciones según tu modelo
        ]);

        $proveedor = Proveedor::create($validated);

        return response()->json([
            'mensaje' => 'Proveedor creado con éxito',
            'data' => new ProveedorResource($proveedor)
        ], 201);
    }

    // GET /api/proveedors/{id}
    public function show($id)
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new ProveedorResource($proveedor);
    }

    // PUT /api/proveedors/{id}
    public function update(Request $request, $id)
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        $validated = $request->validate([
            'nombre' => 'string|max:255',
            // Agrega aquí otras validaciones según tu modelo
        ]);
        $proveedor->update($validated);
        return response()->json([
            'mensaje' => 'Actualizado correctamente',
            'data' => new ProveedorResource($proveedor)
        ], 200);
    }

    // DELETE /api/proveedors/{id}
    public function destroy($id)
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        $proveedor->delete();
        return response()->json(['mensaje' => 'Eliminado correctamente'], 200);
    }
}
