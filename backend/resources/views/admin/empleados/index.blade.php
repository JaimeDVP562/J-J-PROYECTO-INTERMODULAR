@extends('layouts.admin')

@section('title', 'Empleados')
@section('page-title', 'Gestión de Empleados')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Empleados</h5>
        <small class="text-muted">{{ $empleados->total() }} registros</small>
    </div>
    <a href="{{ route('admin.empleados.create') }}" class="btn btn-info text-white">
        <i class="bi bi-person-badge me-1"></i> Nuevo empleado
    </a>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th><th>Nombre</th><th>Email</th>
                    <th>Puesto</th><th>Salario</th><th>Contratación</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($empleados as $emp)
                <tr>
                    <td class="text-muted small">{{ $emp->id }}</td>
                    <td class="fw-semibold">{{ $emp->nombre }} {{ $emp->apellido }}</td>
                    <td>{{ $emp->email }}</td>
                    <td><span class="badge bg-light text-dark border">{{ $emp->puesto }}</span></td>
                    <td>{{ number_format($emp->salario ?? 0, 2) }} €</td>
                    <td class="small text-muted">{{ \Carbon\Carbon::parse($emp->fecha_contratacion)->format('d/m/Y') }}</td>
                    <td class="text-end">
                        <a href="{{ route('admin.empleados.edit', $emp->id) }}" class="btn btn-sm btn-outline-primary me-1">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <form method="POST" action="{{ route('admin.empleados.destroy', $emp->id) }}"
                              class="d-inline" onsubmit="return confirm('¿Eliminar?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="7" class="text-center text-muted py-4">Sin empleados.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card-footer bg-white border-0">{{ $empleados->links() }}</div>
</div>
@endsection
