@extends('layouts.admin')
@section('title', 'Nuevo empleado')
@section('page-title', 'Nuevo empleado')

@section('content')
<div class="row justify-content-center">
<div class="col-lg-8">
<div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 fw-semibold py-3">
        <i class="bi bi-person-badge me-2 text-info"></i>Crear empleado
    </div>
    <div class="card-body">
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0 ps-3">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul>
            </div>
        @endif
        <form method="POST" action="{{ route('admin.empleados.store') }}">
            @csrf
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Nombre *</label>
                    <input type="text" name="nombre" class="form-control" value="{{ old('nombre') }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Apellido *</label>
                    <input type="text" name="apellido" class="form-control" value="{{ old('apellido') }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Email *</label>
                    <input type="email" name="email" class="form-control" value="{{ old('email') }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Teléfono</label>
                    <input type="text" name="telefono" class="form-control" value="{{ old('telefono') }}">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Puesto *</label>
                    <input type="text" name="puesto" class="form-control" value="{{ old('puesto') }}" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">Salario (€)</label>
                    <input type="number" name="salario" class="form-control" value="{{ old('salario') }}" step="0.01" min="0">
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">Fecha contratación *</label>
                    <input type="date" name="fecha_contratacion" class="form-control" value="{{ old('fecha_contratacion') }}" required>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-info text-white"><i class="bi bi-check-lg me-1"></i> Guardar</button>
                <a href="{{ route('admin.empleados.index') }}" class="btn btn-outline-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
</div>
</div>
@endsection
