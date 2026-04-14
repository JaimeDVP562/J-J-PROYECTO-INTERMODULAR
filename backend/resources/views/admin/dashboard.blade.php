@extends('layouts.admin')

@section('title', 'Dashboard')
@section('page-title', 'Dashboard')

@section('content')
<div class="row g-3 mb-4">
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
            <div class="stat-icon bg-primary bg-opacity-10 text-primary">
                <i class="bi bi-people-fill"></i>
            </div>
            <div>
                <div class="stat-label">Usuarios</div>
                <div class="stat-value">{{ $totalUsuarios }}</div>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
            <div class="stat-icon bg-success bg-opacity-10 text-success">
                <i class="bi bi-box-seam-fill"></i>
            </div>
            <div>
                <div class="stat-label">Productos</div>
                <div class="stat-value">{{ $totalProductos }}</div>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
            <div class="stat-icon bg-warning bg-opacity-10 text-warning">
                <i class="bi bi-person-lines-fill"></i>
            </div>
            <div>
                <div class="stat-label">Clientes</div>
                <div class="stat-value">{{ $totalClientes }}</div>
            </div>
        </div>
    </div>
    <div class="col-sm-6 col-xl-3">
        <div class="stat-card">
            <div class="stat-icon bg-info bg-opacity-10 text-info">
                <i class="bi bi-person-badge-fill"></i>
            </div>
            <div>
                <div class="stat-label">Empleados</div>
                <div class="stat-value">{{ $totalEmpleados }}</div>
            </div>
        </div>
    </div>
</div>

<div class="row g-3">
    <!-- Últimas ventas -->
    <div class="col-lg-7">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 fw-semibold py-3">
                <i class="bi bi-cart-check me-2 text-primary"></i>Últimas ventas
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover mb-0 align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Método</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse ($ultimasVentas as $venta)
                            <tr>
                                <td class="text-muted small">{{ $venta->id }}</td>
                                <td>{{ \Carbon\Carbon::parse($venta->fecha_venta)->format('d/m/Y H:i') }}</td>
                                <td class="fw-semibold">{{ number_format($venta->total, 2) }} €</td>
                                <td>
                                    <span class="badge bg-secondary">{{ $venta->metodo_pago }}</span>
                                </td>
                                <td>
                                    @if($venta->devuelta)
                                        <span class="badge bg-danger">Devuelta</span>
                                    @else
                                        <span class="badge bg-success">OK</span>
                                    @endif
                                </td>
                            </tr>
                            @empty
                            <tr><td colspan="5" class="text-center text-muted py-3">Sin ventas registradas</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Accesos rápidos -->
    <div class="col-lg-5">
        <div class="card border-0 shadow-sm h-100">
            <div class="card-header bg-white border-0 fw-semibold py-3">
                <i class="bi bi-lightning-charge me-2 text-warning"></i>Accesos rápidos
            </div>
            <div class="card-body d-flex flex-column gap-2">
                <a href="{{ route('admin.usuarios.create') }}" class="btn btn-outline-primary text-start">
                    <i class="bi bi-person-plus me-2"></i>Añadir usuario
                </a>
                <a href="{{ route('admin.productos.create') }}" class="btn btn-outline-success text-start">
                    <i class="bi bi-plus-circle me-2"></i>Nuevo producto
                </a>
                <a href="{{ route('admin.empleados.create') }}" class="btn btn-outline-info text-start">
                    <i class="bi bi-person-badge me-2"></i>Nuevo empleado
                </a>
                <a href="{{ route('admin.clientes.index') }}" class="btn btn-outline-warning text-start">
                    <i class="bi bi-person-lines-fill me-2"></i>Ver clientes
                </a>
            </div>
        </div>
    </div>
</div>
@endsection
