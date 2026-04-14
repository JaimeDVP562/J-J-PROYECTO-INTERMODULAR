@extends('layouts.admin')
@section('title', 'Clientes')
@section('page-title', 'Gestión de Clientes')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Clientes</h5>
        <small class="text-muted">{{ $clientes->total() }} registros</small>
    </div>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($clientes as $c)
                <tr>
                    <td class="text-muted small">{{ $c->id }}</td>
                    <td class="fw-semibold">{{ $c->nombre }}</td>
                    <td>{{ $c->email }}</td>
                    <td>{{ $c->phone ?? '—' }}</td>
                    <td class="small text-muted">{{ Str::limit($c->address, 40) ?? '—' }}</td>
                </tr>
                @empty
                <tr><td colspan="5" class="text-center text-muted py-4">Sin clientes.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card-footer bg-white border-0">{{ $clientes->links() }}</div>
</div>
@endsection
