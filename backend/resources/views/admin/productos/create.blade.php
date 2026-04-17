@extends('layouts.admin')

@section('title', 'Nuevo producto')
@section('page-title', 'Nuevo producto')

@section('content')
<div class="row justify-content-center">
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 fw-semibold py-3">
                <i class="bi bi-plus-circle me-2 text-success"></i>Crear producto
            </div>
            <div class="card-body">
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0 ps-3">
                            @foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('admin.productos.store') }}">
                    @csrf
                    <div class="row g-3">
                        <div class="col-md-8">
                            <label class="form-label fw-semibold">Nombre *</label>
                            <input type="text" name="nombre" class="form-control @error('nombre') is-invalid @enderror"
                                   value="{{ old('nombre') }}" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">SKU</label>
                            <input type="text" name="sku" class="form-control @error('sku') is-invalid @enderror"
                                   value="{{ old('sku') }}" placeholder="ej: PROD-001">
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">Descripción</label>
                            <textarea name="descripcion" class="form-control" rows="3">{{ old('descripcion') }}</textarea>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Precio (€) *</label>
                            <input type="number" name="precio" class="form-control @error('precio') is-invalid @enderror"
                                   value="{{ old('precio') }}" step="0.01" min="0" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Stock inicial</label>
                            <input type="number" name="stock_quantity" class="form-control"
                                   value="{{ old('stock_quantity', 0) }}" min="0">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Categoría</label>
                            <select name="categoria_id" class="form-select">
                                <option value="">Sin categoría</option>
                                @foreach ($categorias as $cat)
                                    <option value="{{ $cat->id }}"
                                        {{ old('categoria_id') == $cat->id ? 'selected' : '' }}>
                                        {{ $cat->nombre }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Proveedor</label>
                            <select name="proveedor_id" class="form-select">
                                <option value="">Sin proveedor</option>
                                @foreach ($proveedores as $prov)
                                    <option value="{{ $prov->id }}"
                                        {{ old('proveedor_id') == $prov->id ? 'selected' : '' }}>
                                        {{ $prov->nombre }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="d-flex gap-2 mt-4">
                        <button type="submit" class="btn btn-success">
                            <i class="bi bi-check-lg me-1"></i> Guardar producto
                        </button>
                        <a href="{{ route('admin.productos.index') }}" class="btn btn-outline-secondary">Cancelar</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
