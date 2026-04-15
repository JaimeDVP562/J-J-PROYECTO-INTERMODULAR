@extends('layouts.admin')
@section('title', 'Facturas')
@section('page-title', 'Gestión de Facturas')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Facturas</h5>
        <small class="text-muted">{{ $facturas->total() }} registros</small>
    </div>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Serie / Nº</th>
                    <th>Cliente</th>
                    <th>Fecha emisión</th>
                    <th>Vencimiento</th>
                    <th>Importe</th>
                    <th>Estado</th>
                    <th>Método pago</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($facturas as $f)
                <tr>
                    <td class="text-muted small">{{ $f->id }}</td>
                    <td class="fw-semibold">{{ $f->series }}-{{ $f->number }}</td>
                    <td>{{ $f->cliente?->nombre ?? '—' }}</td>
                    <td>{{ $f->invoice_date ? \Carbon\Carbon::parse($f->invoice_date)->format('d/m/Y') : '—' }}</td>
                    <td>{{ $f->due_date ? \Carbon\Carbon::parse($f->due_date)->format('d/m/Y') : '—' }}</td>
                    <td class="fw-semibold">{{ number_format($f->total_amount, 2) }} €</td>
                    <td>
                        @php
                            $badge = match($f->status) {
                                'paid'      => 'success',
                                'cancelled' => 'danger',
                                default     => 'warning',
                            };
                            $label = match($f->status) {
                                'paid'      => 'Pagada',
                                'cancelled' => 'Cancelada',
                                default     => 'Pendiente',
                            };
                        @endphp
                        <span class="badge bg-{{ $badge }}">{{ $label }}</span>
                    </td>
                    <td>{{ $f->payment_method ?? '—' }}</td>
                    <td class="text-end">
                        <a href="{{ route('admin.facturas.edit', $f->id) }}" class="btn btn-sm btn-outline-secondary">
                            <i class="bi bi-pencil"></i>
                        </a>
                        <form method="POST" action="{{ route('admin.facturas.destroy', $f->id) }}" class="d-inline"
                              onsubmit="return confirm('¿Eliminar esta factura?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="9" class="text-center text-muted py-4">Sin facturas.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card-footer bg-white border-0">{{ $facturas->links() }}</div>
</div>
@endsection
