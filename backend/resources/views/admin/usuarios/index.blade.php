@extends('layouts.admin')

@section('title', 'Usuarios')
@section('page-title', 'Gestión de Usuarios')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Usuarios del sistema</h5>
        <small class="text-muted">{{ $usuarios->total() }} registros</small>
    </div>
    <a href="{{ route('admin.usuarios.create') }}" class="btn btn-primary">
        <i class="bi bi-person-plus me-1"></i> Nuevo usuario
    </a>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Alta</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($usuarios as $usuario)
                    <tr>
                        <td class="text-muted small">{{ $usuario->id }}</td>
                        <td class="fw-semibold">{{ $usuario->nombre ?? $usuario->name }}</td>
                        <td>{{ $usuario->email }}</td>
                        <td>
                            <span class="badge
                                @if($usuario->rol === 'admin') bg-danger
                                @elseif($usuario->rol === 'gerente') bg-warning text-dark
                                @else bg-secondary @endif">
                                {{ ucfirst($usuario->rol) }}
                            </span>
                        </td>
                        <td class="small text-muted">{{ $usuario->created_at?->format('d/m/Y') }}</td>
                        <td class="text-end">
                            <a href="{{ route('admin.usuarios.edit', $usuario->id) }}"
                               class="btn btn-sm btn-outline-primary me-1">
                                <i class="bi bi-pencil"></i>
                            </a>
                            <form method="POST"
                                  action="{{ route('admin.usuarios.destroy', $usuario->id) }}"
                                  class="d-inline"
                                  onsubmit="return confirm('¿Eliminar este usuario?')">
                                @csrf @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-outline-danger">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </form>
                        </td>
                    </tr>
                    @empty
                    <tr><td colspan="6" class="text-center text-muted py-4">No hay usuarios registrados.</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>
    <div class="card-footer bg-white border-0">
        {{ $usuarios->links() }}
    </div>
</div>
@endsection
