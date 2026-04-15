@extends('layouts.admin')
@section('title', 'Detalle venta')
@section('page-title', 'Detalle de venta')

@section('content')
<div class="row justify-content-center">
<div class="col-lg-8">

<div class="card border-0 shadow-sm mb-3">
    <div class="card-header bg-white border-0 fw-semibold py-3">
        <i class="bi bi-cart-check me-2 text-success"></i>
        Venta #{{ $venta->id }}
        @if($venta->devuelta)
            <span class="badge bg-danger ms-2">Devuelta</span>
        @else
            <span class="badge bg-success ms-2">OK</span>
        @endif
    </div>
    <div class="card-body">
        <div class="row g-3 mb-3">
            <div class="col-sm-6">
                <div class="text-muted small">Fecha</div>
                <div class="fw-semibold">{{ \Carbon\Carbon::parse($venta->fecha_venta)->format('d/m/Y H:i') }}</div>
            </div>
            <div class="col-sm-6">
                <div class="text-muted small">Vendedor</div>
                <div class="fw-semibold">{{ $venta->user?->nombre ?? '—' }}</div>
            </div>
            <div class="col-sm-6">
                <div class="text-muted small">Cliente</div>
                <div class="fw-semibold">{{ $venta->cliente?->nombre ?? '—' }}</div>
            </div>
            <div class="col-sm-6">
                <div class="text-muted small">Método de pago</div>
                <div class="fw-semibold">{{ $venta->metodo_pago ?? '—' }}</div>
            </div>
            @if($venta->notas)
            <div class="col-12">
                <div class="text-muted small">Notas</div>
                <div>{{ $venta->notas }}</div>
            </div>
            @endif
        </div>

        @if($venta->detalles->count())
        <h6 class="fw-semibold text-muted mb-2">Líneas de venta</h6>
        <div class="table-responsive">
            <table class="table table-sm table-bordered mb-0">
                <thead class="table-light">
                    <tr><th>Producto</th><th>Cant.</th><th>Precio unit.</th><th>Subtotal</th></tr>
                </thead>
                <tbody>
                    @foreach($venta->detalles as $d)
                    <tr>
                        <td>{{ $d->producto?->nombre ?? '#'.$d->producto_id }}</td>
                        <td>{{ $d->cantidad }}</td>
                        <td>{{ number_format($d->precio_unitario, 2) }} €</td>
                        <td>{{ number_format($d->subtotal, 2) }} €</td>
                    </tr>
                    @endforeach
                </tbody>
                <tfoot class="table-light">
                    <tr>
                        <td colspan="3" class="text-end fw-bold">Total</td>
                        <td class="fw-bold">{{ number_format($venta->total, 2) }} €</td>
                    </tr>
                </tfoot>
            </table>
        </div>
        @else
            <p class="text-muted small">Sin líneas de detalle.</p>
        @endif
    </div>
    <div class="card-footer bg-white border-0">
        <a href="{{ route('admin.ventas.index') }}" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-arrow-left me-1"></i> Volver
        </a>
    </div>
</div>

</div>
</div>
@endsection
