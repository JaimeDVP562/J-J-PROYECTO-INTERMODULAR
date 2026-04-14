@extends('layouts.admin')

@section('title', 'Productos')
@section('page-title', 'Gestión de Productos')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Catálogo de productos</h5>
        <small class="text-muted">{{ $productos->total() }} productos</small>
    </div>
    <a href="{{ route('admin.productos.create') }}" class="btn btn-success">
        <i class="bi bi-plus-circle me-1"></i> Nuevo producto
    </a>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>SKU</th>
                        <th>Nombre</th>
                        <th>Categoría</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($productos as $producto)
                    <tr>
                        <td class="text-muted small">{{ $producto->id }}</td>
                        <td><code>{{ $producto->sku ?? '—' }}</code></td>
                        <td class="fw-semibold">{{ $producto->nombre }}</td>
                        <td><span class="badge bg-light text-dark border">{{ $producto->categoria->nombre ?? '—' }}</span></td>
                        <td>{{ number_format($producto->precio, 2) }} €</td>
                        <td>
                            <span class="badge {{ $producto->stock_quantity <= 5 ? 'bg-danger' : ($producto->stock_quantity <= 20 ? 'bg-warning text-dark' : 'bg-success') }}">
                                {{ $producto->stock_quantity }}
                            </span>
                        </td>
                        <td class="text-end">
                            <a href="{{ route('admin.productos.edit', $producto->id) }}"
                               class="btn btn-sm btn-outline-primary me-1">
                                <i class="bi bi-pencil"></i>
                            </a>
                            <form method="POST"
                                  action="{{ route('admin.productos.destroy', $producto->id) }}"
                                  class="d-inline"
                                  onsubmit="return confirm('¿Eliminar este producto?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-outline-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="7" class="text-center text-muted py-4">No hay productos.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    <div class="card-footer bg-white border-0">{{ $productos->links() }}</div>
</div>
@endsection
