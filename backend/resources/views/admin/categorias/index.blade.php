@extends('layouts.admin')
@section('title', 'Categorías')
@section('page-title', 'Gestión de Categorías')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Categorías</h5>
        <small class="text-muted">{{ $categorias->total() }} registros</small>
    </div>
    <a href="{{ route('admin.categorias.create') }}" class="btn btn-primary btn-sm">
        <i class="bi bi-plus-lg me-1"></i> Nueva categoría
    </a>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th><th>Nombre</th><th>Productos</th><th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($categorias as $cat)
                <tr>
                    <td class="text-muted small">{{ $cat->id }}</td>
                    <td class="fw-semibold">{{ $cat->nombre }}</td>
                    <td><span class="badge bg-secondary">{{ $cat->productos_count }}</span></td>
                    <td class="text-end">
                        <a href="{{ route('admin.categorias.edit', $cat->id) }}" class="btn btn-sm btn-outline-secondary">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <form method="POST" action="{{ route('admin.categorias.destroy', $cat->id) }}" class="d-inline"
                              onsubmit="return confirm('¿Eliminar esta categoría?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="4" class="text-center text-muted py-4">Sin categorías.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card-footer bg-white border-0">{{ $categorias->links() }}</div>
</div>
@endsection
