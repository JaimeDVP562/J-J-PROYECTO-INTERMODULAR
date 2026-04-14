@extends('layouts.admin')
@section('title', 'Editar empleado')
@section('page-title', 'Editar empleado')

@section('content')
<div class="row justify-content-center">
<div class="col-lg-8">
<div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 fw-semibold py-3">
        <i class="bi bi-pencil me-2 text-primary"></i>Editar: {{ $empleado->nombre }} {{ $empleado->apellido }}
    </div>
    <div class="card-body">
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0 ps-3">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul>
            </div>
        @endif
        <form method="POST" action="{{ route('admin.empleados.update', $empleado->id) }}">
            @csrf @method('PUT')
            <div class="row g-3">
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Nombre *</label>
                    <input type="text" name="nombre" class="form-control" value="{{ old('nombre', $empleado->nombre) }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Apellido *</label>
                    <input type="text" name="apellido" class="form-control" value="{{ old('apellido', $empleado->apellido) }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Email *</label>
                    <input type="email" name="email" class="form-control" value="{{ old('email', $empleado->email) }}" required>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Teléfono</label>
                    <input type="text" name="telefono" class="form-control" value="{{ old('telefono', $empleado->telefono) }}">
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-semibold">Puesto *</label>
                    <input type="text" name="puesto" class="form-control" value="{{ old('puesto', $empleado->puesto) }}" required>
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">Salario (€)</label>
                    <input type="number" name="salario" class="form-control" value="{{ old('salario', $empleado->salario) }}" step="0.01" min="0">
                </div>
                <div class="col-md-3">
                    <label class="form-label fw-semibold">Fecha contratación *</label>
                    <input type="date" name="fecha_contratacion" class="form-control"
                           value="{{ old('fecha_contratacion', $empleado->fecha_contratacion) }}" required>
                </div>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg me-1"></i> Actualizar</button>
                <a href="{{ route('admin.empleados.index') }}" class="btn btn-outline-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
</div>
</div>
@endsection
