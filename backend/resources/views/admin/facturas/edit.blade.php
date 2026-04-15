@extends('layouts.admin')
@section('title', 'Editar factura')
@section('page-title', 'Editar factura')

@section('content')
<div class="row justify-content-center">
<div class="col-lg-8">
<div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 fw-semibold py-3">
        <i class="bi bi-receipt me-2 text-secondary"></i>
        Factura {{ $factura->series }}-{{ $factura->number }}
        &nbsp;<span class="text-muted fw-normal small">#{{ $factura->id }}</span>
    </div>
    <div class="card-body">
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0 ps-3">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul>
            </div>
        @endif

        {{-- Líneas de detalle (solo lectura) --}}
        @if($factura->detalles->count())
        <h6 class="fw-semibold mb-2 text-muted">Líneas de factura</h6>
        <div class="table-responsive mb-4">
            <table class="table table-sm table-bordered mb-0">
                <thead class="table-light">
                    <tr><th>Descripción</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                    @foreach($factura->detalles as $d)
                    <tr>
                        <td>{{ $d->descripcion ?? '—' }}</td>
                        <td>{{ $d->cantidad }}</td>
                        <td>{{ number_format($d->precio_unitario, 2) }} €</td>
                        <td>{{ number_format($d->cantidad * $d->precio_unitario, 2) }} €</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @endif

        <form method="POST" action="{{ route('admin.facturas.update', $factura->id) }}">
            @csrf @method('PUT')
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Cliente</label>
                    <select name="cliente_id" class="form-select">
                        <option value="">— Sin cliente —</option>
                        @foreach($clientes as $c)
                            <option value="{{ $c->id }}" {{ old('cliente_id', $factura->cliente_id) == $c->id ? 'selected' : '' }}>
                                {{ $c->nombre }}
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Estado *</label>
                    <select name="status" class="form-select" required>
                        <option value="pending"   {{ old('status', $factura->status) === 'pending'   ? 'selected' : '' }}>Pendiente</option>
                        <option value="paid"      {{ old('status', $factura->status) === 'paid'      ? 'selected' : '' }}>Pagada</option>
                        <option value="cancelled" {{ old('status', $factura->status) === 'cancelled' ? 'selected' : '' }}>Cancelada</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-semibold">Fecha emisión</label>
                    <input type="date" name="invoice_date" class="form-control"
                           value="{{ old('invoice_date', $factura->invoice_date ? \Carbon\Carbon::parse($factura->invoice_date)->format('Y-m-d') : '') }}">
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-semibold">Vencimiento</label>
                    <input type="date" name="due_date" class="form-control"
                           value="{{ old('due_date', $factura->due_date ? \Carbon\Carbon::parse($factura->due_date)->format('Y-m-d') : '') }}">
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-semibold">Método de pago</label>
                    <input type="text" name="payment_method" class="form-control"
                           value="{{ old('payment_method', $factura->payment_method) }}">
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg me-1"></i> Actualizar</button>
                <a href="{{ route('admin.facturas.index') }}" class="btn btn-outline-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
</div>
</div>
@endsection
