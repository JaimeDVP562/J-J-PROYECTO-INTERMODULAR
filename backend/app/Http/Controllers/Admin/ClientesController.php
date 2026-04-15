<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;
use Illuminate\Http\Request;

class ClientesController extends Controller
{
    public function index()
    {
        $clientes = Cliente::latest()->paginate(20);
        return view('admin.clientes.index', compact('clientes'));
    }

    public function create()
    {
        return view('admin.clientes.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email'   => ['nullable', 'email', 'max:255', 'unique:clientes,email'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        Cliente::create($request->only('nombre', 'email', 'phone', 'address'));

        return redirect()->route('admin.clientes.index')
            ->with('success', 'Cliente creado correctamente.');
    }

    public function edit(int $id)
    {
        $cliente = Cliente::findOrFail($id);
        return view('admin.clientes.edit', compact('cliente'));
    }

    public function update(Request $request, int $id)
    {
        $cliente = Cliente::findOrFail($id);

        $request->validate([
            'nombre' => ['required', 'string', 'max:255'],
            'email'   => ['nullable', 'email', 'max:255', "unique:clientes,email,{$id}"],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $cliente->update($request->only('nombre', 'email', 'phone', 'address'));

        return redirect()->route('admin.clientes.index')
            ->with('success', 'Cliente actualizado correctamente.');
    }

    public function destroy(int $id)
    {
        Cliente::findOrFail($id)->delete();

        return redirect()->route('admin.clientes.index')
            ->with('success', 'Cliente eliminado correctamente.');
    }
}
