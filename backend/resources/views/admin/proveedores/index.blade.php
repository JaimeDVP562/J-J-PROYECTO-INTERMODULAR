@extends('layouts.admin')
@section('title', 'Proveedores')
@section('page-title', 'Gestión de Proveedores')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Proveedores</h5>
        <small class="text-muted">{{ $proveedores->total() }} registros</small>
    </div>
    <a href="{{ route('admin.proveedores.create') }}" class="btn btn-primary btn-sm">
        <i class="bi bi-plus-lg me-1"></i> Nuevo proveedor
    </a>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th><th>Nombre</th><th>Email contacto</th><th>Teléfono</th><th>Dirección</th><th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($proveedores as $p)
                <tr>
                    <td class="text-muted small">{{ $p->id }}</td>
                    <td class="fw-semibold">{{ $p->nombre }}</td>
                    <td>{{ $p->contact_email ?? '—' }}</td>
                    <td>{{ $p->phone ?? '—' }}</td>
                    <td class="small text-muted">{{ Str::limit($p->address, 40) ?? '—' }}</td>
                    <td class="text-end">
                        <a href="{{ route('admin.proveedores.edit', $p->id) }}" class="btn btn-sm btn-outline-secondary">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <form method="POST" action="{{ route('admin.proveedores.destroy', $p->id) }}" class="d-inline"
                              onsubmit="return confirm('¿Eliminar este proveedor?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="6" class="text-center text-muted py-4">Sin proveedores.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card-footer bg-white border-0">{{ $proveedores->links() }}</div>
</div>
@endsection
