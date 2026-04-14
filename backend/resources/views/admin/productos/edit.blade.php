@extends('layouts.admin')

@section('title', 'Editar producto')
@section('page-title', 'Editar producto')

@section('content')
<div class="row justify-content-center">
    <div class="col-lg-8">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 fw-semibold py-3">
                <i class="bi bi-pencil me-2 text-primary"></i>Editar: {{ $producto->nombre }}
            </div>
            <div class="card-body">
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0 ps-3">
                            @foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('admin.productos.update', $producto->id) }}">
                    @csrf @method('PUT')
                    <div class="row g-3">
                        <div class="col-md-8">
                            <label class="form-label fw-semibold">Nombre *</label>
                            <input type="text" name="nombre" class="form-control @error('nombre') is-invalid @enderror"
                                   value="{{ old('nombre', $producto->nombre) }}" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">SKU</label>
                            <input type="text" name="sku" class="form-control"
                                   value="{{ old('sku', $producto->sku) }}">
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-semibold">Descripción</label>
                            <textarea name="descripcion" class="form-control" rows="3">{{ old('descripcion', $producto->descripcion) }}</textarea>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Precio (€) *</label>
                            <input type="number" name="precio" class="form-control @error('precio') is-invalid @enderror"
                                   value="{{ old('precio', $producto->precio) }}" step="0.01" min="0" required>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Stock</label>
                            <input type="number" name="stock_quantity" class="form-control"
                                   value="{{ old('stock_quantity', $producto->stock_quantity) }}" min="0">
                        </div>
                        <div class="col-md-4">
                            <label class="form-label fw-semibold">Categoría</label>
                            <select name="categoria_id" class="form-select">
                                <option value="">Sin categoría</option>
                                @foreach ($categorias as $cat)
                                    <option value="{{ $cat->id }}"
                                        {{ old('categoria_id', $producto->categoria_id) == $cat->id ? 'selected' : '' }}>
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
                                        {{ old('proveedor_id', $producto->proveedor_id) == $prov->id ? 'selected' : '' }}>
                                        {{ $prov->nombre }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                    <div class="d-flex gap-2 mt-4">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Actualizar
                        </button>
                        <a href="{{ route('admin.productos.index') }}" class="btn btn-outline-secondary">Cancelar</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
