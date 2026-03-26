<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use App\Http\Resources\ClienteResource;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::all();
        return ClienteResource::collection($clientes);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|unique:clientes,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $cliente = Cliente::create($validated);

        return response()->json([
            'mensaje' => 'Cliente creado con éxito',
            'data' => new ClienteResource($cliente)
        ], 201);
    }

    public function show($id)
    {
        $cliente = Cliente::find($id);
        if (!$cliente) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new ClienteResource($cliente);
    }

    public function update(Request $request, $id)
    {
        $cliente = Cliente::find($id);
        if (!$cliente) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:clientes,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
        ]);

        $cliente->update($validated);

        return response()->json([
            'mensaje' => 'Cliente actualizado con éxito',
            'data' => new ClienteResource($cliente)
        ]);
    }

    public function destroy($id)
    {
        $cliente = Cliente::find($id);
        if (!$cliente) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $cliente->delete();

        return response()->json(['mensaje' => 'Cliente eliminado con éxito']);
    }
}
