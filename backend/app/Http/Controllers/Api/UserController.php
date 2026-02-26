<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    private function soloAdmin(Request $request)
    {
        if ($request->user()->rol !== 'admin') {
            abort(response()->json(['error' => 'No autorizado'], 403));
        }
    }

    public function index(Request $request)
    {
        $this->soloAdmin($request);

        $usuarios = User::where('rol', '!=', 'admin')
            ->select('id', 'nombre', 'email', 'rol', 'created_at')
            ->orderBy('nombre')
            ->get();

        return response()->json($usuarios);
    }

    public function store(Request $request)
    {
        $this->soloAdmin($request);

        $validated = $request->validate([
            'nombre'   => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'rol'      => 'required|in:gerente,vendedor',
        ]);

        $usuario = User::create([
            'nombre'   => $validated['nombre'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'rol'      => $validated['rol'],
        ]);

        return response()->json([
            'mensaje' => 'Usuario creado',
            'data'    => $usuario->only('id', 'nombre', 'email', 'rol', 'created_at'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $this->soloAdmin($request);

        $usuario = User::where('id', $id)->where('rol', '!=', 'admin')->first();
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre'   => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'rol'      => 'sometimes|in:gerente,vendedor',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $usuario->update($validated);

        return response()->json([
            'mensaje' => 'Usuario actualizado',
            'data'    => $usuario->only('id', 'nombre', 'email', 'rol', 'created_at'),
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $this->soloAdmin($request);

        $usuario = User::where('id', $id)->where('rol', '!=', 'admin')->first();
        if (!$usuario) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        $usuario->delete();

        return response()->json(['mensaje' => 'Usuario eliminado']);
    }
}
