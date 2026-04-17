@extends('layouts.admin')
@section('title', 'Ventas')
@section('page-title', 'Gestión de Ventas')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Ventas</h5>
        <small class="text-muted">{{ $ventas->total() }} registros</small>
    </div>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Vendedor</th>
                    <th>Cliente</th>
                    <th>Total</th>
                    <th>Método pago</th>
                    <th>Estado</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($ventas as $v)
                <tr>
                    <td class="text-muted small">{{ $v->id }}</td>
                    <td>{{ \Carbon\Carbon::parse($v->fecha_venta)->format('d/m/Y H:i') }}</td>
                    <td>{{ $v->user?->nombre ?? '—' }}</td>
                    <td>{{ $v->cliente?->nombre ?? '—' }}</td>
                    <td class="fw-semibold">{{ number_format($v->total, 2) }} €</td>
                    <td><span class="badge bg-secondary">{{ $v->metodo_pago ?? '—' }}</span></td>
                    <td>
                        @if($v->devuelta)
                            <span class="badge bg-danger">Devuelta</span>
                        @else
                            <span class="badge bg-success">OK</span>
                        @endif
                    </td>
                    <td class="text-end">
                        <a href="{{ route('admin.ventas.show', $v->id) }}" class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-eye"></i>
                        </a>
                        <form method="POST" action="{{ route('admin.ventas.destroy', $v->id) }}" class="d-inline"
                              onsubmit="return confirm('¿Eliminar esta venta?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="8" class="text-center text-muted py-4">Sin ventas.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card-footer bg-white border-0">{{ $ventas->links() }}</div>
</div>
@endsection
