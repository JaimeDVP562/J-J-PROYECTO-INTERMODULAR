<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use App\Http\Resources\EmpleadoResource;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::all();
        return EmpleadoResource::collection($empleados);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:empleados,email',
            'telefono' => 'nullable|string|max:20',
            'fecha_contratacion' => 'required|date',
            'salario' => 'nullable|numeric',
            'puesto' => 'required|string|max:255',
        ]);

        $empleado = Empleado::create($validated);

        return response()->json([
            'mensaje' => 'Empleado creado con éxito',
            'data' => new EmpleadoResource($empleado)
        ], 201);
    }

    public function show($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new EmpleadoResource($empleado);
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:empleados,email,' . $id,
            'telefono' => 'nullable|string|max:20',
            'fecha_contratacion' => 'required|date',
            'salario' => 'nullable|numeric',
            'puesto' => 'required|string|max:255',
        ]);

        $empleado->update($validated);

        return response()->json([
            'mensaje' => 'Empleado actualizado con éxito',
            'data' => new EmpleadoResource($empleado)
        ]);
    }

    public function destroy($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $empleado->delete();

        return response()->json(['mensaje' => 'Empleado eliminado con éxito']);
    }
}
