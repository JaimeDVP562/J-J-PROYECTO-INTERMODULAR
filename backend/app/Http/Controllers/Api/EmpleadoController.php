<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EmpleadoResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

/**
 * La tabla `empleados` fue eliminada y sus campos se fusionaron en `users`.
 * Este controlador mantiene el endpoint /api/empleados apuntando a User
 * para no romper integraciones externas.
 */
class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = User::whereIn('rol', ['gerente', 'vendedor'])->get();
        return EmpleadoResource::collection($empleados);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre'             => 'required|string|max:255',
            'apellido'           => 'nullable|string|max:255',
            'email'              => 'required|email|unique:users,email',
            'telefono'           => 'nullable|string|max:20',
            'fecha_contratacion' => 'nullable|date',
            'salario'            => 'nullable|numeric',
            'puesto'             => 'nullable|string|max:255',
            'password'           => ['required', Password::min(8)],
            'rol'                => 'in:gerente,vendedor',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'rol'      => $validated['rol'] ?? 'vendedor',
        ]);

        return response()->json([
            'mensaje' => 'Empleado creado con éxito',
            'data'    => new EmpleadoResource($user),
        ], 201);
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new EmpleadoResource($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre'             => 'sometimes|required|string|max:255',
            'apellido'           => 'nullable|string|max:255',
            'email'              => "sometimes|required|email|unique:users,email,{$id}",
            'telefono'           => 'nullable|string|max:20',
            'fecha_contratacion' => 'nullable|date',
            'salario'            => 'nullable|numeric',
            'puesto'             => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'mensaje' => 'Empleado actualizado con éxito',
            'data'    => new EmpleadoResource($user),
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $user->delete();

        return response()->json(['mensaje' => 'Empleado eliminado con éxito']);
    }
}
