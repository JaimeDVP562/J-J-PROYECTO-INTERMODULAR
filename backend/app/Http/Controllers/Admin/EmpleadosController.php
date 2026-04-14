<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadosController extends Controller
{
    public function index()
    {
        $empleados = Empleado::latest()->paginate(15);
        return view('admin.empleados.index', compact('empleados'));
    }

    public function create()
    {
        return view('admin.empleados.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'             => ['required', 'string', 'max:255'],
            'apellido'           => ['required', 'string', 'max:255'],
            'email'              => ['required', 'email', 'unique:empleados,email'],
            'telefono'           => ['nullable', 'string', 'max:20'],
            'puesto'             => ['required', 'string', 'max:100'],
            'salario'            => ['nullable', 'numeric', 'min:0'],
            'fecha_contratacion' => ['required', 'date'],
        ]);

        Empleado::create($data);

        return redirect()->route('admin.empleados.index')
            ->with('success', 'Empleado creado correctamente.');
    }

    public function edit(int $id)
    {
        $empleado = Empleado::findOrFail($id);
        return view('admin.empleados.edit', compact('empleado'));
    }

    public function update(Request $request, int $id)
    {
        $empleado = Empleado::findOrFail($id);

        $data = $request->validate([
            'nombre'             => ['required', 'string', 'max:255'],
            'apellido'           => ['required', 'string', 'max:255'],
            'email'              => ['required', 'email', "unique:empleados,email,{$id}"],
            'telefono'           => ['nullable', 'string', 'max:20'],
            'puesto'             => ['required', 'string', 'max:100'],
            'salario'            => ['nullable', 'numeric', 'min:0'],
            'fecha_contratacion' => ['required', 'date'],
        ]);

        $empleado->update($data);

        return redirect()->route('admin.empleados.index')
            ->with('success', 'Empleado actualizado correctamente.');
    }

    public function destroy(int $id)
    {
        Empleado::findOrFail($id)->delete();
        return redirect()->route('admin.empleados.index')->with('success', 'Empleado eliminado.');
    }
}
