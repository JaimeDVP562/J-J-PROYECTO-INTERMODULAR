<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UsuariosController extends Controller
{
    public function index()
    {
        $usuarios = User::latest()->paginate(15);
        return view('admin.usuarios.index', compact('usuarios'));
    }

    public function create()
    {
        return view('admin.usuarios.create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'   => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'rol'      => ['required', 'in:admin,gerente,vendedor'],
        ]);

        User::create([
            'nombre'   => $data['nombre'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'rol'      => $data['rol'],
        ]);

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(int $id)
    {
        $usuario = User::findOrFail($id);
        return view('admin.usuarios.edit', compact('usuario'));
    }

    public function update(Request $request, int $id)
    {
        $usuario = User::findOrFail($id);

        $data = $request->validate([
            'nombre'   => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', "unique:users,email,{$id}"],
            'password' => ['nullable', 'confirmed', Password::min(8)],
            'rol'      => ['required', 'in:admin,gerente,vendedor'],
        ]);

        $usuario->nombre = $data['nombre'];
        $usuario->email  = $data['email'];
        $usuario->rol    = $data['rol'];

        if (!empty($data['password'])) {
            $usuario->password = Hash::make($data['password']);
        }

        $usuario->save();

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(int $id)
    {
        $usuario = User::findOrFail($id);

        if ($usuario->id === auth()->id()) {
            return back()->with('error', 'No puedes eliminar tu propio usuario.');
        }

        $usuario->delete();

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario eliminado.');
    }
}
