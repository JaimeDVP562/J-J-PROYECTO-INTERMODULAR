<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use App\Models\Producto;
use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProductosController extends Controller
{
    public function index()
    {
        $productos = Producto::with(['categoria', 'proveedor'])->latest()->paginate(20);
        return view('admin.productos.index', compact('productos'));
    }

    public function create()
    {
        $categorias = Categoria::orderBy('nombre')->get();
        $proveedores = Proveedor::orderBy('nombre')->get();
        return view('admin.productos.create', compact('categorias', 'proveedores'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'         => ['required', 'string', 'max:255'],
            'sku'            => ['nullable', 'string', 'max:100', 'unique:productos,sku'],
            'descripcion'    => ['nullable', 'string'],
            'precio'         => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['integer', 'min:0'],
            'categoria_id'   => ['nullable', 'exists:categorias,id'],
            'proveedor_id'   => ['nullable', 'exists:proveedores,id'],
        ]);

        Producto::create($data);

        return redirect()->route('admin.productos.index')
            ->with('success', 'Producto creado correctamente.');
    }

    public function edit(int $id)
    {
        $producto    = Producto::findOrFail($id);
        $categorias  = Categoria::orderBy('nombre')->get();
        $proveedores = Proveedor::orderBy('nombre')->get();
        return view('admin.productos.edit', compact('producto', 'categorias', 'proveedores'));
    }

    public function update(Request $request, int $id)
    {
        $producto = Producto::findOrFail($id);

        $data = $request->validate([
            'nombre'         => ['required', 'string', 'max:255'],
            'sku'            => ['nullable', 'string', 'max:100', "unique:productos,sku,{$id}"],
            'descripcion'    => ['nullable', 'string'],
            'precio'         => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['integer', 'min:0'],
            'categoria_id'   => ['nullable', 'exists:categorias,id'],
            'proveedor_id'   => ['nullable', 'exists:proveedores,id'],
        ]);

        $producto->update($data);

        return redirect()->route('admin.productos.index')
            ->with('success', 'Producto actualizado correctamente.');
    }

    public function destroy(int $id)
    {
        Producto::findOrFail($id)->delete();

        return redirect()->route('admin.productos.index')
            ->with('success', 'Producto eliminado.');
    }
}
