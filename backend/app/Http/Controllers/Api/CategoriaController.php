<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        $categorias = Categoria::all();
        return response()->json($categorias);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255|unique:categorias,nombre',
        ]);

        $categoria = Categoria::create($validated);

        return response()->json([
            'mensaje' => 'Categoría creada con éxito',
            'data' => $categoria,
        ], 201);
    }

    public function show($id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($categoria);
    }

    public function update(Request $request, $id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255|unique:categorias,nombre,' . $id,
        ]);

        $categoria->update($validated);

        return response()->json([
            'mensaje' => 'Categoría actualizada con éxito',
            'data' => $categoria,
        ]);
    }

    public function destroy($id)
    {
        $categoria = Categoria::find($id);
        if (!$categoria) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $categoria->delete();

        return response()->json(['mensaje' => 'Categoría eliminada con éxito']);
    }
}
